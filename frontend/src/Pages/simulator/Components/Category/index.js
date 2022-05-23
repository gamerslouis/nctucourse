import { IconButton, Typography } from "@material-ui/core"
import { DragHandle, ExpandMore, Sort } from "@material-ui/icons"
import React, { useContext, useState } from "react"
import { Draggable } from "react-beautiful-dnd"
import { Droppable } from "react-beautiful-dnd"
import { SimulatorContext, SimulatorPropsContext } from "../../Context"
import { getRawCourseId, visibilityFilter } from "../../utilities"
import Course from "../Course"
import { Accordion, AccordionDetails, AccordionSummary, Paper } from "./style"

const Category = ({ catid, index }) => {
    const context = useContext(SimulatorContext)
    const { courses, setContext, mobile } = useContext(SimulatorPropsContext)
    const [expanded, setExpanded] = useState(true)

    const handleToggle = (_, value) => setExpanded(value)
    const handleSort = evt => {
        evt.stopPropagation()
        setContext(ctx => {
            const content = { ...ctx.content }
            content[catid] = ctx.content[catid].slice().sort()
            return { ...ctx, content }
        })
    }
    const stopPropagation = evt => evt.stopPropagation()
    return (
        <Draggable index={index} draggableId={catid} type="CATEGORY">
            {
                provided =>
                    <Accordion expanded={expanded} onChange={handleToggle} ref={provided.innerRef} {...provided.draggableProps}
                        TransitionProps={{ unmountOnExit: true }} style={provided.draggableProps.style}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <div onClick={stopPropagation} {...provided.dragHandleProps}><DragHandle /></div>
                            <Typography>{context.cat_names[catid]}</Typography>
                            <IconButton onClick={handleSort}><Sort /></IconButton>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Paper variant="outlined">
                                <Droppable droppableId={catid} type="COURSE">
                                    {
                                        provided =>
                                            <div {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: 64 }}>
                                                {
                                                    context.content[catid]
                                                        .map((itemId, idx) => [itemId, idx])
                                                        .filter(
                                                            ([itemId]) => visibilityFilter(courses[getRawCourseId(itemId)],
                                                                context.options.show_zero,
                                                                context.options.show_pending)
                                                        ).map(
                                                            ([itemId, idx]) => <Course key={itemId} index={idx} catid={catid} itemId={itemId}
                                                                details={context.options.show_details} dragDisabled={mobile && !context.options.dnd_mobile_enabled} />
                                                        )
                                                }
                                                {provided.placeholder}
                                            </div>
                                    }
                                </Droppable>
                            </Paper>
                        </AccordionDetails>
                    </Accordion>
            }
        </Draggable>
    )
}

export default React.memo(Category)