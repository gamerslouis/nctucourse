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
const TRANSPARENT = "#00000000";

const styles = () => ({
    rootOuter: ({ tableOptions }) => ({
        width: tableOptions.tableWidth,
        height: tableOptions.tableHeight,
        margin: "auto",
    }),
    root: ({ tableOptions, exporting, tableTheme }) => ({
        width: tableOptions.tableWidth * SCALE_RATE,
        height: tableOptions.tableHeight * SCALE_RATE,
        transform: exporting ? "" : "scale(0.5) translate(-50%, -50%)",
        backgroundColor: tableTheme.mainBackgroundColor,
        position: "relative",
        padding: 20 * SCALE_RATE,
        paddingTop:
            (20 +
                (tableOptions.enableNotchFix ? tableOptions.notchHeight : 0)) *
            SCALE_RATE,
        backgroundImage: tableOptions.backgroundImage
            ? `url(${tableOptions.backgroundImage})`
            : "none",
        backgroundSize: "cover",
    }),
    tablecontainer: ({ tableOptions, tableTheme }) => ({
        width: (tableOptions.tableWidth - 40) * SCALE_RATE,
        height:
            (tableOptions.tableHeight -
                40 -
                (tableOptions.enableNotchFix ? tableOptions.notchHeight : 0)) *
            SCALE_RATE,
    }),
    table: () => ({
        width: "100%",
        height: "100%",
        borderCollapse: "collapse",
        textAlign: "center",
        tableLayout: "fixed",
    }),
    tr: {
        lineHeight: 0,
    },
    td: () => ({
        borderWidth: TD_BORDER,
        borderStyle: "solid",
    }),
    thd: ({ tableOptions, tableTheme }) => ({
        backgroundColor: tableTheme.headerBackgroundColor,
        color: tableTheme.headerFontColor,
        borderColor: tableOptions.enableGrid
            ? tableTheme.borderColor
            : tableTheme.headerBackgroundColor,
        fontSize: tableOptions.headerFontSize,
    }),
    td1: ({ tableOptions, tableTheme }) => ({
        width: tableOptions.indexColumnWidth * SCALE_RATE,
        whiteSpace: "nowrap",
        borderColor: tableOptions.enableGrid
            ? tableTheme.borderColor
            : tableTheme.indexColumnBackgroundColor,
        backgroundColor: tableTheme.indexColumnBackgroundColor,
        color: tableTheme.indexColumnFontColor,
        fontSize: tableOptions.indexFontSize,
    }),
    tdx: ({ tableOptions, tableTheme }) => ({
        verticalAlign: "top",
        padding: tableOptions.enableFlatStyle ? 0 : 2 * SCALE_RATE,
        color: tableTheme.courseFontColor,
        lineHeight: 1.4,
        borderColor: tableOptions.enableGrid
            ? tableTheme.borderColor
            : TRANSPARENT,
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

        const tableOptions = props.tableOptions;
        const courseOptions = props.courseOptions;
        const tableTheme = props.tableTheme;
        const course = props.course;

        let height = 0;
        if (tableOptions.enableFlatStyle) {
            height = cellHeight * courseLength + (courseLength - 1) * border;
        } else {
            height = cellHeight * courseLength - padding;
        }

        return {
            height: height,
            // padding: 6 * SCALE_RATE,
            borderRadius: tableOptions.enableFlatStyle ? undefined : 10,
            boxShadow: tableOptions.enableFlatStyle
                ? ""
                : "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            display: "inline-table",
            width: "100%",
            backgroundColor:
                tableTheme.courseBackgroundColor[
                    courseOptions.courseTypeConfig[course.cos_id]
                        ? courseOptions.courseTypeConfig[course.cos_id]
                        : ConvertCourseType2StyleType(course.cos_type)
                ],
        };
    },
    textContainer: {
        height: "100%",
        width: "100%",
        display: "inline-block",
        position: "relative",
    },
    textSpan: ({ tableOptions }) => ({
        paddingTop: 5 * SCALE_RATE,
        paddingLeft: tableOptions.coursePaddingX,
        paddingRight: tableOptions.coursePaddingX,
        width: "100%",
        wordBreak: "normal",
        wordWrap: "break-word",
        whiteSpace: "pre-wrap",
        top: tableOptions.alignCourseTextCenter ? "50%" : undefined,
        position: "absolute",
        transform: tableOptions.alignCourseTextCenter
            ? "translate(0, -50%)"
            : undefined,
        fontSize: tableOptions.courseFontSize,
    }),
    teacher: ({ tableOptions }) => ({
        display: tableOptions.showTeacher ? "inline" : "none",
    }),
    room: ({ tableOptions }) => ({
        display: tableOptions.showRoom ? "inline" : "none",
    }),
});

const TimeTableCourse = withStyles(courseStyles)((props) => {
    const { tableOptions, course, roomCode, roomName, classes } = props;

    return (
        <div className={classes.course} style={{}}>
            <div className={classes.textContainer}>
                <div className={classes.textSpan}>
                    {course.cos_cname}
                    {tableOptions.showTeacher && (
                        <Fragment>
                            <br /> {course.teacher}
                        </Fragment>
                    )}
                    {tableOptions.showRoom && (
                        <Fragment>
                            <br />{" "}
                            {tableOptions.showRoomCode ? roomCode : roomName}
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
    courseIds,
    allCourses,
    courseOptions,
    tableOptions,
    tableTheme,
    classes,
}) => {
    const ref = useRef();
    const [cellHeight, setCellHeight] = useState(0);

    let timeC = timeCode
        .slice(0, 5)
        .concat(courseOptions.extendTimetable["六"] ? ["六"] : [])
        .concat(courseOptions.extendTimetable["日"] ? ["日"] : []);
    let secC = difference(
        secs,
        Object.keys(courseOptions.extendTimetable).filter(
            (e) => !courseOptions.extendTimetable[e]
        )
    );
    let courseClasses = makeCourseClasses(courseIds, allCourses, timeC, secC);
    let titles = courseOptions.useNewTimeCode
        ? timeC.map(ConvertToNewCode)
        : timeC;
    let indexColumn = courseOptions.useNewTimeCode
        ? secC.map(ConvertToNewCode)
        : secC;

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
                                                                    courseOptions={
                                                                        courseOptions
                                                                    }
                                                                    tableOptions={
                                                                        tableOptions
                                                                    }
                                                                    tableTheme={
                                                                        tableTheme
                                                                    }
                                                                    key={
                                                                        courseData
                                                                            .course
                                                                            .cos_id
                                                                    }
                                                                    cellHeight={
                                                                        cellHeight
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
                                    courseOptions.extendTimetable ? 0 : 2,
                                    secs.length -
                                        (courseOptions.extendTimetable ? 0 : 7)
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default withStyles(styles)(TimeTable);
