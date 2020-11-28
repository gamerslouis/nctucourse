import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Authentication from './Components/Authentication'
import Navbar from './Components/navbar'
import { isMaintaining } from './Util/dev'
import Maintain from './Components/Maintain'

import Login from './Pages/login'
import Course from './Pages/course'
import GPA from './Pages/gpa'
import GPAImport from './Pages/gpa/import'
import History from './Pages/history/index'

const Router = (props) => {
    if (isMaintaining) return <Maintain />
    else return (
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
                    <Route exact path='/course' render={() => {
                        let urlParams = new URLSearchParams(window.location.search);
                        if(urlParams.has('sem')){
                            return <Course semester={urlParams.get('sem')} />
                        } else {
                            return <Course />
                        }
                    }} />
                    <Route exact path='/gpa' component={GPA} />
                    <Route exact path='/gpa/import' component={GPAImport} />
                    <Route exact path='/history' component={History} />
                    <Authentication >
                        <Route render={() => <Redirect to="/course" />} />
                    </Authentication>
                </Switch>
            </div>
        </BrowserRouter>
    )
}

const mapStateToProps = (state) => ({
    userFetchStatus: state.user.status
})

export default connect(mapStateToProps)(Router)