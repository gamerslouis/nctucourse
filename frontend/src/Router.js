import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Authentication from './Components/Authentication'
import Navbar from './Components/navbar'
import { isMaintaining } from './Util/dev'
import Maintain from './Components/Maintain'
import FullLoading from './Components/FullLoading'
import { FETCH_STATUS } from './Redux/Actions/index'
import ErrorBoundary from './Components/ErrorBoundary'

import Login from './Pages/login'
import Course from './Pages/course'
import GPA from './Pages/gpa'
import GPAImport from './Pages/gpa/import'
import History from './Pages/history/index'
import Profile from './Pages/profile'

const Router = (props) => {
    if (isMaintaining) return <Maintain />
    else return (
        <ErrorBoundary>
            <React.Fragment>
                {FETCH_STATUS.FETCHING == props.userFetchStatus && <FullLoading show />}
                <BrowserRouter>
                    <div>
                        <Route render={({ location }) =>
                            location.pathname !== "/login" ? <Navbar /> : null
                        }
                        />
                        <ErrorBoundary>
                            <Switch>
                                <Route exact path='/login' component={Login} />
                                <Authentication >
                                    <Switch>
                                        <Route exact path='/course' render={() => {
                                            let urlParams = new URLSearchParams(window.location.search);
                                            if (urlParams.has('sem')) {
                                                return <Course semester={urlParams.get('sem')} />
                                            } else {
                                                return <Course />
                                            }
                                        }} />
                                        <Route exact path='/gpa' component={GPA} />
                                        <Route exact path='/gpa/import' component={GPAImport} />
                                        <Route exact path='/history' component={History} />
                                        <Route exact path='/profile' component={Profile} />
                                        <Route render={() => {
                                            window.location.pathname = '/login'
                                        }} />
                                    </Switch>
                                </Authentication>
                            </Switch>
                        </ErrorBoundary>
                    </div>
                </BrowserRouter>
            </React.Fragment>
        </ErrorBoundary>
    )
}

const mapStateToProps = (state) => ({
    userFetchStatus: state.user.status
})

export default connect(mapStateToProps)(Router)