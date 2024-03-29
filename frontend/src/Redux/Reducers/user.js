import { handleActions } from 'redux-actions'
import { FETCH_STATUS } from '../Actions'

const initialState = {
    username: '',
    email: '',
    is_anonymous: true,
    social: [],
    status: FETCH_STATUS.IDLE,
    nickname: ''
}

export default handleActions({
    USER: {
        STORE: (state, action) => ({
            ...state,
            ...action.payload,
        })
    },
}, initialState)

