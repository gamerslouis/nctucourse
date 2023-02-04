from datetime import datetime
import json
import logging
import os
import sys
import django

import fetch
import build_simdata

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nctucourse.settings.development")
django.setup()

from simulation.models import SemesterCoursesMapping, SimCollect
from django.db import transaction


FORMAT = '%(asctime)s %(levelname)s: %(message)s'
logging.basicConfig(level=logging.DEBUG, filename='crawler.log', format=FORMAT)

if __name__ == "__main__":
    try:
        sem = sys.argv[1]
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

                ids = set(SimCollect.objects.filter(semester=sem).values_list(
                    'course_id', flat=True).distinct())
                dids = set(list(map(lambda v: v[0], builded_data['courses'])))
                deletedIds = ids.difference(dids)
                if len(deletedIds) > 0:
                    if len(deletedIds) > 20:
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
