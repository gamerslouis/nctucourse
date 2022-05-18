import { CircularProgress } from "@material-ui/core"
import { Settings } from "@material-ui/icons"
import axios from "axios"
import React from "react"
import DialogCategoryAdd from "./Components/Dialogs/DialogCategoryAdd"
import DialogCategoryDelete from "./Components/Dialogs/DialogCategoryDelete"
import DialogCategoryRename from "./Components/Dialogs/DialogCategoryRename"
import DialogContextReset from "./Components/Dialogs/DialogContextReset"
import DialogDisclaimer from "./Components/Dialogs/DialogDisclaimer"
import DialogGroupAdd from "./Components/Dialogs/DialogGroupAdd"
import DialogGroupEdit from "./Components/Dialogs/DialogGroupEdit"
import DialogLayoutArrange from "./Components/Dialogs/DialogLayoutArrange"
import DialogTargetEdit from "./Components/Dialogs/DialogTargetEdit"
import DrawerOptions from "./Components/DrawerOptions"
import { SimulatorContext, SimulatorPropsContext } from "./Context"
import SimulatorDesktopView from "./DesktopView"
import SimulatorMobileView from "./MobileView"
import { Base, LoadingContext, OptionFab } from "./style"
import { copyData, migrateData, updateData } from "./utilities"

