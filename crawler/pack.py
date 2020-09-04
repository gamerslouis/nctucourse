from datetime import datetime
import json
import csv
import os


def work(sem, root):
    timestamp = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
    obj = {}
    with open(os.path.join(root, 'courses.csv')) as f:
        obj['courses'] = [r for r in csv.reader(f)][1:]

    with open(os.path.join(root, 'category.csv')) as f:
        obj['category'] = [r for r in csv.reader(f)]

    with open(os.path.join(root, 'category_map.json')) as f:
        obj['category_map'] = json.load(f)

    with open(os.path.join(root, 'all.json'), 'w') as f:
        json.dump(obj, f)

    print("Finish timestamp: ", timestamp)
