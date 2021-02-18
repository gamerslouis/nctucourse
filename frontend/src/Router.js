import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Authentication from './Components/Authentication'
import Navbar from './Components/navbar'


import Login from './Pages/login'
import Course from './Pages/course'
import GPA from './Pages/gpa'
import GPAImport from './Pages/gpa/import'
import Sim from './Pages/simulator'
// import { FETCH_STATUS } from './Redux/Actions'

const Router = (props) => (
    <BrowserRouter>
        <div>
            <Route render={({ location }) =>
                location.pathname !== "/login" ? <Navbar /> : null
            }
            />
            <Authentication anonymous>
                <Redirect to="/login" />
            </Authentication>

            <Switch>
                <Route exact path='/login' render={() => (
                    <React.Fragment>
                        <Authentication><Redirect to="/course" /></Authentication>
                        <Authentication anonymous><Login /></Authentication>
                    </React.Fragment>
                )} />
                <Route exact path='/course' component={Course} />
                <Route exact path='/gpa' component={GPA} />
                <Route exact path='/gpa/import' component={GPAImport} />
                <Route exact path='/simulator' component={Sim} />
                <Authentication >
                    <Route render={() => <Redirect to="/course" />} />
                </Authentication>
            </Switch>
        </div>
    </BrowserRouter>
)

const mapStateToProps = (state) => ({
    userFetchStatus: state.user.status
})

export default connect(mapStateToProps)(Router)