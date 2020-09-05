import { handleActions } from 'redux-actions'
import { FETCH_STATUS } from '../Actions'

const initialState = {
    user: {
        username: '',
        email: '',
        is_anonymous: true,
        status: FETCH_STATUS.IDEL
    },
    database: {
        status: FETCH_STATUS.IDEL,
        category: [],
        courses: {},
        categoryMap: {}
    },
    query: {
    },
    collect: {
        courseIds: new Set()
    },
    timetable: {
        courseIds: new Set(),
    },
    settings: {
        ignoreFreshPhysical: false,
        ignoreFreshEnglish: false,
        extendTimetable: true,
        showWeekend: true,
        hideOverflowText: true
    },
    hoverCourseId: '',
    gpa: {
        courses: [],
        overall40GPA: 0.00,
        overall43GPA: 0.00,
        last6040GPA: 0.00,
        last6043GPA: 0.00,
        last60Credits: 0
    }
}

export default handleActions({
    USER: {
        STORE: (state, action) => ({
            ...state, user: {
                ...state.user,
                ...action.payload
            }
        })
    },
    DATABASE: {
        STORE: (state, action) => ({
            ...state, database: {
                ...state.database,
                ...action.payload
            }
        }),
    },
    QUERY: {
        STORE: (state, action) => ({
            ...state, query: {
                ...state.query,
                ...action.payload
            }
        })
    },
    COLLECT: {
        STORE: (state, action) => ({
            ...state, collect: {
                ...state.collect,
                ...action.payload
            }
        }),
        COURSE_IDS: {
            ADD: (state, action) => ({
                ...state, collect: {
                    ...state.collect,
                    courseIds: new Set(state.collect.courseIds).add(action.payload)
                }
            }),
            REMOVE: (state, action) => {
                let newer = new Set(state.collect.courseIds)
                newer.delete(action.payload)
                return {
                    ...state, collect: {
                        ...state.collect,
                        courseIds: newer
                    }
                }
            },
            STORE: (state, action) => ({
                ...state, collect: {
                    ...state.collect,
                    courseIds: new Set(action.payload)
                }
            }),
        }
    },
    TIMETABLE: {
        STORE: (state, action) => ({
            ...state, timetable: {
                ...state.timetable,
                ...action.payload
            }
        }),
        COURSE_IDS: {
            ADD: (state, action) => ({
                ...state, timetable: {
                    ...state.timetable,
                    courseIds: new Set(state.timetable.courseIds).add(action.payload)
                }
            }),
            REMOVE: (state, action) => {
                let newer = new Set(state.timetable.courseIds)
                newer.delete(action.payload)
                return {
                    ...state, timetable: {
                        ...state.timetable,
                        courseIds: newer
                    }
                }
            },
            STORE: (state, action) => ({
                ...state, timetable: {
                    ...state.timetable,
                    courseIds: new Set(action.payload)
                }
            })
        }
    },
    SETTINGS: {
        STORE: (state, action) => ({
            ...state, settings: {
                ...state.settings,
                ...action.payload
            }
        })
    },
    HOVER_COURSE: (state, action) => ({
        ...state,
        hoverCourseId: action.payload
    }),
    CANCEL_HOVER_COURSE: (state, action) => ({
        ...state,
        hoverCourseId: ''
    }),
    GPA: {
        STORE: (state, action) => ({
            ...state, gpa: {
                ...state.gpa,
                ...action.payload
            }
        })
    },

}, initialState)

