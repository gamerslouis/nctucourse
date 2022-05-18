import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, ListSubheader, Switch as MuiSwitch } from "@material-ui/core"
import { FiberNew, Input, Subject, Visibility } from "@material-ui/icons"
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

const DrawerOptions = ({ open, onClose }) => {
    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Base>
                <List subheader={<ListSubheader>Settings</ListSubheader>}>
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

                    <Divider />

                    <ListItem button component="a" href="/gpa/import?redir=simulator">
                        <ListItemIcon>
                            <Input />
                        </ListItemIcon>
                        <ListItemText primary="匯入歷史成績" />
                    </ListItem>
                </List>
            </Base>
        </Drawer>
    )
}

export default React.memo(DrawerOptions)