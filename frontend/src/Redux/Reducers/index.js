import { combineReducers } from 'redux'
import user from './user'
import courseSim from './courseSim'

export default combineReducers({
    user,
    courseSim
})