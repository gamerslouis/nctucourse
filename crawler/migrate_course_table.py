import os, sys
import django
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nctucourse.settings.development")
django.setup()

import code
from courses.models import Course
from utils import load_json
from build_simdata import course_row_keys

def work(courses):
    cos_objs = []
    for _c in courses:
        c = {k: _c[i] for i, k in enumerate(course_row_keys)}

        
        aycsem, cos_id = c['cos_id'].split('_')
        cos = {'cname': c['cos_cname'].replace('(英文授課)', ''),
               'ename': c['cos_ename'],
               'ayc': aycsem[:-1],
               'sem': aycsem[-1:],
               'cos_id': cos_id,
               'perm_id': c['cos_code'].strip(),
               'english': c['lang'] != 'zh-tw',
               'credit': float(c['cos_credit']),
               'hours': float(c['cos_hours']),
               'time': c['cos_time'],
               'num_limit': c['num_limit'],
               'reg_number': c['reg_num'],
               'teacher_name': c['teacher'],
               'memo': c['memo']}
        cos_objs.append(Course(**cos))
    Course.objects.bulk_create(cos_objs, ignore_conflicts=True)

if __name__ == '__main__':
    code.interact(local=dict(globals(), **locals()))
