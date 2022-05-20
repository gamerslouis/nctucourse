import { Collapse } from "@material-ui/core"
import { KeyboardArrowDown, Sort } from "@material-ui/icons"
import React, { useContext, useState } from "react"
import { Droppable } from "react-beautiful-dnd"
import { SimulatorContext, SimulatorPropsContext } from "../../Context"
import { getRawCourseId, visibilityFilter } from "../../utilities"
import Course from "../Course"
import { Background, Base, CollapseBase, ContainerPaper, IconButton, Title, Typography } from "./style"

const UnusedItems = props => {
    const { courses, setContext } = useContext(SimulatorPropsContext)
    const [open, setOpen] = useState(false)
    const mobile = props.hasOwnProperty("mobile")

    const toggleOpen = () => setOpen(p => !p)
    const handleClose = () => setOpen(false)

    const handleSort = evt => {
        evt.stopPropagation()
        setContext(ctx => {
            const content = { ...ctx.content }
            content.unused = ctx.content.unused.slice().sort()
            return { ...ctx, content }
        })
    }
    return (
        <Base mobile={mobile}>
            <Background open={open} onClick={handleClose} />
            <Title open={open} onClick={toggleOpen}>
                <Typography variant="h6">未分類課程</Typography>
                <IconButton onClick={handleSort} style={{
                    opacity: open ? 1 : 0,
                    visibility: open ? "visible" : "hidden",
                    transition: "visibility 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
                }}><Sort /></IconButton>
                <KeyboardArrowDown style={{ marginLeft: 6, transform: `scaleY(${open ? 1 : -1})`, transition: "transform .3s" }} />
            </Title>
            <Collapse in={open} unmountOnExit={true}>
                <CollapseBase>
                    <ContainerPaper variant="outlined">
                        <Droppable droppableId="unused" type="COURSE">
                            {
                                provided =>
                                    <div {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: "100%" }}>
                                        <SimulatorContext.Consumer>
                                            {
                                                context => context.content.unused.filter(
                                                    itemId => visibilityFilter(courses[getRawCourseId(itemId)],
                                                        context.options.show_zero,
                                                        context.options.show_pending)
                                                ).map(
                                                    (itemId, idx) => <Course key={itemId} itemId={itemId} index={idx}
                                                        details={context.options.show_details} unused mobile={mobile} />
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