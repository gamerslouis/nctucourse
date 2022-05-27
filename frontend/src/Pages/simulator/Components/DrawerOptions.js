import { Divider, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, ListSubheader, SwipeableDrawer, Switch as MuiSwitch } from "@material-ui/core"
import { DeleteForever, FiberNew, GetApp, ImportExport, Input, PanTool, Sort, Subject, Vibration, Visibility } from "@material-ui/icons"
import React, { useContext } from "react"
import styled from "styled-components"
import { SimulatorContext, SimulatorPropsContext } from "../Context"

const Base = styled.div`
    width: 285px;
`

const Switch = React.memo(props => <MuiSwitch edge="end" {...props} />)
const ContextSwitch = ({ optId }) => {
    const { setContext } = useContext(SimulatorPropsContext)
    const handleChange = (_, checked) => {
        setContext(prevCtx => {
            const newOptions = { ...prevCtx.options }
            newOptions[optId] = checked
            return { ...prevCtx, options: newOptions }
        })
    }
    return (
        <SimulatorContext.Consumer>
            {context => <Switch checked={context.options[optId]} onChange={handleChange} />}
        </SimulatorContext.Consumer>
    )
}

const DrawerOptions = ({ open, onOpen, onClose }) => {
    const { setContext, mobile, handleContextResetOpen, handleTemplatePortOpen, handleExportImageOpen } = useContext(SimulatorPropsContext)

    const handleSort = evt => {
        evt.stopPropagation()
        setContext(ctx => {
            const content = { ...ctx.content }
            for (const catid in content)
                content[catid] = ctx.content[catid].slice().sort()
            return { ...ctx, content }
        })
    }
    return (
        <SwipeableDrawer anchor="right" open={open} onOpen={onOpen} onClose={onClose}>
            <Base>
                <List subheader={<ListSubheader>Settings</ListSubheader>}>
                    <ListItem button onClick={handleSort}>
                        <ListItemIcon>
                            <Sort />
                        </ListItemIcon>
                        <ListItemText primary="排序所有類別課程" />
                    </ListItem>

                    <Divider />

                    <ListItem>
                        <ListItemIcon>
                            <Visibility />
                        </ListItemIcon>
                        <ListItemText primary="顯示零學分課程" />
                        <ListItemSecondaryAction>
                            <ContextSwitch optId="show_zero" />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Subject />
                        </ListItemIcon>
                        <ListItemText primary="顯示詳細資訊" />
                        <ListItemSecondaryAction>
                            <ContextSwitch optId="show_details" />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <FiberNew />
                        </ListItemIcon>
                        <ListItemText primary="顯示未送註冊組課程" />
                        <ListItemSecondaryAction>
                            <ContextSwitch optId="show_pending" />
                        </ListItemSecondaryAction>
                    </ListItem>
                    
                    {
                        mobile &&
                        <>
                            <Divider />
                            <ListItem>
                                <ListItemIcon>
                                    <PanTool />
                                </ListItemIcon>
                                <ListItemText primary="行動裝置啟用拖曳" />
                                <ListItemSecondaryAction>
                                    <ContextSwitch optId="dnd_mobile_enabled" />
                                </ListItemSecondaryAction>
                            </ListItem>
                            {
                                navigator.vibrate &&
                                <ListItem>
                                    <ListItemIcon>
                                        <Vibration />
                                    </ListItemIcon>
                                    <ListItemText primary="拖曳時震動" />
                                    <ListItemSecondaryAction>
                                        <ContextSwitch optId="dnd_vibrate" />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            }
                        </>
                    }

                    <Divider />

                    <ListItem button component="a" href="/gpa/import?redir=simulator">
                        <ListItemIcon>
                            <Input />
                        </ListItemIcon>
                        <ListItemText primary="匯入歷史成績" />
                    </ListItem>
                    <ListItem button onClick={handleTemplatePortOpen}>
                        <ListItemIcon>
                            <ImportExport />
                        </ListItemIcon>
                        <ListItemText primary="匯入/匯出模板" />
                    </ListItem>
                    {
                        !mobile &&
                        <ListItem button onClick={handleExportImageOpen}>
                            <ListItemIcon>
                                <GetApp />
                            </ListItemIcon>
                            <ListItemText primary="另存為圖片" />
                        </ListItem>
                    }
                    <ListItem button onClick={handleContextResetOpen}>
                        <ListItemIcon>
                            <DeleteForever />
                        </ListItemIcon>
                        <ListItemText primary="初始化資料" />
                    </ListItem>
                </List>
            </Base>
        </SwipeableDrawer>
    )
}

export default React.memo(DrawerOptions)