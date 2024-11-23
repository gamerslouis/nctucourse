import argparse
from datetime import datetime
import json
import logging
import os
import re
import api

import fetch
import build_simdata

FORMAT = '%(asctime)s %(levelname)s: %(message)s'
logging.basicConfig(level=logging.DEBUG, format=FORMAT)


def get_last_semester():
    sems = api.get_acysem()
    sem = ''
    if sems[0][-1] == 'X':
        sem = sems[1]
    else:
        sem = sems[0]
    assert sem[-1] == '1' or sem[-1] == '2'
    return sem


def main(args):
    try:
        sem = args.semester
        if sem == '':
            sem = get_last_semester()
        logging.info(f"Start for {sem}")

        logging.info("Fetch Stage")
        fetch_result = fetch.work(sem)
        logging.info("Build Stage")
        builded_data = build_simdata.work(fetch_result)
        logging.info("Pack Stage")
        timestamp = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")

        tdir = os.path.join(args.storage, sem, timestamp)
        os.makedirs(tdir, exist_ok=True)
        with open(os.path.join(tdir, 'all.json'), 'w', encoding="utf-8") as f:
            json.dump(builded_data, f)
        print("Finish timestamp: ", timestamp)
        file = f'{sem}/{timestamp}/all.json'

        with open(args.output, 'w') as f:
            json.dump(
                {
                    'semester': sem,
                    'semesterDataFile': file,
                    'courseIds': list(map(lambda v: v[0], builded_data['courses'])),
                }, f
            )

        logging.info("Finish")
    except:
        logging.error("Crawler fail", exc_info=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-s", "--semester", help="semester", default="")
    parser.add_argument("--storage", default="storage")
    parser.add_argument("-o", "--output", default="result.json")
    args = parser.parse_args()
    main(args)
