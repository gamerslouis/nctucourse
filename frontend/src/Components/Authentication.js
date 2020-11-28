import React from 'react'
import { connect } from 'react-redux'
import { FETCH_STATUS } from '../Redux/Actions/index'


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
    return null
}

const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps)(Authentication)