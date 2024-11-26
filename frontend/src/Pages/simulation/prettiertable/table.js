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
const TD_BORDER = 1 * SCALE_RATE;

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
        backgroundImage: props.backgroundImage
            ? `url(${props.backgroundImage})`
            : "none",
        backgroundSize: "cover",
    }),
    tablecontainer: (props) => ({
        width: (props.tableWidth - 40) * SCALE_RATE,
        height: (props.tableHeight - 40 - props.notchHeight) * SCALE_RATE,
        border: `1.5px solid ${
            props.enableGrid
                ? props.tableTheme.borderColor
                : props.tableTheme.mainBackgroundColor
        }`,
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
        color: props.tableTheme.headerFontColor,
        borderColor: props.enableGrid
            ? props.tableTheme.borderColor
            : props.tableTheme.headerBackgroundColor,
    }),
    td: (props) => ({
        borderWidth: TD_BORDER,
        borderStyle: "solid",
    }),
    td1: (props) => ({
        width: 35 * SCALE_RATE,
        whiteSpace: "nowrap",
        borderColor: props.enableGrid
            ? props.tableTheme.borderColor
            : props.tableTheme.indexColumnBackgroundColor,
        backgroundColor: props.tableTheme.indexColumnBackgroundColor,
        color: props.tableTheme.indexColumnFontColor,
    }),
    tdx: (props) => ({
        verticalAlign: "top",
        padding: props.enableFlatStyle ? 0 : 2 * SCALE_RATE,
        color: props.tableTheme.courseFontColor,
        lineHeight: 1.4,
        borderColor: props.enableGrid
            ? props.tableTheme.borderColor
            : props.tableTheme.mainBackgroundColor,
    }),
    courseContainer: {
        height: 0,
        width: "100%",
    },
});

const courseStyles = (theme) => ({
    course: (props) => {
        const cellHeight = props.cellHeight;
        const courseLength = props.length;
        const border = TD_BORDER;
        const padding = 2 * (SCALE_RATE + 1);

        let height = 0;
        if (props.enableFlatStyle) {
            height = cellHeight * courseLength + (courseLength - 1) * border;
        } else {
            height = cellHeight * courseLength - padding;
        }

        return {
            height: height,
            padding: 6 * SCALE_RATE,
            borderRadius: props.enableFlatStyle ? undefined : 10,
            boxShadow: props.enableFlatStyle
                ? ""
                : "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            display: "inline-table",
            width: "100%",
        };
    },
    textContainer: {
        height: "100%",
        width: "100%",
        display: "inline-block",
        position: "relative",
    },
    textSpan: (props) => ({
        paddingTop: 5 * SCALE_RATE,
        width: "100%",
        wordBreak: "normal",
        wordWrap: "break-word",
        whiteSpace: "pre-wrap",
        top: props.alignCourseTextCenter ? "50%" : undefined,
        position: "absolute",
        transform: props.alignCourseTextCenter
            ? "translate(0, -50%)"
            : undefined,
    }),
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
        courseTypeConfig,
    } = props;
    return (
        <div
            className={classes.course}
            style={{
                backgroundColor:
                    tableTheme.courseBackgroundColor[
                        courseTypeConfig[course.cos_id]
                            ? courseTypeConfig[course.cos_id]
                            : ConvertCourseType2StyleType(course.cos_type)
                    ],
            }}
        >
            <div className={classes.textContainer}>
                <div
                    className={classes.textSpan}
                    style={{ fontSize: fontSize }}
                >
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
    courseTypeConfig,
    enableFlatStyle,
    alignCourseTextCenter,
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
                                                classes.td1
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
                                                                    courseTypeConfig={
                                                                        courseTypeConfig
                                                                    }
                                                                    enableFlatStyle={
                                                                        enableFlatStyle
                                                                    }
                                                                    alignCourseTextCenter={
                                                                        alignCourseTextCenter
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