class Simulator extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            context: {},
            contextDirty: false,
            contextReady: false
            ,
            dialogDisclaimer: false,
            dialogEditingTarget: null,
            dialogCategoryAdd: false,
            dialogCategoryRename: null,
            dialogCategoryDelete: null,
            dialogGroupAdd: false,
            dialogGroupEdit: null,
            dialogLayoutArrange: false,
            dialogContextReset: false
            ,
            drawerOptions: false
            ,
            importSuccess: false
        }

        this.setContext = this.setContext.bind(this)
        this.syncToServer = this.syncToServer.bind(this)
        this.handleDisclaimerConfirm = this.handleDisclaimerConfirm.bind(this)
        this.handleOptionsOpen = this.handleOptionsOpen.bind(this)
        this.handleOptionsClose = this.handleOptionsClose.bind(this)
        this.handleImportSuccessClose = this.handleImportSuccessClose.bind(this)
        this.handleDirtyClose = this.handleDirtyClose.bind(this)
        this.handleTargetEdit = this.handleTargetEdit.bind(this)
        this.handleTargetEditClose = this.handleTargetEditClose.bind(this)
        this.handleCategoryAddOpen = this.handleCategoryAddOpen.bind(this)
        this.handleCategoryAddClose = this.handleCategoryAddClose.bind(this)
        this.handleCategoryRenameOpen = this.handleCategoryRenameOpen.bind(this)
        this.handleCategoryRenameClose = this.handleCategoryRenameClose.bind(this)
        this.handleCategoryDeleteOpen = this.handleCategoryDeleteOpen.bind(this)
        this.handleCategoryDeleteClose = this.handleCategoryDeleteClose.bind(this)
        this.handleGroupAddOpen = this.handleGroupAddOpen.bind(this)
        this.handleGroupAddClose = this.handleGroupAddClose.bind(this)
        this.handleGroupEditOpen = this.handleGroupEditOpen.bind(this)
        this.handleGroupEditClose = this.handleGroupEditClose.bind(this)
        this.handleLayoutArrangeOpen = this.handleLayoutArrangeOpen.bind(this)
        this.handleLayoutArrangeClose = this.handleLayoutArrangeClose.bind(this)
        this.handleContextResetOpen = this.handleContextResetOpen.bind(this)
        this.handleContextResetClose = this.handleContextResetClose.bind(this)
        this.handleContextResetConfirm = this.handleContextResetConfirm.bind(this)

        this.contextProps = {
            courses: {},
            setContext: this.setContext,
            handleTargetEdit: this.handleTargetEdit,
            handleCategoryAddOpen: this.handleCategoryAddOpen,
            handleCategoryRenameOpen: this.handleCategoryRenameOpen,
            handleCategoryDeleteOpen: this.handleCategoryDeleteOpen,
            handleGroupAddOpen: this.handleGroupAddOpen,
            handleGroupEditOpen: this.handleGroupEditOpen,
            handleLayoutArrangeOpen: this.handleLayoutArrangeOpen,
            handleContextResetOpen: this.handleContextResetOpen
        }
    }
    setContext(value, callback = undefined) {
        if (typeof value === 'function')
            this.setState(prevState => ({
                ...prevState,
                context: value(prevState.context),
                contextDirty: true
            }), callback)
        else
            this.setState({ context: value, contextDirty: true }, callback)
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
                    this.setState({ dialogDisclaimer: true })
                }
                else {
                    const { data: data_JSONserialized, last_updated_time } = json
                    let data = JSON.parse(data_JSONserialized)
                    if (data.version !== 2)
                        data = migrateData(data)
                    this.setState({ context: data },
                        () => this.fetchCourseHistory(last_updated_time))
                }
            })
    }

    fetchCourseHistory(import_last_updated_time = "", reset = false) {
        axios.get(`${process.env.REACT_APP_HOST}/api/accounts/courses_history`)
            .then(res => res.data).then(json => {
                const { data, last_updated_time: course_last_updated_time } = json
                const course_list = JSON.parse(data)
                const course_map = {}
                course_list.forEach(item => {
                    course_map[item.sem + "_" + item.id] = item
                })

                if (import_last_updated_time !== course_last_updated_time) {
                    this.contextProps.courses = course_map
                    this.updateImport(course_list, course_last_updated_time, reset)
                }
                else {
                    this.contextProps.courses = course_map
                    this.setState({ contextReady: true })
                    console.log(this.state.context)
                }
            })
    }

    updateImport(course_list, course_last_updated_time, reset = false) {
        axios.post(`${process.env.REACT_APP_HOST}/api/accounts/sim_imported`).then(res => res.data)
            .then(json => {
                const { imported_courses } = json
                const imported = imported_courses === "" ? [] : JSON.parse(imported_courses)

                const history = course_list.filter(item => (
                    item.levelScore === "" || item.levelScore === "抵免" || item.levelScore === "通過" || item.levelScore < "F"
                ))

                const [data_new, imported_new] = updateData(history, reset ? {} : copyData(this.state.context), reset ? [] : imported)

                this.setState({ context: data_new, importSuccess: true },
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
                contextDirty: false,
                dialogDisclaimer: false
            })
            console.log(this.state.context)
        })
    }

    handleDisclaimerConfirm() {
        axios.post(`${process.env.REACT_APP_HOST}/api/accounts/sim_confirm`, {})
            .then(() => {
                this.setState({ dialogDisclaimer: false })
                this.fetchCourseHistory()
            })
    }

    handleOptionsOpen() { this.setState({ drawerOptions: true }) }
    handleOptionsClose() { this.setState({ drawerOptions: false }) }

    handleImportSuccessClose() { this.setState({ importSuccess: false }) }
    handleDirtyClose() { this.syncToServer() }

    handleTargetEdit(catid) { this.setState({ dialogEditingTarget: catid }) }
    handleTargetEditClose() { this.setState({ dialogEditingTarget: null }) }

    handleCategoryAddOpen() { this.setState({ dialogCategoryAdd: true }) }
    handleCategoryAddClose() { this.setState({ dialogCategoryAdd: false }) }
    handleCategoryRenameOpen(catid) { this.setState({ dialogCategoryRename: catid }) }
    handleCategoryRenameClose() { this.setState({ dialogCategoryRename: null }) }
    handleCategoryDeleteOpen(catid) { this.setState({ dialogCategoryDelete: catid }) }
    handleCategoryDeleteClose() { this.setState({ dialogCategoryDelete: null }) }

    handleGroupAddOpen() { this.setState({ dialogGroupAdd: true }) }
    handleGroupAddClose() { this.setState({ dialogGroupAdd: false }) }
    handleGroupEditOpen(catid) { this.setState({ dialogGroupEdit: catid }) }
    handleGroupEditClose() { this.setState({ dialogGroupEdit: null }) }

    handleLayoutArrangeOpen() { this.setState({ dialogLayoutArrange: true }) }
    handleLayoutArrangeClose() { this.setState({ dialogLayoutArrange: false }) }

    handleContextResetOpen() { this.setState({ dialogContextReset: true, drawerOptions: false }) }
    handleContextResetClose() { this.setState({ dialogContextReset: false }) }
    handleContextResetConfirm() { this.fetchCourseHistory("", true) }

    render() {
        return (
            <SimulatorPropsContext.Provider value={this.contextProps}>
                <SimulatorContext.Provider value={this.state.context}>
                    <Base>
                        <DrawerOptions open={this.state.drawerOptions} onClose={this.handleOptionsClose} />

                        <DialogDisclaimer open={this.state.dialogDisclaimer} onClose={this.handleDisclaimerConfirm} />
                        <DialogContextReset open={this.state.dialogContextReset}
                            onClose={this.handleContextResetClose} onSubmit={this.handleContextResetConfirm} />

                        {
                            this.state.contextReady ?
                                <>
                                    <DialogTargetEdit editingTarget={this.state.dialogEditingTarget} onClose={this.handleTargetEditClose} />

                                    <DialogCategoryAdd open={this.state.dialogCategoryAdd} onClose={this.handleCategoryAddClose} />
                                    <DialogCategoryRename catid={this.state.dialogCategoryRename} onClose={this.handleCategoryRenameClose} />
                                    <DialogCategoryDelete catid={this.state.dialogCategoryDelete} onClose={this.handleCategoryDeleteClose} />

                                    <DialogGroupAdd open={this.state.dialogGroupAdd} onClose={this.handleGroupAddClose} />
                                    <DialogGroupEdit catid={this.state.dialogGroupEdit} onClose={this.handleGroupEditClose} />

                                    <DialogLayoutArrange open={this.state.dialogLayoutArrange} onClose={this.handleLayoutArrangeClose} />

                                    {
                                        /mobile/i.test(navigator.userAgent) ?
                                            <SimulatorMobileView /> :
                                            <>
                                                <SimulatorDesktopView
                                                    dirty={this.state.contextDirty} onDirtyClose={this.handleDirtyClose}
                                                    importSuccess={this.state.importSuccess} onImportSuccessClose={this.handleImportSuccessClose} />
                                                <OptionFab size="small" color="secondary" onClick={this.handleOptionsOpen}>
                                                    <Settings />
                                                </OptionFab>
                                            </>
                                    }
                                </> :
                                <LoadingContext><CircularProgress /></LoadingContext>
                        }
                    </Base>
                </SimulatorContext.Provider>
            </SimulatorPropsContext.Provider>
        )
    }
}

export default Simulator
