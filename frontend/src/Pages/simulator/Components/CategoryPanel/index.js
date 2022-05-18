import { Divider, ListItemIcon, makeStyles, Menu, MenuItem, Table, TableBody, TableRow } from "@material-ui/core"
import { Add, DeleteForever, Edit, ExpandMore, List, MoreHoriz, Visibility } from "@material-ui/icons"
import React, { useContext, useState } from "react"
import { SimulatorContext, SimulatorPropsContext } from "../../Context"
import { Accordion, AccordionDetails, AccordionSummary, Base, Button, ButtonGroup, IconButton, TableCell } from "./style"
const useStyles = makeStyles(() => ({
    category: {
        "&:hover svg": {
            visibility: "visible"
        }
    },
    tdTight: {
        "&:first-child": { paddingLeft: 12 }
    }
}))

const Category = ({ catid, cat_name, visible, onMenuOpen }) => {
    const classes = useStyles()
    const hiddenStyle = {
        color: "rgba(0, 0, 0, .6)",
        textDecoration: "line-through"
    }

    const handleClick = evt => onMenuOpen(catid, evt.currentTarget)

    return (
        <TableRow className={classes.category}>
            <TableCell style={visible ? null : hiddenStyle}>{cat_name}</TableCell>
            <TableCell className={classes.tdTight} onClick={handleClick}>
                <IconButton><MoreHoriz /></IconButton>
            </TableCell>
        </TableRow>
    )
}

const CategoryPanel = () => {
    const {
        handleCategoryAddOpen,
        handleCategoryRenameOpen,
        handleCategoryDeleteOpen,
        handleGroupAddOpen,
        handleGroupEditOpen,
        setContext
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
    const handleToggle = () => {
        setContext(ctx => {
            const categories = { ...ctx.categories }
            categories[menuAnchorId] = !categories[menuAnchorId]
            return { ...ctx, categories }
        })
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
                <Button startIcon={<Add />} onClick={handleCategoryAddOpen}>新增類別</Button>
                <Divider flexItem orientation="vertical" />
                <Button startIcon={<List />} onClick={handleGroupAddOpen}>新增群組</Button>
            </ButtonGroup>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>群組</AccordionSummary>
                <AccordionDetails>
                    <Table size="small">
                        <TableBody>
                            <SimulatorContext.Consumer>
                                {
                                    context => context.layout.filter(catid => catid.startsWith("g")).map(
                                        catid => <Category key={`category-panel-${catid}`} catid={catid}
                                            cat_name={context.cat_names[catid]} visible={true}
                                            onMenuOpen={handleMenuOpen} />
                                    )
                                }
                            </SimulatorContext.Consumer>
                        </TableBody>
                    </Table>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>類別</AccordionSummary>
                <AccordionDetails>
                    <Table size="small">
                        <TableBody>
                            <SimulatorContext.Consumer>
                                {
                                    context => context.layout.filter(catid => !catid.startsWith("g")).map(
                                        catid => <Category key={`category-panel-${catid}`} catid={catid}
                                            cat_name={context.cat_names[catid]} visible={context.categories[catid]}
                                            onMenuOpen={handleMenuOpen} />
                                    )
                                }
                            </SimulatorContext.Consumer>
                        </TableBody>
                    </Table>
                </AccordionDetails>
            </Accordion>

            <Menu open={menuAnchorId === null ? false : !menuAnchorId.startsWith("g")} anchorEl={menuAnchor}
                keepMounted onClose={handleMenuClose}>
                <MenuItem onClick={handleRename}><ListItemIcon><Edit /></ListItemIcon>重新命名</MenuItem>
                <MenuItem onClick={handleToggle}><ListItemIcon><Visibility /></ListItemIcon>切換可視</MenuItem>
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