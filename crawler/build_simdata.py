from collections import OrderedDict
import code
from utils import _NewOldTimeConvert


clean_new_time = _NewOldTimeConvert().clean_time


def work(fetch_result):
    courses = fetch_result['courses']
    bachelor = fetch_result['bachelor']
    graduated = fetch_result['graduated']
    common = fetch_result['common']
    common_college = fetch_result['common_college']
    program = fetch_result['program']
    cross = fetch_result['cross']
    others = fetch_result['others']
    education = fetch_result['education']

    courses_map = {}
    for c in courses:
        c['lang'] = 0 if c['lang'] == 'zh-tw' else 1
        courses_map[c['cos_id']] = c
        c['cos_cname'] = c['cos_cname'].replace("（", "(").replace("）", ")")
        c['cos_hours'] = str(float(c['cos_hours']))
        c['cos_credit'] = str(float(c['cos_credit']))
        c['cos_time'] = clean_new_time(c['cos_time'])
        del c['cos_type_e']
        del c['cos_ename']

    graduateds = []
    categories = []
    category_map = OrderedDict()

    # 學士班課程
    category_map['學士班課程'] = OrderedDict()
    for collage_name, collage in bachelor.items():
        category_map['學士班課程'][collage_name] = OrderedDict()
        for dep_name, dep in collage.items():
            if dep_name not in graduateds:
                graduateds.append(dep_name)
            did = graduateds.index(dep_name)
            category_map['學士班課程'][collage_name][dep_name] = did
            for level, dep_courses in dep.items():
                cs = filter(lambda cid:
                            cid not in common['體育'] and
                            cid not in common['外語'] and
                            cid not in common['微積分'], dep_courses)
                categories.extend([[did, level, cid] for cid in cs])

    # 研究所課程
    category_map['研究所課程'] = OrderedDict()
    for collage_name, collage in graduated.items():
        category_map['研究所課程'][collage_name] = OrderedDict()
        for dep_name, dep in collage.items():
            if dep_name not in graduateds:
                graduateds.append(dep_name)
            did = graduateds.index(dep_name)
            category_map['研究所課程'][collage_name][dep_name] = did
            for level, dep_courses in dep.items():
                categories.extend([[did, level, cid]
                                   for cid in dep_courses])

    # 通識
    category_map['通識'] = OrderedDict()
    # 所有通識
    graduateds.append('所有通識')
    did = graduateds.index('所有通識')
    category_map['通識']['所有通識'] = did
    for cid in common['通識']:
        categories.append([did, 'all', cid])
    # 106 通識制度
    graduateds.extend(['▼▼▼以下為106舊制分類▼▼▼', '核心-人文',
                      '核心-社會', '核心-自然', '跨院', '校基本'])
    did = graduateds.index('核心-人文')
    category_map['通識']['▼▼▼以下為106舊制分類▼▼▼'] = None
    for idx, name in enumerate(['核心-人文', '核心-社會', '核心-自然', '跨院', '校基本']):
        category_map['通識'][name] = did+idx
    for cid in common['通識']:
        for idx, bid in enumerate(['A501', 'A502', 'A503', 'A504', 'A505']):
            if bid in courses_map[cid]['brief_code']:
                categories.append([did+idx, 'all', cid])

    # 110 通識制度
    graduateds.extend(['▼▼▼以下為110新制分類▼▼▼', '基本素養-批判思考', '基本素養-量性推理', '基本素養-組織管理', '基本素養-生命及品格教育',
                       '領域課程-人文與美學', '領域課程-個人、社會與文化', '領域課程-公民與倫理思考', '領域課程-社會中的科技與自然'])
    did = graduateds.index('基本素養-批判思考')
    category_map['通識']['▼▼▼以下為110新制分類▼▼▼'] = None
    for idx, name in enumerate(['基本素養-批判思考', '基本素養-量性推理', '基本素養-組織管理', '基本素養-生命及品格教育',
                                '領域課程-人文與美學', '領域課程-個人、社會與文化', '領域課程-公民與倫理思考', '領域課程-社會中的科技與自然']):
        category_map['通識'][name] = did+idx
    for cid in common['通識']:
        for idx, bid in enumerate(['Z101', 'Z102', 'Z103', 'Z104', 'Z105', 'Z106', 'Z107', 'Z108']):
            if bid in courses_map[cid]['brief_code']:
                categories.append([did+idx, 'all', cid])

    # 外語
    graduateds.append('外語')
    did = graduateds.index('外語')
    category_map['外語'] = did
    for cid in common['外語']:
        categories.append(
            [did, 'all' if '大一英文' not in courses_map[cid]['cos_cname']else '1', cid])

    # 體育
    graduateds.append('體育')
    did = graduateds.index('體育')
    category_map['體育'] = did
    for cid in common['體育']:
        courses_map[cid]['cos_type'] = '體育'
        categories.append(
            [did, 'all' if '大一體育' not in courses_map[cid]['cos_cname'] else '1', cid])

    # 其他共同課程
    category_map['學士班共同課程'] = OrderedDict()
    graduateds.append('▼▼▼校共同課程▼▼▼')
    category_map['學士班共同課程']['▼▼▼校共同課程▼▼▼'] = None
    for type in common.keys() - ['通識', '外語', '體育']:
        graduateds.append(type)
        did = graduateds.index(type)
        category_map['學士班共同課程'][type] = did
        for cid in common[type]:
            categories.append([did, 'all', cid])

    # 各學院共同必修
    graduateds.append('▼▼▼各院共同必修課程▼▼▼')
    category_map['學士班共同課程']['▼▼▼各院共同必修課程▼▼▼'] = None
    for type in common_college.keys():
        graduateds.append(type)
        did = graduateds.index(type)
        category_map['學士班共同課程'][type] = did
        for cid in common_college[type]:
            categories.append([did, 'all', cid])

    # 學分學程、跨域學程、其他課程
    for type_name, type in [('學分學程', program), ('跨領域學程', cross), ('其他課程', others)]:
        category_map[type_name] = OrderedDict()
        for dep_name, dep in type.items():
            graduateds.append(dep_name)
            did = graduateds.index(dep_name)
            category_map[type_name][dep_name] = did
            categories.extend([[did, 'all', cid] for cid in dep])

    # 教育學程
    graduateds.append('教育學程')
    did = graduateds.index('教育學程')
    category_map['教育學程'] = did
    categories.extend([[did, 'all', cid]for cid in education['教育學程']])

    keys = ['cos_id', 'TURL', 'cos_cname', 'cos_code', 'cos_credit',
            'cos_hours', 'cos_type', 'memo', 'num_limit',
            'reg_num', 'teacher', 'cos_time', 'brief_code', 'lang', 'meta']
    return {
        "courses": list([c[k] for k in keys] for c in courses_map.values()),
        "category": categories,
        "category_map": category_map
    }


if __name__ == '__main__':
    import code
    code.interact(local=dict(globals(), **locals()))
