import os, sys
import code
import django
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nctucourse.settings.development")
django.setup()

import shutil
import tempfile
import fetch
import build_simdata
import pack
from git import Repo
import logging
import json

from simulation.models import SemesterCoursesMapping, SimCollect
from django.db import transaction

FORMAT = '%(asctime)s %(levelname)s: %(message)s'
logging.basicConfig(level=logging.INFO, filename='crawler.log', format=FORMAT)

if __name__ == "__main__":
    try:
        sem = sys.argv[1]
        root = "workspace"
        gitroot = 'nctucourse/coursedata/'
        gitrepo = 'gamerslouis.github.io/'

        shutil.rmtree(root)
        os.makedirs(root, exist_ok=True)
        logging.info("Work directory:" + root)
        logging.info("Fetch Stage")
        fetch.work(sem, root)
        logging.info("Build Stage")
        build_simdata.work(sem, root)
        logging.info("Pack Stage")
        timestamp = pack.work(sem, root)

        # ### Upload Stage ###
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
        file = f'{sem}/{timestamp}/all.json'
        with transaction.atomic():
            obj, created = SemesterCoursesMapping.objects.get_or_create(semester=sem, defaults={
                'file': file
            })
            if not created:
                obj.file = file
                obj.save()

                ids = set(SimCollect.objects.filter(semester=sem).values_list('course_id', flat=True).distinct())
                with open(spath) as f:
                    dids = set(list(map(lambda v:v[0],json.load(f)['courses'])))
                deletedIds = ids.difference(dids)
                if len(deletedIds) > 0:
                    if len(deletedIds) > 20:
                        logging.warn("delete courses too many, reject: " + len(deletedIds))
                        raise Exception("Abort")
                    else:
                        SimCollect.objects.filter(semester=sem, course_id__in=deletedIds).delete()
                        logging.info("delete courses: " + str(deletedIds))
                else:
                    logging.info("no course deleted")

        logging.info("Finish")
    except:
        logging.error("Crawler fail", exc_info=True)
