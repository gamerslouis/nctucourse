import api
import logging
from utils import list_to_dict

def work_type_category(t, lang, sem, category, allcourses):
    # 學士班課程、研究所課程
    id_map = {}
    # 學院列表
    collages = api.get_college(
        t,
        lang,
        sem,
        category)

    for collage, collage_name in collages.items():
        id_map[collage_name] = {}
        logging.debug("Fetch " + collage_name)
        deps = api.get_dep(
            t,
            lang,
            sem,
            category,
            collage
        )

        # Fix bug for College of Technology Law, except {} response []
        if isinstance(deps, list):
            continue

        for dep, dep_name in deps.items():
            id_map[collage_name][dep_name] = {}
            logging.debug("Fetch " + dep_name)
            grades = api.get_grade(
                t,
                lang,
                sem,
                category,
                collage,
                dep
            )
            if len(grades) == 0:
                courses, ids = api.get_cos_list(
                    sem,
                    dep
                )
                allcourses.extend(courses)
                id_map[collage_name][dep_name]['all'] = ids
            else:
                for level in grades:
                    courses, ids = api.get_cos_list(
                        sem,
                        dep,
                        str(level)
                    )
                    allcourses.extend(courses)
                    id_map[collage_name][dep_name]['all'] = ids
    return id_map


def work_common_class(t, lang, sem, category, allcourses):
    # 學士班共同課程、學分學程、跨域學程、其他課程、教育學程
    id_map = {}
    deps = api.get_dep(t, lang, sem, category, '*')
    for dep, dep_name in deps.items():
        logging.debug("Fetch " + dep_name)
        courses, ids = api.get_cos_list(sem, dep)
        allcourses.extend(courses)
        id_map[dep_name] = ids
    return id_map


def deduplice(courses):
    class Wrap:
        def __init__(self, obj) -> None:
            self.obj = obj

        def __hash__(self):
            return self.obj['cos_id'].__hash__()

        def __eq__(self, o: object) -> bool:
            return o.obj['cos_id'] == self.obj['cos_id'] # type: ignore
    return list(map(lambda x: x.obj, set(map(lambda c: Wrap(c), courses))))


def work(sem):
    lang = api.Lang.TW.value
    types: dict[str, api.TimetableType] = list_to_dict(api.get_type(), 'cname')
    allcourses = []
    fetch_result = {}

    fetch_result['bachelor'] = work_type_category(
        types['學士班課程']['uid'], lang, sem, '3*', allcourses)
    fetch_result['graduated'] = work_type_category(
        types['研究所課程']['uid'], lang, sem, '2*', allcourses)
    fetch_result['common'] = work_common_class(
        types['學士班共同課程']['uid'], lang, sem, '0G', allcourses)
    fetch_result['common_college'] = work_common_class(
        types['學士班共同課程']['uid'], lang, sem, '0C', allcourses)
    fetch_result['program'] = work_common_class(
        types['學分學程']['uid'], lang, sem, '0G', allcourses)
    fetch_result['cross'] = work_common_class(
        types['跨域學程']['uid'], lang, sem, '0G', allcourses)
    fetch_result['others'] = work_common_class(
        types['其他課程']['uid'], lang, sem, '0G', allcourses)
    fetch_result['education'] = work_common_class(
        types['教育學程']['uid'], lang, sem, '0G', allcourses)
    fetch_result['courses'] = deduplice(allcourses)

    return fetch_result


if __name__ == '__main__':
    import code
    code.interact(local=dict(globals(), **locals()))
