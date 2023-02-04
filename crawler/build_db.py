import os, sys
import code
import django
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nctucourse.settings.development")
django.setup()

from courses.models import Course
from utils import _NewOldTimeConvert, load_json
clean_new_time = _NewOldTimeConvert().clean_time


def work(root):
    pass
    # courses = load_json(root, 'courses.json')
    # cos_objs = []
    # for c in courses:
    #     aycsem, cos_id = c['cos_id'].split('_')
    #     cos = {'cname': c['cos_cname'].replace('(英文授課)', ''),
    #            'ename': c['cos_ename'],
    #            'ayc': aycsem[:-1],
    #            'sem': aycsem[-1:],
    #            'cos_id': cos_id,
    #            'perm_id': c['cos_code'].strip(),
    #            'english': c['lang'] != 'zh-tw',
    #            'credit': float(c['cos_credit']),
    #            'hours': float(c['cos_hours']),
    #            'time': clean_new_time(c['cos_time']),
    #            'num_limit': c['num_limit'],
    #            'reg_number': c['reg_num'],
    #            'teacher_name': c['teacher'],
    #            'memo': c['memo']}
    #     cos_objs.append(Course(**cos))
    # Course.objects.bulk_create(cos_objs, ignore_conflicts=True)

if __name__ == '__main__':

    code.interact(local=dict(globals(), **locals()))