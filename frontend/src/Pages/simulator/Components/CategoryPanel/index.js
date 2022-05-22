import { Button, Divider, IconButton, ListItemIcon, makeStyles, Menu, MenuItem, Typography } from "@material-ui/core"
import { Add, DeleteForever, Edit, ExpandMore, List, MoreHoriz } from "@material-ui/icons"
import React, { useContext, useState } from "react"
import { SimulatorContext, SimulatorPropsContext } from "../../Context"
import { Accordion, AccordionDetails, AccordionSummary, Base, ButtonGroup } from "./style"

const useStyles = makeStyles(theme => ({
    category: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "0px 4px",
        borderBottom: "1px solid rgba(224, 224, 224, 1)",
        [theme.breakpoints.down("sm")]: { padding: "0px 6px" }
    },
    name: { flexGrow: 1 },
    iconButton: {
        padding: 6,
        [theme.breakpoints.down("sm")]: { padding: 10 }
    },
    button: {
        flexGrow: 1,
        [theme.breakpoints.down("sm")]: {
            paddingTop: 12,
            paddingBottom: 12
        }
    }
}))

const Category = ({ catid, cat_name, onMenuOpen }) => {
    const classes = useStyles()

    const handleClick = evt => onMenuOpen(catid, evt.currentTarget)

    return (
        <div className={classes.category}>
            <Typography className={classes.name} variant="body2">{cat_name}</Typography>
            <IconButton className={classes.iconButton} onClick={handleClick}><MoreHoriz /></IconButton>
        </div>
    )
}

const CategoryPanel = () => {
    const classes = useStyles()

    const {
        handleCategoryAddOpen,
        handleCategoryRenameOpen,
        handleCategoryDeleteOpen,
        handleGroupAddOpen,
        handleGroupEditOpen
    } = useContext(SimulatorPropsContext)
    const [menuAnchorId, setMenuAnchorId] = useState(null)
    const [menuAnchor, setMenuAnchor] = useState(null)

    const handleMenuOpen = (catid, anchor) => {
        setMenuAnchorId(catid)
        setMenuAnchor(anchor)
    }
    const handleMenuClose = () => {
        setMenuAnchorId(null)
        setMenuAnchor(null)
    }
    const handleRename = () => {
        handleCategoryRenameOpen(menuAnchorId)
        handleMenuClose()
    }
    const handleDelete = () => {
        handleCategoryDeleteOpen(menuAnchorId)
        handleMenuClose()
    }
    const handleGroupEdit = () => {
        handleGroupEditOpen(menuAnchorId)
        handleMenuClose()
    }

    return (
        <Base>
            <ButtonGroup>
                <Button className={classes.button} startIcon={<Add />} onClick={handleCategoryAddOpen}>新增類別</Button>
                <Divider flexItem orientation="vertical" />
                <Button className={classes.button} startIcon={<List />} onClick={handleGroupAddOpen}>新增群組</Button>
            </ButtonGroup>

            <Accordion defaultExpanded={true}>
                <AccordionSummary expandIcon={<ExpandMore />}>群組</AccordionSummary>
                <AccordionDetails>
                    <div style={{ width: "100%" }}>
                        <SimulatorContext.Consumer>
                            {
                                context => context.layout.filter(catid => catid.startsWith("g")).map(
                                    catid => <Category key={`category-panel-${catid}`} catid={catid}
                                        cat_name={context.cat_names[catid]} onMenuOpen={handleMenuOpen} />
                                )
                            }
                        </SimulatorContext.Consumer>
                    </div>
                </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded={true}>
                <AccordionSummary expandIcon={<ExpandMore />}>類別</AccordionSummary>
                <AccordionDetails>
                    <div style={{ width: "100%" }}>
                        <SimulatorContext.Consumer>
                            {
                                context => context.layout.filter(catid => !catid.startsWith("g")).map(
                                    catid => <Category key={`category-panel-${catid}`} catid={catid}
                                        cat_name={context.cat_names[catid]} onMenuOpen={handleMenuOpen} />
                                )
                            }
                        </SimulatorContext.Consumer>
                    </div>
                </AccordionDetails>
            </Accordion>

            <Menu open={menuAnchorId === null ? false : !menuAnchorId.startsWith("g")} anchorEl={menuAnchor}
                keepMounted onClose={handleMenuClose}>
                <MenuItem onClick={handleRename}><ListItemIcon><Edit /></ListItemIcon>重新命名</MenuItem>
                <Divider style={{ margin: "4px 0px" }} />
                <MenuItem onClick={handleDelete}><ListItemIcon><DeleteForever /></ListItemIcon>刪除類別</MenuItem>
            </Menu>

            <Menu open={menuAnchorId === null ? false : menuAnchorId.startsWith("g")} anchorEl={menuAnchor}
                keepMounted onClose={handleMenuClose}>
                <MenuItem onClick={handleRename}><ListItemIcon><Edit /></ListItemIcon>重新命名</MenuItem>
                <MenuItem onClick={handleGroupEdit}><ListItemIcon><List /></ListItemIcon>編輯群組</MenuItem>
                <Divider style={{ margin: "4px 0px" }} />
                <MenuItem onClick={handleDelete}><ListItemIcon><DeleteForever /></ListItemIcon>刪除群組</MenuItem>
            </Menu>
        </Base>
    )
}

export default React.memo(CategoryPanel)