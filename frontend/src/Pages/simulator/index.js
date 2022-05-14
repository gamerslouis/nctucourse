import { CircularProgress } from "@material-ui/core"
import axios from "axios"
import React from "react"
import DialogDisclaimer from "./Components/Dialogs/DialogDisclaimer"
import { CourseHistoryProvider, SimulatorContextProvider } from "./Context"
import SimulatorDesktopView from "./DesktopView"
import SimulatorMobileView from "./MobileView"
import { Base, LoadingContext } from "./style"
import { copyData, migrateData, updateData } from "./utilities"

class Simulator extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            context: {},
            contextDirty: false,
            contextReady: false,
            courses: {}
            ,
            dialogDisclaimerOpen: false
            ,
            collapseImportSuccess: false,
            collapseUnsavedChange: false
        }

        this.handleDisclaimerConfirm = this.handleDisclaimerConfirm.bind(this)
    }

    componentDidMount() {
        window.addEventListener("beforeunload", evt => {
            if (this.state.contextDirty) {
                const msg = "變更尚未保存！"
                evt.returnValue = msg
                return msg
            }
        })

        axios.post(`${process.env.REACT_APP_HOST}/api/accounts/sim_data`).then(res => res.data)
            .then(json => {
                if (!json.success || json.data === "") {
                    // requestConfirm
                    this.setState({ dialogDisclaimerOpen: true })
                }
                else {
                    const { data_JSONserialized, last_updated_time } = json
                    let data = JSON.parse(data_JSONserialized)
                    if (data.version !== 2)
                        data = migrateData(data)
                    this.setState({ context: data },
                        () => this.fetchCourseHistory(last_updated_time))
                }
            })
    }

    fetchCourseHistory(import_last_updated_time = "") {
        axios.get(`${process.env.REACT_APP_HOST}/api/accounts/courses_history`)
            .then(res => res.data).then(json => {
                const { data, last_updated_time: course_last_updated_time } = json
                const course_list = JSON.parse(data)
                const course_map = {}
                course_list.forEach(item => {
                    course_map[item.sem + "_" + item.id] = item
                })

                if (import_last_updated_time !== course_last_updated_time) {
                    this.setState({ courses: course_map },
                        () => this.updateImport(course_list, course_last_updated_time))
                }
                else {
                    this.setState({
                        courses: course_map,
                        contextReady: true
                    })
                }
            })
    }

    updateImport(course_list, course_last_updated_time) {
        axios.post(`${process.env.REACT_APP_HOST}/api/accounts/sim_imported`).then(res => res.data)
            .then(json => {
                const { imported_courses } = json
                const imported = imported_courses === "" ? [] : JSON.parse(imported_courses)

                // ! 抵免現在長怎樣？
                const history = course_list.filter(item => (
                    item.state === " " || item.score === "通過" || item.score < "F"
                ))

                const [data_new, imported_new] = updateData(history, copyData(this.state.context), imported)

                this.setState({ context: data_new, collapseImportSuccess: true },
                    () => this.syncToServer(imported_new, course_last_updated_time))
            })
    }

    syncToServer(imported_courses = undefined, last_updated_time = undefined) {
        const data = {}
        data["data"] = JSON.stringify(this.state.context)
        if (imported_courses)
            data["imported_courses"] = JSON.stringify(imported_courses)
        if (last_updated_time)
            data["last_updated_time"] = last_updated_time
        axios.post(`${process.env.REACT_APP_HOST}/api/accounts/sim_update`, data).then(res => {
            this.setState({
                contextReady: true,
                dialogDisclaimer: false,
                collapseUnsavedChange: false
            })
        })
    }

    handleDisclaimerConfirm() {
        axios.post(`${process.env.REACT_APP_HOST}/api/accounts/sim_confirm`, {})
            .then(() => {
                this.setState({ dialogDisclaimerOpen: false })
                this.fetchCourseHistory()
            })
    }

    render() {
        return (
            <Base>
                <DialogDisclaimer open={this.state.dialogDisclaimerOpen} onClose={this.handleDisclaimerConfirm} />
                {
                    this.state.contextReady ?
                        <CourseHistoryProvider value={this.state.courses}>
                            <SimulatorContextProvider value={this.state.context}>
                                {
                                    /mobile/i.test(navigator.userAgent) ?
                                        <SimulatorDesktopView /> :
                                        <SimulatorMobileView />
                                }
                            </SimulatorContextProvider>
                        </CourseHistoryProvider> :
                        <LoadingContext><CircularProgress /></LoadingContext>
                }
            </Base>
        )
    }
}

export default Simulator
