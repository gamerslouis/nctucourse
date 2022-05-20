import { IconButton } from "@material-ui/core"
import { ExpandMore, Sort } from "@material-ui/icons"
import React, { useContext } from "react"
import { Droppable } from "react-beautiful-dnd"
import { SimulatorContext, SimulatorPropsContext } from "../../Context"
import { getRawCourseId, visibilityFilter } from "../../utilities"
import Course from "../Course"
import { Accordion, AccordionDetails, AccordionSummary, Paper } from "./style"

const Category = ({ catid }) => {
    const context = useContext(SimulatorContext)
    const { courses, setContext } = useContext(SimulatorPropsContext)

    const handleSort = evt => {
        evt.stopPropagation()
        setContext(ctx => {
            const content = { ...ctx.content }
            content[catid] = ctx.content[catid].slice().sort()
            return { ...ctx, content }
        })
    }
    return (
        <Accordion defaultExpanded={true} TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
                {context.cat_names[catid]}
                <IconButton onClick={handleSort}><Sort /></IconButton>
            </AccordionSummary>
            <AccordionDetails>
                <Paper variant="outlined">
                    <Droppable droppableId={catid}>
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
                                                    details={context.options.show_details} />
                                            )
                                    }
                                    {provided.placeholder}
                                </div>
                        }
                    </Droppable>
                </Paper>
            </AccordionDetails>
        </Accordion>
    )
}

export default React.memo(Category)