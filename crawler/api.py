import requests
import json
import typing

headers = {'user-agent': 'Mozilla/5.0 (Macintosh Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'}


def get_type() -> list:
    """
    {
        "uid": "870A5373-5B3A-415A-AF8F-BB01B733444F",
        "type": "1",
        "cname": "學士班課程",
        "ename": "Undergraduate courses"
    }
    """
    res = requests.get('https://timetable.nctu.edu.tw/?r=main/get_type', headers=headers)
    return res.json()


def get_category(ftype, flang, acysem):
    """
    param:
        ftype: D8E6F0E8-126D-4C2F-A0AC-F9A96A5F6D5D
        flang: zh-tw
        acysem: 1091
    """
    res = requests.post('https://timetable.nctu.edu.tw/?r=main/get_category', data={
        'ftype': ftype,
        'flang': flang,
        'acysem': acysem,
        'acysemend': acysem
    }, headers=headers)
    return res.json()


def get_college(ftype, flang, acysem, fcategory):
    res = requests.post('https://timetable.nctu.edu.tw/?r=main/get_college', data={
        'ftype': ftype,
        'flang': flang,
        'acysem': acysem,
        'acysemend': acysem,
        'fcategory': fcategory
    }, headers=headers)
    return res.json()


def get_dep(ftype, flang, acysem, fcategory, fcollege):
    res = requests.post('https://timetable.nctu.edu.tw/?r=main/get_dep', data={
        'ftype': ftype,
        'flang': flang,
        'acysem': acysem,
        'acysemend': acysem,
        'fcategory': fcategory,
        'fcollege': fcollege
    }, headers=headers)
    return res.json()


def get_grade(ftype, flang, acysem, fcategory, fcollege, fdep):
    res = requests.post('https://timetable.nctu.edu.tw/?r=main/get_grade', data={
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
    res = requests.post('https://timetable.nctu.edu.tw/?r=main/get_cos_list', data={
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
        'm_costype': '**'
    }, headers=headers)
    return res.json()


def get_all_cos(acysem):
    res = requests.post('https://timetable.nctu.edu.tw/?r=main/get_cos_list', data={
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
    return res.json()


def course_pipe(_data):
    courses = []
    for did in _data:
        data = _data[did]
        i = 1
        while str(i) in data:
            cs = data[str(i)]
            keys = ['TURL', 'cos_cname', 'cos_code', 'cos_credit', 'cos_ename',
                    'cos_hours', 'cos_type', 'cos_type_e', 'memo', 'num_limit',
                    'reg_num', 'teacher', 'cos_time']
            for cid in cs:
                obj = {}
                for k in keys:
                    obj[k] = cs[cid][k]
                obj['cos_id'] = cs[cid]['acy'] + cs[cid]['sem'] + '_' + cs[cid]['cos_id']
                obj['brief_code'] = list(data['brief'][cid])[0]
                obj['lang'] = data['language'][cid]['授課語言代碼'] 
                #
                courses.append(obj)
            i += 1
    return courses


def course_id_pipe(_data):
    courses = []
    for did in _data:
        data = _data[did]
        i = 1
        while str(i) in data:
            courses.extend(list(data[str(i)]))
            i += 1
    return courses
