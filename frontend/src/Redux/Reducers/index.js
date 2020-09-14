import { combineReducers } from 'redux'
import user from './user'
import gpa from './gpa'
import courseSim from './courseSim'

export default combineReducers({
    user,
    gpa,
    courseSim
})