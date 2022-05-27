import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, ListItemIcon, makeStyles, Menu, MenuItem, Typography } from "@material-ui/core"
import { ArrowDownward, ArrowUpward, MoreVert } from "@material-ui/icons"
import React, { useContext, useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { SimulatorContext, SimulatorPropsContext } from "../../Context"

const useStyles = makeStyles({
    item: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderBottom: "1px solid rgba(224, 224, 224, 1)"
    },
    itemName: {
        flexGrow: 1,
        marginRight: -48,
        padding: "12px 0px"
    }
})

const Item = ({ catid, cat_name, index, handleMenuOpen }) => {
    const classes = useStyles()

    const handleClick = evt => {
        handleMenuOpen(index, evt.currentTarget)
        evt.stopPropagation()
    }
    return (
        <Draggable key={`dialog-layout-${catid}`} index={index} draggableId={catid} type="CATEGORY">
            {
                provided =>
                    <div className={classes.item} ref={provided.innerRef}
                        style={provided.draggableProps.style} {...provided.draggableProps} >
                        <Typography variant="body1" align="center"
                            className={classes.itemName} {...provided.dragHandleProps}>
                            {cat_name}
                        </Typography>
                        <IconButton onClick={handleClick}><MoreVert /></IconButton>
                    </div>
            }
        </Draggable>
    )
}

const DialogLayoutArrange = ({ open, onClose }) => {
    const context = useContext(SimulatorContext)
    const { setContext, mobile } = useContext(SimulatorPropsContext)
    const [catidx, setCatidx] = useState(null)
    const [anchor, setAnchor] = useState(null)

    const move = (fromIdx, toIdx) => {
        if (fromIdx !== toIdx)
            setContext(ctx => {
                const layout = ctx.layout.slice()
                const [item] = layout.splice(fromIdx, 1)
                layout.splice(toIdx, 0, item)
                return { ...ctx, layout }
            })
    }
    const handleDragStart = () => {
        if (mobile && context.options.dnd_vibrate && navigator.vibrate)
            navigator.vibrate(25)
    }
    const handleDragEnd = result => {
        if (result.destination)
            move(result.source.index, result.destination.index)
    }
    const handleMenuOpen = (catidx, anchor) => {
        setCatidx(catidx)
        setAnchor(anchor)
    }
    const handleMenuClose = () => {
        setCatidx(null)
        setAnchor(null)
    }
    const handleMoveUp = () => {
        if (catidx > 0)
            move(catidx, catidx - 1)
        handleMenuClose()
    }
    const handleMoveDown = () => {
        if (catidx < context.layout.length - 1)
            move(catidx, catidx + 1)
        handleMenuClose()
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>調整類別顯示順序</DialogTitle>
            <DialogContent style={{ overflowY: "visible" }}>
                <DialogContentText>拖曳或透過選單來調整順序</DialogContentText>
            </DialogContent>
            <DialogContent>
                <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <Droppable droppableId="categories" type="LAYOUT">
                        {
                            provided =>
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {
                                        context.layout.map(
                                            (catid, idx) => <Item key={`dialog-layout-${catid}`} catid={catid} index={idx}
                                                cat_name={context.cat_names[catid]} handleMenuOpen={handleMenuOpen} />
                                        )
                                    }
                                    {provided.placeholder}
                                </div>
                        }
                    </Droppable>
                </DragDropContext>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">關閉</Button>
            </DialogActions>

            <Menu open={Boolean(anchor)} anchorEl={anchor} keepMounted onClose={handleMenuClose}>
                <MenuItem onClick={handleMoveUp}><ListItemIcon><ArrowUpward /></ListItemIcon>上移</MenuItem>
                <MenuItem onClick={handleMoveDown}><ListItemIcon><ArrowDownward /></ListItemIcon>下移</MenuItem>
            </Menu>
        </Dialog>
    )
}

export default React.memo(DialogLayoutArrange)