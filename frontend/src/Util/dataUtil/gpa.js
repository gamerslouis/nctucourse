export const parse = (text) => {
    const lines = text.split('\n')
    let courses = []
    return courses.concat(parseBlock(lines, '學期成績紀錄'))
        .concat(parseBlock(lines, '學生抵免紀錄'))
}

const parseBlock = (lines, head) => {
    let courses = []
    const credit = head === '學生抵免紀錄'
    for (let line of lines.slice(lines.indexOf(head) + 2)) {
        let eles = line.split('\t')
        if (eles.length === 0 || Number.isNaN(Number(eles[0]))) break
        if (credit) {
            courses.push({
                sem: '',
                id: eles[1],
                dep: '',
                cos_cname: eles[2],
                type: eles[4],
                cos_credit: Number(eles[3]),
                score: '抵免',
                levelScore: '抵免',
                scoreType: '抵免',
                state: eles[5],
                teacher: '',
                dimension: ''
            })
        } else {
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

