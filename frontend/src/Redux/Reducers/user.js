import { handleActions } from 'redux-actions'
import { FETCH_STATUS } from '../Actions'

const initialState = {
    username: '',
    email: '',
    is_anonymous: true,
    status: FETCH_STATUS.IDEL
}

export default handleActions({
    USER: {
        STORE: (state, action) => ({
            ...state,
            ...action.payload,
        })
    },
}, initialState)

