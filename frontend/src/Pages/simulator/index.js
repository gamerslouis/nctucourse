import { CircularProgress, Divider, Hidden, ListItemIcon, Menu, MenuItem } from "@material-ui/core"
import { BarChart, Delete, FileCopy, Send, Settings, TextFields } from "@material-ui/icons"
import axios from "axios"
import { SnackbarProvider } from "notistack"
import React from "react"
import { DragDropContext } from "react-beautiful-dnd"
import DialogCategoryAdd from "./Components/Dialogs/DialogCategoryAdd"
import DialogCategoryDelete from "./Components/Dialogs/DialogCategoryDelete"
import DialogCategoryRename from "./Components/Dialogs/DialogCategoryRename"
import DialogCloneAdjust from "./Components/Dialogs/DialogCloneAdjust"
import DialogContextReset from "./Components/Dialogs/DialogContextReset"
import DialogDisclaimer from "./Components/Dialogs/DialogDisclaimer"
import DialogExportImage from "./Components/Dialogs/DialogExportImage"
import DialogGroupAdd from "./Components/Dialogs/DialogGroupAdd"
import DialogGroupEdit from "./Components/Dialogs/DialogGroupEdit"
import DialogLayoutArrange from "./Components/Dialogs/DialogLayoutArrange"
import DialogMoveTo from "./Components/Dialogs/DialogMoveTo"
import DialogTargetEdit from "./Components/Dialogs/DialogTargetEdit"
import DialogTemplatePort from "./Components/Dialogs/DialogTemplatePort"
import DrawerOptions from "./Components/DrawerOptions"
import { SimulatorContext, SimulatorPropsContext } from "./Context"
import SimulatorDesktopView from "./DesktopView"
import SimulatorMobileView from "./MobileView"
import { Base, LoadingContext, OptionFab } from "./style"
import { copyData, generateItemId, getRawCourseId, migrateData, updateData } from "./utilities"

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
            dialogContextReset: false,
            dialogCloneAdjust: false,
            dialogMoveTo: false,
            dialogTemplatePort: false,
            dialogExportImage: false
            ,
            drawerOptions: false
            ,
            menuUnusedIdx: null,
            menuUnusedAnchor: null,
            menuCourseIdx: null,
            menuCourseCatid: null,
            menuCourseItemid: null,
            menuCourseAnchor: null
            ,
            importSuccess: false
        }

        this.setContext = this.setContext.bind(this)
        this.updateImport = this.updateImport.bind(this)
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
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
        this.handleMenuUnusedOpen = this.handleMenuUnusedOpen.bind(this)
        this.handleMenuUnusedClose = this.handleMenuUnusedClose.bind(this)
        this.handleMenuCourseOpen = this.handleMenuCourseOpen.bind(this)
        this.handleMenuCourseClose = this.handleMenuCourseClose.bind(this)
        this.handleCopyCourseName = this.handleCopyCourseName.bind(this)
        this.handleCloneCourse = this.handleCloneCourse.bind(this)
        this.handleRemoveClone = this.handleRemoveClone.bind(this)
        this.handleCloneAdjustOpen = this.handleCloneAdjustOpen.bind(this)
        this.handleCloneAdjustClose = this.handleCloneAdjustClose.bind(this)
        this.handleMoveToOpen = this.handleMoveToOpen.bind(this)
        this.handleMoveToClose = this.handleMoveToClose.bind(this)
        this.handleTemplatePortOpen = this.handleTemplatePortOpen.bind(this)
        this.handleTemplatePortClose = this.handleTemplatePortClose.bind(this)
        this.handleExportImageOpen = this.handleExportImageOpen.bind(this)
        this.handleExportImageClose = this.handleExportImageClose.bind(this)

        this.contextProps = {
            courses: {},
            mobile: /mobile/i.test(navigator.userAgent),
            setContext: this.setContext,
            handleTargetEdit: this.handleTargetEdit,
            handleCategoryAddOpen: this.handleCategoryAddOpen,
            handleCategoryRenameOpen: this.handleCategoryRenameOpen,
            handleCategoryDeleteOpen: this.handleCategoryDeleteOpen,
            handleGroupAddOpen: this.handleGroupAddOpen,
            handleGroupEditOpen: this.handleGroupEditOpen,
            handleLayoutArrangeOpen: this.handleLayoutArrangeOpen,
            handleContextResetOpen: this.handleContextResetOpen,
            handleMenuUnusedOpen: this.handleMenuUnusedOpen,
            handleMenuCourseOpen: this.handleMenuCourseOpen,
            handleTemplatePortOpen: this.handleTemplatePortOpen,
            handleExportImageOpen: this.handleExportImageOpen
        }
        this.course_list = []
        this.course_last_updated_time = ""
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

    fetchCourseHistory(import_last_updated_time = null) {
        axios.get(`${process.env.REACT_APP_HOST}/api/accounts/courses_history`)
            .then(res => res.data).then(json => {
                const { data, last_updated_time: course_last_updated_time } = json
                const course_list = JSON.parse(data)

                const course_map = {}
                course_list.forEach(item => {
                    course_map[item.sem + "_" + item.id] = item
                })

                const history = course_list.filter(item => (
                    item.levelScore === "" || item.levelScore === "抵免" || item.levelScore === "通過" || item.levelScore < "F"
                ))
                this.course_list = history
                this.course_last_updated_time = course_last_updated_time ?? ""

                this.contextProps.courses = course_map
                if (import_last_updated_time !== this.course_last_updated_time) {
                    this.updateImport()
                }
                else {
                    this.setState({ contextReady: true })
                    console.log(this.state.context)
                }
            })
    }

    updateImport(reset = false, template = null) {
        axios.post(`${process.env.REACT_APP_HOST}/api/accounts/sim_imported`).then(res => res.data)
            .then(json => {
                const { imported_courses } = json
                const imported = imported_courses === "" ? [] : JSON.parse(imported_courses)

                const [data_new, imported_new] = updateData(this.course_list, reset ? {} : copyData(this.state.context), reset ? [] : imported, template)

                this.setState({ context: data_new, importSuccess: true },
                    () => this.syncToServer(imported_new))
            })
    }

    syncToServer(imported_courses = null) {
        const data = {}
        data["data"] = JSON.stringify(this.state.context)
        if (imported_courses !== null) {
            data["imported_courses"] = JSON.stringify(imported_courses)
            data["last_updated_time"] = this.course_last_updated_time
        }
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

    handleMenuUnusedOpen(idx, anchor) { this.setState({ menuUnusedIdx: idx, menuUnusedAnchor: anchor }) }
    handleMenuUnusedClose() { this.setState({ menuUnusedIdx: null, menuUnusedAnchor: null }) }

    handleMenuCourseOpen(idx, catid, itemId, anchor) { this.setState({ menuCourseIdx: idx, menuCourseCatid: catid, menuCourseItemid: itemId, menuCourseAnchor: anchor }) }
    handleMenuCourseClose() { this.setState({ menuCourseIdx: null, menuCourseCatid: null, menuCourseItemid: null, menuCourseAnchor: null }) }

    handleDragStart() {
        if (this.contextProps.mobile && this.context.options.dnd_vibrate && navigator.vibrate)
            navigator.vibrate(20)
    }
    handleDragEnd(result) {
        if (result.destination) {
            if (result.type === "COURSE") {
                const fromCatid = result.source.droppableId
                const toCatid = result.destination.droppableId
                const fromIdx = result.source.index
                const toIdx = result.destination.index
                this.setContext(ctx => {
                    if (fromCatid === toCatid) {
                        const cat_content = ctx.content[fromCatid].slice()
                        const [item] = cat_content.splice(fromIdx, 1)
                        cat_content.splice(toIdx, 0, item)

                        const content = { ...ctx.content }
                        content[fromCatid] = cat_content
                        return { ...ctx, content }
                    }
                    else {
                        const from_content = ctx.content[fromCatid].slice()
                        const [item] = from_content.splice(fromIdx, 1)

                        const to_content = ctx.content[toCatid].slice()
                        if (toCatid !== "unused" || item.indexOf("@") === -1)
                            to_content.splice(toIdx, 0, item)

                        const content = { ...ctx.content }
                        content[fromCatid] = from_content
                        content[toCatid] = to_content
                        return { ...ctx, content }
                    }
                })
            }
            if (result.type === "CATEGORY") {
                const plSize = result.source.droppableId.slice(0, 2)
                const fromPanelIdx = parseInt(result.source.droppableId.slice(3))
                const toPanelIdx = parseInt(result.destination.droppableId.slice(3))
                const fromIdx = result.source.index
                const toIdx = result.destination.index
                this.setContext(ctx => {
                    if (fromPanelIdx === toPanelIdx) {
                        const panel = ctx.panel_layouts[plSize][fromPanelIdx].slice()
                        const [item] = panel.splice(fromIdx, 1)
                        panel.splice(toIdx, 0, item)

                        const pl = ctx.panel_layouts[plSize].slice()
                        pl[fromPanelIdx] = panel

                        const panel_layouts = { ...ctx.panel_layouts }
                        panel_layouts[plSize] = pl
                        return { ...ctx, panel_layouts }
                    }
                    else {
                        const from_panel = ctx.panel_layouts[plSize][fromPanelIdx].slice()
                        const [item] = from_panel.splice(fromIdx, 1)

                        const to_panel = ctx.panel_layouts[plSize][toPanelIdx].slice()
                        to_panel.splice(toIdx, 0, item)

                        const pl = ctx.panel_layouts[plSize].slice()
                        pl[fromPanelIdx] = from_panel
                        pl[toPanelIdx] = to_panel

                        const panel_layouts = { ...ctx.panel_layouts }
                        panel_layouts[plSize] = pl
                        return { ...ctx, panel_layouts }
                    }
                })
            }
        }
    }

    handleCopyCourseName() {
        navigator.clipboard.writeText(this.contextProps.courses[getRawCourseId(this.state.menuCourseItemid)]?.cos_cname)
        this.handleMenuCourseClose()
    }
    handleCloneCourse() {
        this.handleMenuCourseClose()
        this.setContext(ctx => {
            const cat_content = ctx.content[this.state.menuCourseCatid].slice()
            const item = generateItemId(this.state.menuCourseItemid, true)
            cat_content.splice(this.state.menuCourseIdx + 1, 0, item)

            const content = { ...ctx.content }
            content[this.state.menuCourseCatid] = cat_content
            return { ...ctx, content }
        })
    }
    handleRemoveClone() {
        this.handleMenuCourseClose()
        this.setContext(ctx => {
            const cat_content = ctx.content[this.state.menuCourseCatid].slice()
            cat_content.splice(this.state.menuCourseIdx, 1)

            const content = { ...ctx.content }
            content[this.state.menuCourseCatid] = cat_content
            return { ...ctx, content }
        })
    }

    handleCloneAdjustOpen() { this.setState({ dialogCloneAdjust: true, menuCourseAnchor: null }) }
    handleCloneAdjustClose() { this.setState({ dialogCloneAdjust: false, menuCourseIdx: null, menuCourseCatid: null, menuCourseItemid: null }) }

    handleMoveToOpen() { this.setState({ dialogMoveTo: true, menuUnusedAnchor: null, menuCourseAnchor: null, menuCourseItemid: null }) }
    handleMoveToClose() { this.setState({ dialogMoveTo: false, menuUnusedIdx: null, menuCourseIdx: null, menuCourseCatid: null }) }

    handleTemplatePortOpen() { this.setState({ dialogTemplatePort: true, drawerOptions: false }) }
    handleTemplatePortClose() { this.setState({ dialogTemplatePort: false }) }

    handleExportImageOpen() { this.setState({ dialogExportImage: true, drawerOptions: false }) }
    handleExportImageClose() { this.setState({ dialogExportImage: false }) }

    render() {
        return (
            <SnackbarProvider preventDuplicate>
                <DragDropContext onDragStart={this.handleDragStart} onDragEnd={this.handleDragEnd}>
                    <SimulatorPropsContext.Provider value={this.contextProps}>
                        <SimulatorContext.Provider value={this.state.context}>
                            <Base>
                                <DrawerOptions open={this.state.drawerOptions} onClose={this.handleOptionsClose} />

                                <DialogDisclaimer open={this.state.dialogDisclaimer} onClose={this.handleDisclaimerConfirm} />
                                <DialogContextReset open={this.state.dialogContextReset}
                                    onClose={this.handleContextResetClose} updateImport={this.updateImport} />
                                <DialogExportImage open={this.state.dialogExportImage} onClose={this.handleExportImageClose} />

                                <Menu open={Boolean(this.state.menuUnusedAnchor)} anchorEl={this.state.menuUnusedAnchor}
                                    keepMounted onClose={this.handleMenuUnusedClose}>
                                    <MenuItem onClick={this.handleMoveToOpen}><ListItemIcon><Send /></ListItemIcon>移至...</MenuItem>
                                </Menu>

                                <Menu open={Boolean(this.state.menuCourseAnchor) &&
                                    this.state.menuCourseItemid !== null && this.state.menuCourseItemid.indexOf("@") === -1}
                                    anchorEl={this.state.menuCourseAnchor}
                                    keepMounted onClose={this.handleMenuCourseClose}>
                                    <MenuItem onClick={this.handleCopyCourseName}><ListItemIcon><TextFields /></ListItemIcon>複製課名</MenuItem>
                                    <Divider style={{ margin: "4px 0px" }} />
                                    <MenuItem onClick={this.handleMoveToOpen}><ListItemIcon><Send /></ListItemIcon>移至...</MenuItem>
                                    <MenuItem onClick={this.handleCloneCourse}><ListItemIcon><FileCopy /></ListItemIcon>複製一份</MenuItem>
                                </Menu>

                                <Menu open={Boolean(this.state.menuCourseAnchor) &&
                                    this.state.menuCourseItemid !== null && this.state.menuCourseItemid.indexOf("@") !== -1}
                                    anchorEl={this.state.menuCourseAnchor}
                                    keepMounted onClose={this.handleMenuCourseClose}>
                                    <MenuItem onClick={this.handleCopyCourseName}><ListItemIcon><TextFields /></ListItemIcon>複製課名</MenuItem>
                                    <Divider style={{ margin: "4px 0px" }} />
                                    <MenuItem onClick={this.handleMoveToOpen}><ListItemIcon><Send /></ListItemIcon>移至...</MenuItem>
                                    <MenuItem onClick={this.handleCloneCourse}><ListItemIcon><FileCopy /></ListItemIcon>複製一份</MenuItem>
                                    <Divider style={{ margin: "4px 0px" }} />
                                    <MenuItem onClick={this.handleCloneAdjustOpen}><ListItemIcon><BarChart /></ListItemIcon>調整學分</MenuItem>
                                    <MenuItem onClick={this.handleRemoveClone}><ListItemIcon><Delete /></ListItemIcon>移除複製</MenuItem>
                                </Menu>

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

                                            <DialogCloneAdjust open={this.state.dialogCloneAdjust} onClose={this.handleCloneAdjustClose}
                                                catid={this.state.menuCourseCatid} catidx={this.state.menuCourseIdx} itemId={this.state.menuCourseItemid} />
                                            <DialogMoveTo open={this.state.dialogMoveTo} onClose={this.handleMoveToClose}
                                                catid={this.state.menuCourseCatid ?? "unused"} catidx={this.state.menuCourseIdx ?? this.state.menuUnusedIdx} />

                                            <DialogTemplatePort open={this.state.dialogTemplatePort}
                                                onClose={this.handleTemplatePortClose} updateImport={this.updateImport} />

                                            <Hidden smDown>
                                                <SimulatorDesktopView
                                                    dirty={this.state.contextDirty} onDirtyClose={this.handleDirtyClose}
                                                    importSuccess={this.state.importSuccess} onImportSuccessClose={this.handleImportSuccessClose} />
                                                <OptionFab size="small" color="secondary" onClick={this.handleOptionsOpen}>
                                                    <Settings />
                                                </OptionFab>
                                            </Hidden>

                                            <Hidden mdUp>
                                                <SimulatorMobileView
                                                    dirty={this.state.contextDirty} onDirtyClose={this.handleDirtyClose}
                                                    importSuccess={this.state.importSuccess} onImportSuccessClose={this.handleImportSuccessClose}
                                                    handleOptionsOpen={this.handleOptionsOpen} />
                                            </Hidden>
                                        </> :
                                        <LoadingContext><CircularProgress /></LoadingContext>
                                }
                            </Base>
                        </SimulatorContext.Provider>
                    </SimulatorPropsContext.Provider>
                </DragDropContext>
            </SnackbarProvider>
        )
    }
}

export default Simulator
