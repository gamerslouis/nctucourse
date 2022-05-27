import { Divider, Typography } from "@material-ui/core"
import { Link } from "@material-ui/icons"
import React, { useContext } from "react"
import { Draggable } from "react-beautiful-dnd"
import { SimulatorPropsContext } from "../../Context"
import { getRawCourseId } from "../../utilities"
import { Base, Content, Credit, DepTeacher, Details, MoreButton, SemId, Title } from "./style"

const getSemester = (sem) => {
    switch (sem) {
        case "1":
            return "上"
        case "2":
            return "下"
        default:
            return "暑"
    }
}

const Course = ({ catid, details, dragDisabled, itemId, index, ...otherProps }) => {
    const { courses, handleMenuUnusedOpen, handleMenuCourseOpen } = useContext(SimulatorPropsContext)
    const course = courses[getRawCourseId(itemId)]
    const colors = ["#ef9a9a", "#a5d6a7", "#b39ddb", "#fff59d", "#ffab91", "#9fa8da"]

    const isClone = itemId.indexOf("@") !== -1
    const altCredit = itemId.match(/\$(\d+)/)?.[1]
    const transfer = course.sem[0] === "C"
    const unused = otherProps.hasOwnProperty("unused")

    const handleClick = evt => {
        if (unused)
            handleMenuUnusedOpen(index, evt.currentTarget)
        else
            handleMenuCourseOpen(index, catid, itemId, evt.currentTarget)
    }
    return (
        <Draggable index={index} draggableId={itemId} type="COURSE" isDragDisabled={dragDisabled}>
            {
                provided =>
                    <Base ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                        style={{ background: transfer ? "#fab9f8" : colors[parseInt(course.sem.substr(0, 3)) % 6], ...provided.draggableProps.style }} >
                        <Content>
                            <Title variant="subtitle2">{course.cos_cname}</Title>
                            <Credit>
                                {isClone && <Link />}
                                <Typography variant="subtitle2">{altCredit ?? course.cos_credit}學分</Typography>
                            </Credit>
                            <Divider flexItem orientation="vertical" style={{ margin: "0px 4px" }} />
                            <MoreButton onClick={handleClick} />
                        </Content>
                        {
                            details &&
                            <Details>
                                {
                                    !transfer &&
                                    <SemId>{course.sem.substr(0, 3) + getSemester(course.sem.slice(3))} {course.id}</SemId>
                                }
                                {
                                    transfer ? '學分抵免' :
                                        <DepTeacher>
                                            <span>{course.teacher.replaceAll(';', '、')}</span>
                                            <span>&nbsp;- {course.dep}</span>
                                        </DepTeacher>
                                }
                            </Details>
                        }
                    </Base>
            }
        </Draggable>
    )
}

export default React.memo(Course)