import axios from 'axios'
import { createActions } from 'redux-actions'
import { makeCourseObject, makeObjFromArray, getCourseTimesAndRooms, filterCommonCourses } from '../../Util/dataUtil/course'

const useFakeData = false
const fakeData = {}

export const FETCH_STATUS = {
    IDLE: 1,
    FETCHING: 2,
    SUCCESS: 3,
    FAIL: 4
}

export const actions = createActions({
    USER: {
        STORE: null
    },
    COURSE_SIM: {
        DATABASE: {
            STORE: null
        },
        QUERY: {
            STORE: null
        },
        COLLECT: {
            STORE: null,
            COURSE_IDS: {
                ADD: null,
                REMOVE: null,
                STORE: null
            }
        },
        TIMETABLE: {
            STORE: null,
            COURSE_IDS: {
                ADD: null,
                REMOVE: null,
                STORE: null
            }
        },
        SETTINGS: {
            STORE: null
        },
        HOVER_COURSE: null,
        CANCEL_HOVER_COURSE: null,
    }
})

export const fetchDatabase = (semester) => dispatch => {
    let url = '/api/simulation/all/'
    if (semester !== undefined) {
        url += `?sem=${semester}`
    }
    axios.get(url)
        .then(res => res.data)
        .then(({ url, sem }) => {
            if (!window.localStorage) return { url, sem }
            let mapp
            if (window.localStorage.getItem('database_map') != null) {
                try {
                    mapp = JSON.parse(window.localStorage.getItem('database_map'))
                }
                catch {
                    mapp = { [sem]: 0 }
                }
            }
            else {
                mapp = { [sem]: 0 }
            }
            let cacheUrl = mapp[sem]
            if (cacheUrl === url) {
                try {
                    let cache = JSON.parse(window.localStorage.getItem(`db_cache_${sem}`))
                    dispatch(actions.courseSim.database.store({
                        status: FETCH_STATUS.SUCCESS,
                        category: cache.category.map(c => { c[0] = Number(c[0]); return c }),
                        courses: cache.courses.map(makeCourseObject).reduce(makeObjFromArray('cos_id'), {}),
                        categoryMap: cache.category_map
                    }))
                    dispatch(fetchUserCollect(semester))
                    return { sem: null, url: null }
                }
                catch { }
            }
            mapp[sem] = url


            window.localStorage.setItem('database_map', JSON.stringify(mapp))
            return { url, sem }
        })
        .then(({ url, sem }) => {
            if (url == null) return
            return axios.get(url).then(res => {
                dispatch(actions.courseSim.database.store({
                    status: FETCH_STATUS.SUCCESS,
                    category: res.data.category.map(c => { c[0] = Number(c[0]); return c }),
                    courses: res.data.courses.map(makeCourseObject).reduce(makeObjFromArray('cos_id'), {}),
                    categoryMap: res.data.category_map
                }))
                if (window.localStorage) {
                    window.localStorage.setItem(`db_cache_${sem}`, JSON.stringify(res.data))
                }
                dispatch(fetchUserCollect(semester))
            })
        })
        .catch(err => {
            if (useFakeData) {
                dispatch(actions.courseSim.database.store({
                    status: FETCH_STATUS.SUCCESS,
                    ...fakeData,
                    category: fakeData.data.category.map(c => { c[0] = Number(c[0]); return c }),
                    courses: fakeData.courses.map(makeCourseObject).reduce(makeObjFromArray('cos_id'), {})
                }))
                dispatch(fetchUserCollect(semester))
            }
            else {
                dispatch(actions.courseSim.database.store({
                    status: FETCH_STATUS.FAIL
                }))
            }
        })
}

export const fetchUserInfo = () => dispatch => {
    dispatch(actions.user.store({ status: FETCH_STATUS.FETCHING }))
    axios.get("/api/accounts/me/")
        .then(res => {
            dispatch(actions.user.store({ ...res.data, status: FETCH_STATUS.SUCCESS }))
        }).catch(err => {
            console.log(err)
            if (useFakeData)
                dispatch(actions.user.store({ is_anonymous: false, username: '0716000', status: FETCH_STATUS.SUCCESS, }))
            else
                dispatch(actions.user.store({ is_anonymous: true, status: FETCH_STATUS.FAIL }))
        })
}

export const fetchUserCollect = (semester) => dispatch => {
    let url = '/api/simulation/user/'
    if (semester !== undefined) {
        url += `?sem=${semester}`
    }
    axios.get(url)
        .then(res => {
            const { courses } = res.data
            let collect = []
            let timetable = []
            for (let course of courses) {
                collect.push(course['course_id'])
                if (course['visible']) { timetable.push(course['course_id']) }
            }
            dispatch(actions.courseSim.collect.courseIds.store(collect))
            dispatch(actions.courseSim.timetable.courseIds.store(timetable))
        }).catch(err => console.log)
}

