import os
import json

class _NewOldTimeConvert:
    new_keys = 'MTWRFSUyz1234n56789abcd'
    oringin_keys = '1234567MNABCDXEFGHYIJKL'

    def __init__(self):
        mapp = {}
        for _ in range(len(self.new_keys)):
            mapp[self.new_keys[_]] = self.oringin_keys[_]
        self.mapp = mapp

    def clean_time(self, time_str):
        each_time = list(map(lambda s: s.split('-'), time_str.split(',')))
        return ','.join([f'{self.time_map_to_origin(t)}-{str(r[0]) if len(r) > 0 else ""}' for t, *r in each_time])

    def time_map_to_origin(self, time_str):
        return ''.join(list(map(lambda c: self.mapp[c], time_str)))

def load_json(root, fname):
    with open(os.path.join(root, fname), 'r', encoding="utf-8") as f:
        data = json.load(f)
    return data