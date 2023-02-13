from enum import Enum
import json
import requests

headers = {
    'user-agent': 'Mozilla/5.0 (Macintosh Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'}

from utils import _NewOldTimeConvert

session = requests.Session()
session.verify = False


class Lang(Enum):
    TW = 'zh-tw'
    US = 'en-us'

clean_new_time = _NewOldTimeConvert().clean_time

def get_type() -> list:
    """
    {
        "uid": "870A5373-5B3A-415A-AF8F-BB01B733444F",
        "type": "1",
        "cname": "學士班課程",
        "ename": "Undergraduate courses"
    }
    """
    res = session.get(
        'https://timetable.nycu.edu.tw/?r=main/get_type', headers=headers)
    return res.json()


def get_category(ftype, flang, acysem):
    """
    param:
        ftype: D8E6F0E8-126D-4C2F-A0AC-F9A96A5F6D5D (Timetalble Type uuid)
        flang: zh-tw
        acysem: 1091
    return:
        {'3*': '一般學士班'}
    """
    res = session.post('https://timetable.nycu.edu.tw/?r=main/get_category', data={
        'ftype': ftype,
        'flang': flang,
        'acysem': acysem,
        'acysemend': acysem
    }, headers=headers)
    return res.json()


def get_college(ftype, flang, acysem, fcategory):
    res = session.post('https://timetable.nycu.edu.tw/?r=main/get_college', data={
        'ftype': ftype,
        'flang': flang,
        'acysem': acysem,
        'acysemend': acysem,
        'fcategory': fcategory
    }, headers=headers)
    return res.json()


def get_dep(ftype, flang, acysem, fcategory, fcollege):
    res = session.post('https://timetable.nycu.edu.tw/?r=main/get_dep', data={
        'ftype': ftype,
        'flang': flang,
        'acysem': acysem,
        'acysemend': acysem,
        'fcategory': fcategory,
        'fcollege': fcollege
    }, headers=headers)
    return res.json()


def get_grade(ftype, flang, acysem, fcategory, fcollege, fdep):
    res = session.post('https://timetable.nycu.edu.tw/?r=main/get_grade', data={
        'ftype': ftype,
        'flang': flang,
        'acysem': acysem,
        'acysemend': acysem,
        'fcategory': fcategory,
        'fcollege': fcollege,
        'fdep': fdep,
        'fgroup': '**'
    }, headers=headers)
    return res.json()


def get_cos_list(acysem, fdepuuid, fgrade='**'):
    res = session.post('https://timetable.nycu.edu.tw/?r=main/get_cos_list', data={
        'm_acy': acysem[:-1],
        'm_sem': acysem[-1:],
        'm_acyend': acysem[:-1],
        'm_semend': acysem[-1:],
        'm_dep_uid': fdepuuid,
        'm_grade': fgrade,
        'm_group': '**',
        'm_class': '**',
        'm_option': '**',
        'm_crsname': '**',
        'm_teaname': '**',
        'm_cos_id': '**',
        'm_cos_code': '**',
        'm_crstime': '**',
        'm_crsoutline': '**',
        'm_costype': '**',
        'm_selcampus': '**'
    }, headers=headers)
    return parse_course_list(res.json())


def get_all_cos(acysem):
    """
        response:
            {
                "E55D50E2-B13D-4878-89C3-6317098C26CB": {
                    "1": {...},
                    "2": {...},
                    "brief": {...},
                    "costype": {...},
                    "dep_cname": "學士班大一大二不分系",
                    "dep_ename": "Department of Medicine",
                    "dep_id": "E55D50E2-B13D-4878-89C3-6317098C26CB",
                    "language": {...}
                },
                ...
            }
    """
    res = session.post('https://timetable.nycu.edu.tw/?r=main/get_cos_list', data={
        'm_acy': acysem[:-1],
        'm_sem': acysem[-1:],
        'm_acyend': acysem[:-1],
        'm_semend': acysem[-1:],
        'm_dep_uid': '**',
        'm_grade': '**',
        'm_group': '**',
        'm_class': '**',
        'm_option': '**',
        'm_crsname': '**',
        'm_teaname': '**',
        'm_cos_id': '**',
        'm_cos_code': '**',
        'm_crstime': '**',
        'm_crsoutline': '**',
        'm_costype': '**'
    }, headers=headers)

    return parse_course_list(res.json())



def parse_course_list(_data):
    """
    response:
        cos_id: str
        brief_code: str
        lang: str
        meta: str
        TURL: str
        cos_cname: str
        cos_code: str
        cos_credit: str
        cos_ename: str
        cos_hours: str
        cos_type: str
        cos_type_e: str
        memo: str
        num_limit: str
        reg_num: str
        teacher: str
        cos_time: str
    """
    courses = []
    ids = []
    for did in _data:
        data = _data[did]

        for dk in data.keys():
            if not dk.isnumeric():
                continue
            cs = data[dk]
            ids.extend(list(cs))  # key list is id list

            keys = ['TURL', 'cos_cname', 'cos_code', 'cos_credit', 'cos_ename',
                    'cos_hours', 'cos_type', 'cos_type_e', 'memo', 'num_limit',
                    'reg_num', 'teacher', 'cos_time']
            for cid in cs:
                obj: Course = {}  # type: ignore
                meta = {}
                for k in keys:
                    obj[k] = cs[cid][k]
                obj['cos_id'] = cid
                obj['brief_code'] = list(data['brief'][cid])[0]
                obj['lang'] = data['language'][cid]['授課語言代碼']
                obj['cos_code'] = obj['cos_code'].strip()
                obj['cos_time'] = clean_new_time(obj['cos_time'])
                try:
                    geci_name = data['costype'][cid]['通識跨院基本素養_通識跨院']['GECIName']
                    meta['geci'] = geci_name
                except KeyError:
                    pass
                meta['cos_ename'] = cs[cid]['cos_ename']
                obj['meta'] = json.dumps(meta)

                courses.append(obj)
    return courses, ids
