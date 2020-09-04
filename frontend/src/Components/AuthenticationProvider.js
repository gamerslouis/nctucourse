import React from 'react'
import { connect } from 'react-redux'
import { fetchUserInfo, FETCH_STATUS } from '../Redux/Actions/index'

class AuthenticationProvider extends React.Component {
    componentDidMount() {
        if (this.props.status != FETCH_STATUS.FETCHING && this.props.state != FETCH_STATUS.SUCCESS)
            this.props.fetchUser()
    }

    render() {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    status: state.user.status
})

const mapDispatchToProps = (dispatch) => ({
    fetchUser: () => dispatch(fetchUserInfo())
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationProvider)