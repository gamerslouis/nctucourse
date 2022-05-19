import { Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, Typography } from "@material-ui/core"
import React, { useContext } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { SimulatorContext, SimulatorPropsContext } from "../../Context"

const useStyles = makeStyles(theme => ({
    item: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: theme.spacing(2),
        borderBottom: "1px solid rgba(224, 224, 224, 1)"
    }
}))

const Item = ({ catid, cat_name, index }) => {
    const classes = useStyles()

    return (
        <Draggable key={`dialog-layout-${catid}`} index={index} draggableId={catid} type='CATEGORY'>
            {
                provided =>
                    <div className={classes.item}
                        ref={provided.innerRef} style={provided.draggableProps.style}
                        {...provided.draggableProps} {...provided.dragHandleProps}>
                        <Typography variant="body1">{cat_name}</Typography>
                    </div>
            }
        </Draggable>
    )
}

const DialogLayoutArrange = ({ open, onClose }) => {
    const { setContext } = useContext(SimulatorPropsContext)

    const handleSubmit = () => {
        onClose()
    }
    const handleDragEnd = result => {
        if (!result.destination)
            return
        const fromIdx = result.source.index
        const toIdx = result.destination.index
        setContext(ctx => {
            const layout = ctx.layout.slice()
            const [item] = layout.splice(fromIdx, 1)
            layout.splice(toIdx, 0, item)
            return { ...ctx, layout }
        })
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>調整類別顯示順序</DialogTitle>
            <DialogContent>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId='categories' type='CATEGORY'>
                        {
                            provided =>
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    <SimulatorContext.Consumer>
                                        {
                                            context => context.layout.map(
                                                (catid, idx) => <Item key={`dialog-layout-${catid}`} catid={catid} index={idx}
                                                    cat_name={context.cat_names[catid]} />
                                            )
                                        }
                                    </SimulatorContext.Consumer>
                                    {provided.placeholder}
                                </div>
                        }
                    </Droppable>
                </DragDropContext>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
                <Button onClick={handleSubmit} color="primary">確認</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(DialogLayoutArrange)