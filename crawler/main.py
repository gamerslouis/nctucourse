import argparse
from datetime import datetime
import json
import logging
import os
import re
import sys
import django

import fetch
import build_simdata

sys.path.append(os.path.abspath(os.path.join(
    os.path.dirname(__file__), '../backend')))
os.environ.setdefault("DJANGO_SETTINGS_MODULE",
                      "nctucourse.settings.development")
django.setup()

from simulation.models import SemesterCoursesMapping, SimCollect
from django.db import transaction


FORMAT = '%(asctime)s %(levelname)s: %(message)s'
logging.basicConfig(level=logging.DEBUG, filename='crawler.log', format=FORMAT)

def main(args):
    try:
        sem = args.semester

        file = ''
        if args.input:
            with open(args.input, 'r', encoding="utf-8") as f:
                builded_data = json.load(f)
            # use regex to get string '{any word}/{any word}/all.json' from input file
            file = re.search(r'[\w]+\/[\w-]+\/all.json$', args.input).group(0)
        else:
            storage = "storage"

            logging.info("Fetch Stage")
            fetch_result = fetch.work(sem)
            logging.info("Build Stage")
            builded_data = build_simdata.work(fetch_result)
            logging.info("Pack Stage")
            timestamp = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")

            tdir = os.path.join(storage, sem, timestamp)
            os.makedirs(tdir, exist_ok=True)
            with open(os.path.join(tdir, 'all.json'), 'w', encoding="utf-8") as f:
                json.dump(builded_data, f)
            print("Finish timestamp: ", timestamp)
            file = f'{sem}/{timestamp}/all.json'

        ### Update sql setting ###
        logging.info("Update sql setting")
        with transaction.atomic():
            if file != '':
                obj, created = SemesterCoursesMapping.objects.get_or_create(semester=sem, defaults={
                    'file': file
                })
                if not created:
                    obj.file = file
                    obj.save()

            ids = set(SimCollect.objects.filter(semester=sem).values_list(
                'course_id', flat=True).distinct())
            dids = set(list(map(lambda v: v[0], builded_data['courses'])))
            deletedIds = ids.difference(dids)
            if len(deletedIds) > 0:
                if len(deletedIds) > 20 and not args.force:
                    logging.warn(
                        "delete courses too many, reject: " + str(len(deletedIds)))
                    raise Exception("Abort")
                else:
                    SimCollect.objects.filter(
                        semester=sem, course_id__in=deletedIds).delete()
                    logging.info("delete courses: " + str(deletedIds))
            else:
                logging.info("no course deleted")

        logging.info("Finish")
    except:
        logging.error("Crawler fail", exc_info=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("semester", help="semester")
    parser.add_argument("-f", "--force", action="store_true",
                        help="force update database")
    parser.add_argument("-i", "--input", help="input file")
    args = parser.parse_args()
    main(args)
