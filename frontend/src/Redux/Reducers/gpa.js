import { handleActions } from 'redux-actions'
import { FETCH_STATUS } from '../Actions'

const initialState = {
    courses: [],
    overall40GPA: 0.00,
    overall43GPA: 0.00,
    last6040GPA: 0.00,
    last6043GPA: 0.00,
    last60Credits: 0
}

export default handleActions({
    GPA: {
        STORE: (state, action) => ({
            ...state,
            ...action.payload
        })
    },
}, initialState)

