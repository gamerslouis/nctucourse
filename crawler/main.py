from ast import arg
import os, sys
import django
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nctucourse.settings.development")
django.setup()

import argparse
import shutil
import fetch
import build_simdata
import migrate_course_table
import pack
from git import Repo
import logging
import json

from simulation.models import SemesterCoursesMapping, SimCollect
from django.db import transaction

FORMAT = '%(asctime)s %(levelname)s: %(message)s'
logging.basicConfig(level=logging.INFO, filename='crawler.log', format=FORMAT)

def main(args):
    try:
        sem = args.semester
        root = "workspace"
        gitroot = 'nctucourse/coursedata/'
        gitrepo = 'gamerslouis.github.io/'

        logging.info("Work directory:" + root)
        if not 'fetch' in args.ignore_stage:
            shutil.rmtree(root, ignore_errors=True)
            os.makedirs(root, exist_ok=True)
            logging.info("Fetch Stage")
            fetch.work(sem, root)

        if args.type == 'sim':
            if not 'build' in args.ignore_stage:
                logging.info("Build Stage")
                build_simdata.work(sem, root)
                timestamp = pack.work(sem, root)

            if not 'pack' in args.ignore_stage:
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

            if not 'migrate' in args.ignore_stage:
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
                                logging.warn("delete courses too many, reject: " + str(len(deletedIds)))
                                raise Exception("Abort")
                            else:
                                SimCollect.objects.filter(semester=sem, course_id__in=deletedIds).delete()
                                logging.info("delete courses: " + str(deletedIds))
                        else:
                            logging.info("no course deleted")
        elif args.type == 'course':
            migrate_course_table.work(root)

        logging.info("Finish")
    except:
        logging.error("Crawler fail", exc_info=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-s', '--semester', help='semester', required=True)
    parser.add_argument('-u', '--upload', help='upload sim data to github page', action='store_true')
    parser.add_argument('-t', '--type', choices=['sim', 'course'], default='sim')
    parser.add_argument('--ignore-stage', help='ignore stage', action='append', default=[], 
                        choices=['fetch', 'build', 'upload', 'migrate'])
    args = parser.parse_args()
    main(args)
