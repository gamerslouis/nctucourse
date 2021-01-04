import sys
import os
import shutil
import tempfile
import fetch
import build_db
import pack
from git import Repo
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import logging
import json

FORMAT = '%(asctime)s %(levelname)s: %(message)s'
logging.basicConfig(level=logging.INFO, filename='crawler.log', format=FORMAT)

if __name__ == "__main__":
    try:
        sem = sys.argv[1]
        sql_str = os.environ.get('SQLALCHEMY_DATABASE_URI')
        assert sql_str is not None
        root = "workspace"
        gitroot = 'nctucourse/coursedata/'
        gitrepo = 'gamerslouis.github.io/'

        shutil.rmtree(root)
        os.makedirs(root, exist_ok=True)
        logging.info("Work directory:" + root)
        logging.info("Fetch Stage")
        fetch.work(sem, root)
        logging.info("Build Stage")
        build_db.work(sem, root)
        logging.info("Pack Stage")
        timestamp = pack.work(sem, root)

        ### Upload Stage ###
        logging.info("Upload Stage")
        spath = os.path.join(root,'all.json')
        rdir = os.path.join(gitroot, sem, timestamp)
        tdir = os.path.join(gitrepo, rdir)
        os.makedirs(tdir, exist_ok=True)
        tpath = os.path.join(tdir, 'all.json')
        shutil.copy(spath, tpath)
        repo = Repo(gitrepo)
        repo.index.add(items=[gitroot])
        repo.index.commit('Nctucourse crawler auto upload')
        repo.remote().push()
        logging.info("upload success")

        ### Update sql setting ###
        logging.info("Update sql setting")
        app = Flask(__name__)
        app.config['SQLALCHEMY_DATABASE_URI'] = sql_str
        db = SQLAlchemy(app)
        class SemesterMapping(db.Model):
            sem = db.Column(db.String(50), primary_key=True)
            file = db.Column(db.Text)
        class UserCollect(db.Model):
            id = db.Column(db.Integer, primary_key=True)
            uid = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
            courseId = db.Column(db.String(20), nullable=False)
            sem = db.Column(db.String(5), nullable=False)
            visible = db.Column(db.Boolean, nullable=False)
            __table_args__ = (
                db.UniqueConstraint('uid', 'courseId'),
            )
        with app.app_context():
            ids = set(list(map(lambda v:v[0], UserCollect.query.with_entities(UserCollect.courseId).filter_by(sem=sem).all())))
            with open(spath) as f:
                dids = set(list(map(lambda v:v[0],json.load(f)['courses'])))
            deletedIds = ids.difference(dids)
            if len(deletedIds) > 0:
                UserCollect.query.filter(UserCollect.courseId.in_(deletedIds)).delete(synchronize_session='evaluate')
                logging.info("delete courses: " + str(deletedIds))
            else:
                logging.info("no course deleted")

            semmap = SemesterMapping.query.filter_by(sem=sem).first()
            if semmap is not None:
                semmap.file = f'{sem}/{timestamp}/all.json'
            else:
                semmap = SemesterMapping(sem=sem, file=f'{sem}/{timestamp}/all.json')
                db.session.add(semmap)
            db.session.commit()

        logging.info("Finish")
    except:
        logging.error("Crawler fail", exc_info=True)
