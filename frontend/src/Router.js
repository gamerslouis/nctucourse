import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import Navbar from './Components/navbar'
import { isMaintaining } from './Util/dev'
import Maintain from './Components/Maintain'
import FullLoading from './Components/FullLoading'
import { FETCH_STATUS } from './Redux/Actions/index'
import ErrorBoundary from './Components/ErrorBoundary'
import AuthRoute from './Components/AuthRoute'
import Login from './Pages/login'
import Simulation from './Pages/simulation'
import GPA from './Pages/gpa'
import GPAImport from './Pages/gpa/import'
import CourseHistory from './Pages/gpa/history'
import Sim from './Pages/simulator'
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
                                <Route exact path='/' component={Login} />
                                <Route exact path='/courses' component={CourseList} />
                                <Route exact path='/courses/:cid' component={CoursePage} />
                                <Route exact path='/feedbacks' component={FeedbackList} />
                                <Route exact path='/feedbacks/edit' component={NewFeedback} />
                                <Route exact path='/feedbacks/edit/:fid' component={NewFeedback} />
                                <AuthRoute exact path='/simulation' render={() => {
                                    let urlParams = new URLSearchParams(window.location.search);
                                    if (urlParams.has('sem')) {
                                        return <Simulation semester={urlParams.get('sem')} />
                                    } else {
                                        return <Simulation />
                                    }
                                }} />
                                <AuthRoute exact path='/gpa' component={GPA} />
                                <AuthRoute exact path='/gpa/import' component={GPAImport} />
                                <AuthRoute exact path='/coursehistory' component={CourseHistory} />
                                <AuthRoute exact path='/simulation/history' component={SimulationHistory} />
                                <Route exact path='/simulator' component={Sim} />
                                <AuthRoute exact path='/profile' component={Profile} />
                                <Route render={() => {
                                    window.location.pathname = '/'
                                }} />
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