export const parse = (text) => {
    const lines = text.split('\n')
    let courses = []
    return courses.concat(parseBlockV2(lines, '學期成績紀錄'))
        .concat(handleTrans(parseBlockV2(lines, '學生抵免紀錄')))
}

const trim = str => str.replace(/^\s+|\s+$/g, '')
const isNum = str => str.match(/^\d+$/)

// duplicate
// const parseBlockV1 = (lines, head) => {
//     let courses = []
//     const credit = head === '學生抵免紀錄'
//     for (let line of lines.slice(lines.indexOf(head) + 2)) {
//         let eles = line.split('\t').map(trim)
//         if (eles.length === 0 || !isNum(eles[0])) break
//         if (eles.length < 6) continue
//         if (credit) {
//             courses.push({
//                 sem: '',
//                 id: eles[1],
//                 dep: '',
//                 cos_cname: eles[2],
//                 type: eles[4],
//                 cos_credit: Number(eles[3]),
//                 score: '抵免',
//                 levelScore: '抵免',
//                 scoreType: '抵免',
//                 state: eles[5],
//                 teacher: '',
//                 dimension: ''
//             })
//         } else {
//             courses.push({
//                 sem: eles[1],
//                 id: eles[2],
//                 dep: eles[3],
//                 cos_cname: eles[4],
//                 type: eles[5],
//                 cos_credit: Number(eles[6]),
//                 score: isNum(eles[7]) ? Number(eles[7]) : (eles[7] || ''),
//                 levelScore: eles[8] || '',
//                 scoreType: eles[9] || '',
//                 state: eles[10] || '',
//                 teacher: eles[11] || '',
//                 dimension: eles[12] || ''
//             })
//         }
//     }
//     return courses
// }

const parseBlockV2 = (lines, head) => {
    let courses = []
    const credit = head === '學生抵免紀錄'
    for (let line of lines.slice(lines.indexOf(head) + 2)) {
        let eles = line.split('\t').map(trim)
        if (eles.length === 0 || !isNum(eles[0])) break
        if (eles.length < 6) continue
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
            const _levelscore = eles[7] === 'W' || eles[8] === 'W' ? 'W' : eles[7]
            const scoreField = ['W', '通過', '不通過'].includes(_levelscore) ? _levelscore: (_levelscore ? '無資料' : '')
            const typeField = _levelscore ? ( _levelscore === '通過' || _levelscore === '不通過' ? '通過不通過' : '等第制' ) : ''

            courses.push({
                sem: eles[1],
                id: eles[2],
                dep: eles[3],
                cos_cname: eles[4],
                type: eles[5],
                cos_credit: Number(eles[6]),
                score: scoreField,
                levelScore: _levelscore || '',
                scoreType: typeField,
                state: eles[8] || '',
                teacher: eles[9] || '',
                dimension: eles[10] || ''
            })
        }
    }
    return courses
}

const handleTrans = (courses) => {
    courses.forEach((c, idx) => {
        let s = 0
        for (let i = 0; i <= idx; i++) {
            if (courses[i].id === courses[idx].id) {
                s++
            }
        }
        courses[idx].sem = "C" + ("000" + s).slice(-3)
    })
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

export const filterEffectiveCreditCourse = (course) => {
    return course.cos_credit > 0 && course.levelScore !== 'W' && course.scoreType === '百分法' && course.state === '已送註冊組'
}

export const filterTransCourse = (course) => {
    return course.score === '抵免'
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

