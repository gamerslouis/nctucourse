import React from 'react'
import { useSelector } from 'react-redux'
import { FETCH_STATUS } from '../Redux/Actions/index'
import { Route } from 'react-router-dom'


const AuthRoute = (props) => {
    let user = useSelector(state => state.user)

    return <Route {...props} children={undefined} component={undefined} render={() => {
        if ((user.status !== FETCH_STATUS.SUCCESS) && (user.status !== FETCH_STATUS.FAIL)) return <div></div>
        if (!user.is_anonymous) {
            if (props.render) return props.render()
            return <Route {...props} />
        }
        else {
            window.location.href = '/login?info=1'
            return <div></div>
        }
    }} />
}

export default AuthRoute