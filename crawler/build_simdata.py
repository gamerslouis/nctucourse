import os
from collections import OrderedDict
import json
import csv
import code
from utils import _NewOldTimeConvert, load_json


clean_new_time = _NewOldTimeConvert().clean_time


def work(sem, root):
    courses = load_json(root, 'courses.json')
    bachelor = load_json(root, 'bachelor.json')
    graduated = load_json(root, 'graduated.json')
    common = load_json(root, 'common.json')
    program = load_json(root, 'program.json')
    cross = load_json(root, 'cross.json')
    others = load_json(root, 'others.json')
    education = load_json(root, 'education.json')

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

    with open(os.path.join(root, 'courses.csv'), 'w', newline='', encoding="utf-8") as csvfile:
        keys = ['cos_id', 'TURL', 'cos_cname', 'cos_code', 'cos_credit',
                'cos_hours', 'cos_type', 'memo', 'num_limit',
                'reg_num', 'teacher', 'cos_time', 'brief_code', 'lang', 'meta']

        writer = csv.DictWriter(csvfile, delimiter=',', fieldnames=keys)
        writer.writeheader()
        writer.writerows(list(courses_map.values()))

    graduateds = []
    category_map = OrderedDict()

    with open(os.path.join(root, 'category.csv'), 'w', newline='', encoding="utf-8")as csvfile:
        writer = csv.writer(csvfile, delimiter=',')

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
                    writer.writerows([[did, level, cid] for cid in cs])

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
                    writer.writerows([[did, level, cid]
                                      for cid in dep_courses])

        # 通識
        category_map['通識'] = OrderedDict()
        graduateds.extend(['核心-人文', '核心-社會', '核心-自然', '跨院', '校基本'])
        did = graduateds.index('核心-人文')
        for idx, name in enumerate(['核心-人文', '核心-社會', '核心-自然', '跨院', '校基本']):
            category_map['通識'][name] = did+idx
        for cid in common['通識']:
            for idx, bid in enumerate(['A501', 'A502', 'A503', 'A504', 'A505']):
                if bid in courses_map[cid]['brief_code']:
                    writer.writerow([did+idx, 'all', cid])

        # 外語
        graduateds.append('外語')
        did = graduateds.index('外語')
        category_map['外語'] = did
        for cid in common['外語']:
            writer.writerow(
                [did, 'all' if '大一英文' not in courses_map[cid]['cos_cname']else '1', cid])

        # 體育
        graduateds.append('體育')
        did = graduateds.index('體育')
        category_map['體育'] = did
        for cid in common['體育']:
            courses_map[cid]['cos_type'] = '體育'
            writer.writerow(
                [did, 'all' if '大一體育' not in courses_map[cid]['cos_cname'] else '1', cid])

        # 其他共同課程
        category_map['學士班共同課程'] = OrderedDict()
        for type in common.keys() - ['通識', '外語', '體育']:
            graduateds.append(type)
            did = graduateds.index(type)
            category_map['學士班共同課程'][type] = did
            for cid in common[type]:
                writer.writerow([did, 'all', cid])

        # 學分學程、跨域學程、其他課程
        for type_name, type in [('學分學程', program), ('跨領域學程', cross), ('其他課程', others)]:
            category_map[type_name] = OrderedDict()
            for dep_name, dep in type.items():
                graduateds.append(dep_name)
                did = graduateds.index(dep_name)
                category_map[type_name][dep_name] = did
                writer.writerows([[did, 'all', cid] for cid in dep])

        # 教育學程
        graduateds.append('教育學程')
        did = graduateds.index('教育學程')
        category_map['教育學程'] = did
        writer.writerows([[did, 'all', cid]for cid in education['教育學程']])

    # with open('graduateds.csv', 'w', newline='')as csvfile:
    #     writer = csv.writer(csvfile, delimiter=',')
    #     writer.writerows(list(enumerate(graduateds)))

    with open(os.path.join(root, 'category_map.json'), 'w', encoding="utf-8") as f:
        json.dump(category_map, f, indent=4, ensure_ascii=False)


if __name__ == '__main__':
    import code
    code.interact(local=dict(globals(), **locals()))
