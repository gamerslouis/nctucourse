export const parse = (text) => {
    let lines = text.split('\n')
    lines = lines.slice(lines.indexOf('學期成績紀錄') + 2)
    let courses = []
    for (let line of lines) {
        let eles = line.split('\t')
        if (Number.isNaN(Number(eles[0]))) break
        courses.push({
            sem: eles[1],
            id: eles[2],
            dep: eles[3],
            cos_cname: eles[4],
            type: eles[5],
            cos_credit: Number(eles[6]),
            score: Number.isNaN(Number(eles[7])) ? eles[7] : Number(eles[7]),
            levelScore: eles[8],
            scoreType: eles[9],
            state: eles[10],
            teacher: eles[11],
            dimension: eles[12]
        })
    }
    return courses
}

export const courseTo43Point = (course) => {
    const levelMap = {
        'A+': 4.3,
        'A': 4.0,
        'A-': 3.7,
        'B+': 3.3,
        'B': 3.0,
        'B-': 2.7,
        'C+': 2.3,
        'C': 2.0,
        'C-': 1.7,
        'D': 1.0,
        'E': 0.0,
        'X': 0.0
    }
    return levelMap[course.levelScore]
}

export const courseTo40Point = (course) => {
    if (course.score >= 80) return 4
    if (course.score >= 70) return 3
    if (course.score >= 60) return 2
    if (course.score >= 50) return 1
    return 0
}

export const filterNotCourse = (course) => {
    return course.cos_credit > 0 && course.levelScore !== 'W' && course.scoreType === '百分法' && course.state === '已送註冊組'
}

export const getCredits = (courses) => {
    return courses.reduce((sum, c) => sum += c.cos_credit, 0)
}

export const getLast60Courses = (courses) => {
    let credits = 0
    let sem = null
    let newCourses = []
    for (let c of courses.reverse()) {
        if (sem !== null && c.sem !== sem) break
        credits += c.cos_credit
        newCourses.push(c)
        if (credits >= 60) sem = c.sem
    }
    return [newCourses, credits]
}

