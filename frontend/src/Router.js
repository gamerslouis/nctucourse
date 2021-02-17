import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import Authentication from './Components/Authentication'
import Navbar from './Components/navbar'
import { isMaintaining } from './Util/dev'
import Maintain from './Components/Maintain'
import FullLoading from './Components/FullLoading'
import { FETCH_STATUS } from './Redux/Actions/index'
import ErrorBoundary from './Components/ErrorBoundary'

import Login from './Pages/login'
import Simulation from './Pages/simulation'
import GPA from './Pages/gpa'
import GPAImport from './Pages/gpa/import'
import SimulationHistory from './Pages/simulation/history'
import Profile from './Pages/profile'
import CourseList from './Pages/courses/list'
import CoursePage from './Pages/courses/single'
import FeedbackList from './Pages/courses/feedback/list'
import NewFeedback from './Pages/courses/feedback/new'

const Router = (props) => {
    if (isMaintaining) return <Maintain />
    else return (
        <ErrorBoundary>
            <React.Fragment>
                {FETCH_STATUS.FETCHING === props.userFetchStatus && <FullLoading show />}
                <BrowserRouter>
                    <div>
                        <Navbar />
                        <ErrorBoundary>
                            <Switch>
                                <Route exact path='/login' component={Login} />
                                <Route exact path='/courses' component={CourseList} />
                                <Route exact path='/courses/:cid' component={CoursePage} />
                                <Route exact path='/feedbacks' component={FeedbackList} />
                                <Route exact path='/feedbacks/edit' component={NewFeedback} />
                                <Route exact path='/feedbacks/edit/:fid' component={NewFeedback} />
                                <Authentication >
                                    <Switch>
                                        <Route exact path='/simulation' render={() => {
                                            let urlParams = new URLSearchParams(window.location.search);
                                            if (urlParams.has('sem')) {
                                                return <Simulation semester={urlParams.get('sem')} />
                                            } else {
                                                return <Simulation />
                                            }
                                        }} />
                                        <Route exact path='/gpa' component={GPA} />
                                        <Route exact path='/gpa/import' component={GPAImport} />
                                        <Route exact path='/simulation/history' component={SimulationHistory} />
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