export const addCollectCourse = (courseId, visible) => dispatch => {
    axios.post('/api/simulation/user/', { course_id: courseId, visible }).then(() => {
        dispatch(actions.courseSim.collect.courseIds.add(courseId))
        dispatch(actions.courseSim.timetable.courseIds.add(courseId))
    }).catch(err => {
        console.log(err)
        if (useFakeData) {
            dispatch(actions.courseSim.collect.courseIds.add(courseId))
            dispatch(actions.courseSim.timetable.courseIds.add(courseId))
        }
    })
}

export const removeCollectCourse = (courseId) => dispatch => {
    axios.delete('/api/simulation/user/', { data: { course_id: courseId } }).then(() => {
        dispatch(actions.courseSim.collect.courseIds.remove(courseId))
        dispatch(actions.courseSim.timetable.courseIds.remove(courseId))
    }).catch(err => {
        console.log(err)
        if (useFakeData) {
            dispatch(actions.courseSim.collect.courseIds.remove(courseId))
            dispatch(actions.courseSim.timetable.courseIds.remove(courseId))
        }
    })
}

export const toggleCollectCourseVisible = (courseId, visible) => dispatch => {
    axios.post('/api/simulation/user/', { course_id: courseId, visible }).then(() => {
        if (visible) dispatch(actions.courseSim.timetable.courseIds.add(courseId))
        else dispatch(actions.courseSim.timetable.courseIds.remove(courseId))
    }).catch(err => {
        console.log(err)
        if (useFakeData) {
            if (visible) dispatch(actions.courseSim.timetable.courseIds.add(courseId))
            else dispatch(actions.courseSim.timetable.courseIds.remove(courseId))
        }
    })
}

export const clearAllUserCourse = (semester) => dispatch => {
    let url = '/api/simulation/user/clear/'
    if (semester !== undefined) {
        url += `?sem=${semester}`
    }
    axios.get(url).then(() => {
        dispatch(actions.courseSim.timetable.courseIds.store([]))
        dispatch(actions.courseSim.collect.courseIds.store([]))
    }).catch(err => {
        console.log(err)
        if (useFakeData) {
            dispatch(actions.courseSim.timetable.courseIds.store([]))
            dispatch(actions.courseSim.collect.courseIds.store([]))
        }
    })
}

export const loadSavedSettings = () => (dispatch, getState) => {
    if (window.localStorage && window.localStorage.getItem('course_setting') != null) {
        let defaults = getState().courseSim.settings
        try {
            let saved = JSON.parse(window.localStorage.getItem('course_setting'))
            for (let key in defaults) {
                if (saved[key] !== undefined) {
                    defaults[key] = saved[key]
                }
            }
            window.localStorage.setItem('course_setting', JSON.stringify(defaults))
        }
        catch {
            window.localStorage.setItem('course_setting', JSON.stringify({}))
        }
        dispatch(actions.courseSim.settings.store(defaults))
    }
}

export const updateSetting = (key, value) => dispatch => {
    dispatch(actions.courseSim.settings.store({ [key]: value }))
    if (window.localStorage) {
        try {
            if (window.localStorage.getItem('course_setting') == null) {
                window.localStorage.setItem('course_setting', JSON.stringify({}))
            }
            let settings = JSON.parse(window.localStorage.getItem('course_setting'))
            settings[key] = value
            window.localStorage.setItem('course_setting', JSON.stringify(settings))
        }
        catch {
            window.localStorage.setItem('course_setting', JSON.stringify({}))
        }
    }
}

export const searchTimeCourses = (time, commonOnly) => (dispatch, getState) => {
    const { category, categoryMap } = getState().courseSim.database
    let allCourses = Object.values(getState().courseSim.database.courses)
    if (commonOnly) allCourses = filterCommonCourses(allCourses, categoryMap, category)
    const courses = allCourses
        .filter(course => getCourseTimesAndRooms(course).find(ctime => ctime[0] === time[0] && ctime[1] === time[1]))
    dispatch(setSearchCourseList(courses))
}

export const setSearchCourseList = (courses) => dispatch => {
    dispatch(actions.courseSim.query.store({ courseSearchList: courses }))
}

export const setNickname = (nick) => dispatch => {
    axios.post('/api/accounts/setnickname/', { nickname: nick }).then(res => {
        dispatch(actions.user.store({ nickname: nick }))
    })
}