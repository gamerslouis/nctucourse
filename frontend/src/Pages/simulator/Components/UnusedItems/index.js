import { Collapse, Typography } from "@material-ui/core"
import { KeyboardArrowDown } from "@material-ui/icons"
import React, { useContext, useState } from "react"
import { Droppable } from "react-beautiful-dnd"
import { SimulatorContext, SimulatorPropsContext } from "../../Context"
import { getRawCourseId, visibilityFilter } from "../../utilities"
import Course from "../Course"
import { Background, Base, CollapseBase, ContainerPaper, Title } from "./style"

const UnusedItems = () => {
    const { courses } = useContext(SimulatorPropsContext)
    const [open, setOpen] = useState(false)
    const toggleOpen = () => setOpen(p => !p)
    const handleClose = () => setOpen(false)

    return (
        <Base>
            <Background open={open} onClick={handleClose} />
            <Title open={open} onClick={toggleOpen}>
                <Typography variant="h6">未分類課程</Typography>
                <KeyboardArrowDown style={{ transform: `scaleY(${open ? 1 : -1})`, transition: "transform .3s" }} />
            </Title>
            <Collapse in={open}>
                <CollapseBase>
                    <ContainerPaper variant="outlined">
                        <Droppable droppableId="unused">
                            {
                                provided =>
                                    <div {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: 80 }}>
                                        <SimulatorContext.Consumer>
                                            {
                                                context => context.content.unused.filter(
                                                    itemId => visibilityFilter(courses[getRawCourseId(itemId)],
                                                        context.options.show_zero,
                                                        context.options.show_pending)
                                                ).map(
                                                    (itemId, idx) => <Course key={itemId} itemId={itemId} index={idx} details={context.options.show_details} />
                                                )
                                            }
                                        </SimulatorContext.Consumer>
                                        {provided.placeholder}
                                    </div>
                            }
                        </Droppable>
                    </ContainerPaper>
                </CollapseBase>
            </Collapse>
        </Base>
    )
}

export default React.memo(UnusedItems)