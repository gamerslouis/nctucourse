import React, { Fragment, useRef, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { getCourseTimesAndRooms } from "../../../Util/dataUtil/course";
import {
    ConvertCourseType2StyleType,
    ConvertToNewCode,
    secs,
    timeCode,
} from "../../../Util/style";
import { difference } from "lodash";

const SCALE_RATE = 2;

const styles = (theme) => ({
    rootOuter: (props) => ({
        width: props.tableWidth,
        height: props.tableHeight,
        margin: "auto",
    }),
    root: (props) => ({
        width: props.tableWidth * SCALE_RATE,
        height: props.tableHeight * SCALE_RATE,
        transform: props.exporting ? "" : "scale(0.5) translate(-50%, -50%)",
        backgroundColor: props.tableTheme.mainBackgroundColor,
        position: "relative",
        fontSize: 12 * SCALE_RATE,
        padding: 20 * SCALE_RATE,
        paddingTop: (20 + props.notchHeight) * SCALE_RATE,
    }),
    tablecontainer: (props) => ({
        width: (props.tableWidth - 40) * SCALE_RATE,
        height: (props.tableHeight - 40 - props.notchHeight) * SCALE_RATE,
        border: `1.5px solid ${props.tableTheme.borderColor}`,
    }),
    table: (props) => ({
        width: "100%",
        height: "100%",
        borderCollapse: "collapse",
        textAlign: "center",
        tableLayout: "fixed",
    }),
    tr: {
        lineHeight: 0,
    },
    thd: (props) => ({
        backgroundColor: props.tableTheme.headerBackgroundColor,
    }),
    td: (props) => ({
        borderWidth: 1 * SCALE_RATE,
        borderColor: props.tableTheme.borderColor,
        borderStyle: "solid",
    }),
    td1: (props) => ({
        width: 35 * SCALE_RATE,
        whiteSpace: "nowrap",
    }),
    td1Color: (props) => ({
        backgroundColor: props.tableTheme.indexColumnBackgroundColor,
    }),
    tdx: (props) => ({
        verticalAlign: "top",
        padding: 2 * SCALE_RATE,
        color: props.tableTheme.courseFontColor,
        lineHeight: 1.4,
    }),
    courseContainer: {
        height: 0,
        width: "100%",
    },
});

const courseStyles = (theme) => ({
    course: (props) => ({
        height: props.cellHeight * props.length - 2 * (SCALE_RATE + 1),
        padding: 6 * SCALE_RATE,
        borderRadius: 10,
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        display: "inline-table",
        width: "100%",
    }),
    textSpan: {
        paddingTop: 5 * SCALE_RATE,
        display: "inline-block",
        width: "100%",
        wordBreak: "normal",
        wordWrap: "break-word",
    },
    teacher: (props) => ({
        display: props.showTeacher ? "inline" : "none",
    }),
    room: (props) => ({
        display: props.showRoom ? "inline" : "none",
    }),
});

const TimeTableCourse = withStyles(courseStyles)((props) => {
    const {
        course,
        roomCode,
        roomName,
        showRoomCode,
        classes,
        tableTheme,
        fontSize,
        showTeacher,
        showRoom,
    } = props;
    return (
        <div
            className={classes.course}
            style={{
                backgroundColor:
                    tableTheme.courseBackgroundColor[
                        ConvertCourseType2StyleType(course.cos_type)
                    ],
            }}
        >
            <div className={classes.textSpan} style={{ fontSize: fontSize }}>
                {course.cos_cname}
                {showTeacher && (
                    <Fragment>
                        <br /> {course.teacher}
                    </Fragment>
                )}
                {showRoom && (
                    <Fragment>
                        <br /> {showRoomCode ? roomCode : roomName}
                    </Fragment>
                )}
            </div>
        </div>
    );
});

const makeCourseClasses = (
    courseIds,
    allCourses,
    localTimeCode,
    localSecCode
) => {
    let classes = [...Array(localSecCode.length)].map((e) =>
        [...Array(localTimeCode.length)].map((e2) => Array(0))
    );

    for (let course of Array.from(courseIds).map((id) => allCourses[id])) {
        let times = getCourseTimesAndRooms(course);
        let lastSec = "";
        let lastTime = "";
        let lastObj = null;
        for (let time of times) {
            if (localTimeCode.indexOf(timeCode[time[0] - 1]) === -1) continue;
            if (localSecCode.indexOf(time[1]) === -1) continue;
            if (
                localSecCode.indexOf(time[1]) - 1 === lastSec &&
                time[0] - 1 === lastTime
            ) {
                lastObj.length += 1;
            } else {
                const secIdx = localSecCode.indexOf(time[1]);
                const timeIdx = localTimeCode.indexOf(timeCode[time[0] - 1]);
                lastObj = {
                    course: course,
                    roomCode: time[2],
                    roomName: time[3],
                    time: time.slice(0, 2),
                    length: 1,
                };
                classes[secIdx][timeIdx].push(lastObj);
            }
            lastSec = localSecCode.indexOf(time[1]);
            lastTime = time[0] - 1;
        }
    }
    return classes;
};

const TimeTable = ({
    extendTimetable,
    classes,
    hideOverflowText,
    showRoom,
    showRoomCode,
    newTimeCode,
    tableTheme,
    showTeacher,
    courseIds,
    allCourses,
    fontSize,
}) => {
    const ref = useRef();
    const [cellHeight, setCellHeight] = useState(0);

    let timeC = timeCode
        .slice(0, 5)
        .concat(extendTimetable["六"] ? ["六"] : [])
        .concat(extendTimetable["日"] ? ["日"] : []);
    let secC = difference(
        secs,
        Object.keys(extendTimetable).filter((e) => !extendTimetable[e])
    );
    let courseClasses = makeCourseClasses(courseIds, allCourses, timeC, secC);
    let titles = newTimeCode ? timeC.map(ConvertToNewCode) : timeC;
    let indexColumn = newTimeCode ? secC.map(ConvertToNewCode) : secC;

    if (ref.current) {
        setTimeout(() => {
            if (ref.current.clientHeight !== cellHeight) {
                setCellHeight(ref.current.clientHeight);
            }
        });
    }

    return (
        <div className={classes.rootOuter}>
            <div className={classes.root} id="table">
                <div className={classes.tablecontainer}>
                    <table className={classes.table} id="prettiertable">
                        <thead>
                            <tr>
                                <td
                                    className={clsx(
                                        classes.td,
                                        classes.td1,
                                        classes.thd
                                    )}
                                >
                                    節數
                                </td>
                                {titles.map((text) => (
                                    <td
                                        className={clsx(
                                            classes.td,
                                            classes.thd
                                        )}
                                        key={text}
                                    >
                                        {text}
                                    </td>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {courseClasses
                                .map((rowClasses, index) => (
                                    <tr className={classes.tr} key={index}>
                                        <td
                                            className={clsx(
                                                classes.td,
                                                classes.td1,
                                                classes.td1Color
                                            )}
                                        >
                                            {indexColumn[index]}
                                        </td>
                                        {rowClasses.map(
                                            (cellClasses, index2) => (
                                                <td
                                                    className={clsx(
                                                        classes.td,
                                                        classes.tdx
                                                    )}
                                                    key={index2}
                                                    ref={
                                                        index === 0 &&
                                                        index2 === 0
                                                            ? ref
                                                            : undefined
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            classes.courseContainer
                                                        }
                                                    >
                                                        {cellClasses.map(
                                                            (courseData) => (
                                                                <TimeTableCourse
                                                                    {...courseData}
                                                                    tableTheme={
                                                                        tableTheme
                                                                    }
                                                                    hideOverflowText={
                                                                        hideOverflowText
                                                                    }
                                                                    showRoom={
                                                                        showRoom
                                                                    }
                                                                    showRoomCode={
                                                                        showRoomCode
                                                                    }
                                                                    key={
                                                                        courseData
                                                                            .course
                                                                            .cos_id
                                                                    }
                                                                    cellHeight={
                                                                        cellHeight
                                                                    }
                                                                    showTeacher={
                                                                        showTeacher
                                                                    }
                                                                    fontSize={
                                                                        fontSize
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                </td>
                                            )
                                        )}
                                    </tr>
                                ))
                                .splice(
                                    extendTimetable ? 0 : 2,
                                    secs.length - (extendTimetable ? 0 : 7)
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default withStyles(styles)(TimeTable);
