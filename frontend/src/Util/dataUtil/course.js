export function makeCourseObject(row) {
    const keys = ['cos_id', 'TURL', 'cos_cname', 'cos_code', 'cos_credit',
        'cos_hours', 'cos_type', 'memo', 'num_limit',
        'reg_num', 'teacher', 'cos_time', 'brief_code', 'lang', 'meta']
    let obj = {}
    for (let i in keys) {
        obj[keys[i]] = row[i]
        if (keys[i] === 'meta') {
            obj[keys[i]] = JSON.parse(row[i])
        }
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
    return category.filter(value => value[0] === depId).map(value => value[2]).filter(onlyUnique)
    // type of value and depId are different
}


export function getCoursesFromIds(allCourses, ids) {
    return ids.map(id => allCourses[id])
}

export const roomCodeMap = {
    YN: "護理館", YE: "實驗大樓", YR: "守仁樓", YS: "醫學二館",
    YB: "生醫工程館", YX: "知行樓", YD: "牙醫館", YK: "傳統醫學大樓(甲棟)",
    YT: "教學大樓", YM: "醫學館", YL: "圖書資源暨研究大樓", YA: "活動中心",
    YH: "致和樓", YC: "生物醫學大樓", AS: "中央研究院", PH: "臺北榮民總醫院",
    CH: "台中榮民總醫院", KH: "高雄榮民總醫院",
    C: "竹銘館", E: "教學大樓", LI: "實驗一館", BA: "生科實驗館",
    BB: "生科實驗二館", BI: "賢齊館	 ",
    EA: "工程一館", EB: "工程二館", EC: "工程三館", ED: "工程四館",
    EE: "工程五館", EF: "工程六館", M: "管理館", MB: "管理二館",
    SA: "科學一館", SB: "科學二館", SC: "科學三館", AC: "學生活動中心",
    A: "綜合一館", AB: "綜一地下室", HA: "人社一館", F: "人社二館",
    HC: "人社三館", CY: "交映樓", EO: "田家炳光電大樓", EV: "環工館",
    CS: "資訊技術服務中心", ES: "電子資訊中心", CE: "土木結構實驗室",
    TA: "會議室", TD: "一般教室", TC: "演講廳",
    CM: "奇美樓",
    HK: "客家大樓",
}

export function getCourseTimesAndRooms(course) {
    let { cos_time } = course
    let times = []
    for (let [unit, roomCode] of cos_time.split(',').map(e => e.split('-'))) {
        let roomName = ""
        if (roomCode === undefined) {

        }
        else if (Object.keys(roomCodeMap).indexOf(roomCode.slice(0, 2)) !== -1) {
            roomName = roomCodeMap[roomCode.slice(0, 2)] + roomCode.slice(2)
        }
        else if (Object.keys(roomCodeMap).indexOf(roomCode.slice(0, 1)) !== -1) {
            roomName = roomCodeMap[roomCode.slice(0, 1)] + roomCode.slice(1)
        }
        else {
            roomName = roomCode
        }

        let d = -1
        for (let i in unit) {
            if (Number.isInteger(Number(unit[i]))) {
                d = Number(unit[i])
            }
            else {
                times.push([d, unit[i], roomCode, roomName])
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

export function filterCommonCourses(allCourses, categoryMap, category) {
    let commonIds = Object.values(categoryMap['通識'])
    let courseIds = category.filter(c => commonIds.indexOf(Number(c[0])) !== -1).map(c => c[2])
    return allCourses.filter(c => courseIds.indexOf(c.cos_id) !== -1)
}