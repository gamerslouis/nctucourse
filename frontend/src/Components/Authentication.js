import React from 'react'
import { connect } from 'react-redux'
import { FETCH_STATUS } from '../Redux/Actions/index'
import { Route } from 'react-router-dom'


const Authentication = (props) => {
    const { user, anonymous, children } = props
    if ((user.status !== FETCH_STATUS.SUCCESS) && (user.status !== FETCH_STATUS.FAIL)) return null
    if (anonymous ^ !user.is_anonymous) {
        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        )
    }
    return <Route render={() => {
        window.location.href = '/login?info=1'
    }} />
}

const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps)(Authentication)