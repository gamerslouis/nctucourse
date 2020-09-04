export function makeCourseObject(row) {
    const keys = ['cos_id', 'TURL', 'cos_cname', 'cos_code', 'cos_credit',
        'cos_hours', 'cos_type', 'memo', 'num_limit',
        'reg_num', 'teacher', 'cos_time', 'brief_code', 'lang']
    let obj = {}
    for (let i in keys) {
        obj[keys[i]] = row[i]
    }
    return obj
}

export function makeObjFromArray(key) {
    return (obj, iter) => {
        obj[iter[key]] = iter
        return obj
    }
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

export function getCoursesIdByDepId(category, depId) {
    return category.filter(value => value[0] == depId).map(value => value[2]).filter(onlyUnique)
    // type of value and depId are different
}


export function getCoursesFromIds(allCourses, ids) {
    return ids.map(id => allCourses[id])
}

export function getCourseTimes(course) {
    let { cos_time } = course
    let times = []
    for (let unit of cos_time.split(',').map(e => e.split('-')[0])) {
        let d = -1
        for (let i in unit) {
            if (Number.isInteger(Number(unit[i]))) {
                d = Number(unit[i])
            }
            else {
                times.push([d, unit[i]])
            }
        }
    }
    return times
}

export function makeInfoPageUrl(courseId) {
    let [time, no] = courseId.split('_')
    let acy = time.slice(0, time.length - 1)
    let sem = time.slice(time.length - 1)
    return `https://timetable.nctu.edu.tw/?r=main/crsoutline&Acy=${acy}&Sem=${sem}&CrsNo=${no}&lang=zh-tw`
}
