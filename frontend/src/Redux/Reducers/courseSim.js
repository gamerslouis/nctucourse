import { handleActions } from 'redux-actions'
import { FETCH_STATUS } from '../Actions'

const initialState = {
    database: {
        status: FETCH_STATUS.IDLE,
        category: [],
        courses: {},
        categoryMap: {}
    },
    query: {
        courseSearchList: []
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
        hideOverflowText: true,
        showRoomCode: false
    },
    hoverCourseId: '',
}

export default handleActions({
    COURSE_SIM: {
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
    },
}, initialState)

