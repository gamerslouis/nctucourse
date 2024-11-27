import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Container, Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { fetchDatabase } from "../../../Redux/Actions";
import Setting from "./setting";
import Table from "./table";
import { withSnackbar } from "notistack";
import useAxios from "axios-hooks";
import FullLoading from "../../../Components/FullLoading";
import axios from "axios";
import { DownloadAsImage } from "../../../Util/dataUtil/imageExport";
import { themes } from "./theme";
import { getCourseTimesAndRooms } from "../../../Util/dataUtil/course";
import { secs, timeCode } from "../../../Util/style";

const PrettierTable = ({
    courseIds,
    allCourses,
    fetchDatabase,
    enqueueSnackbar,
    defaultSemester,
}) => {
    const [semester, setSemester] = useState(null);
    const [mergedAllCourses, setMergedAllCourses] = useState({});
    const [mergedCourseIds, setMergedCourseIds] = useState(new Set());
    const [exporting, setExporting] = useState(false);
    const [theme, setTheme] = useState(themes[0]);

    const [courseOptions, setCourseOptions] = useState({
        userAddCourseConfig: [],
        courseTypeConfig: {},
        useNewTimeCode: true,
        extendTimetable: {
            M: false,
            N: false,
            X: false,
            Y: false,
            I: false,
            J: false,
            K: false,
            L: false,
            六: false,
            日: false,
        },
    });

    const [tableOptions, setTableOptions] = useState({
        tableWidth: 414,
        tableHeight: 818,
        notchHeight: 44,
        enableNotchFix: false,
        headerFontSize: 24,
        indexFontSize: 24,
        courseFontSize: 24,
        indexColumnWidth: 35,
        coursePaddingX: 5,
        enableFlatStyle: false,
        enableGrid: true,
        alignCourseTextCenter: false,
        showTeacher: false,
        showRoom: true,
        showRoomCode: false,
        backgroundImage: "",
    });

    const url = `/api/simulation/semesters/`;
    const [{ data: semesters, loading, error }] = useAxios(url);

    useEffect(() => {
        if (!loading && !error) {
            if (semesters.includes(defaultSemester)) {
                setSemester(defaultSemester);
            } else {
                setSemester(semesters[semesters.length - 1]);
            }
        }
    }, [defaultSemester, error, loading, semesters]);
    useEffect(() => {
        if (semester) {
            fetchDatabase(semester);
        }
    }, [fetchDatabase, semester]);

    useEffect(() => {
        let userCourses = {};
        courseOptions.userAddCourseConfig.forEach((course) => {
            userCourses[course.cos_id] = course;
        });

        setMergedAllCourses({ ...allCourses, ...userCourses });
        setMergedCourseIds(
            new Set([
                ...courseIds,
                ...courseOptions.userAddCourseConfig.map(
                    (course) => course.cos_id
                ),
            ])
        );
    }, [allCourses, courseIds, courseOptions]);

    useEffect(() => {
        if (Object.keys(allCourses).length !== 0 && courseIds.size === 0) {
            enqueueSnackbar("尚未加入任何課程，請至模擬排課頁面添加課程!", {
                variant: "warning",
                action: () => (
                    <Button href={`/simulation?sem=${semester}`}>前往</Button>
                ),
            });
            return;
        }

        let classes = [...Array(secs.length)].map((e) =>
            [...Array(timeCode.length)].map((e2) => 0)
        );

        if (courseIds && courseIds.size > 0) {
            const requiredTimes = {};
            for (let course of Array.from(courseIds).map(
                (id) => allCourses[id]
            )) {
                let times = getCourseTimesAndRooms(course);
                for (let time of times) {
                    const exKeys = Object.keys(courseOptions.extendTimetable);
                    if (exKeys.indexOf(timeCode[time[0] - 1]) !== -1) {
                        requiredTimes[timeCode[time[0] - 1]] = true;
                    }
                    if (exKeys.indexOf(time[1]) !== -1) {
                        requiredTimes[time[1]] = true;
                    }
                    classes[secs.indexOf(time[1])][time[0] - 1] += 1;
                }
            }
            setCourseOptions((prev) => ({
                ...prev,
                extendTimetable: {
                    ...prev.extendTimetable,
                    ...requiredTimes,
                },
            }));

            let overlapping = false;
            classes.forEach((a) => {
                a.forEach((b) => {
                    if (b > 1) {
                        overlapping = true;
                    }
                });
            });
            if (overlapping) {
                enqueueSnackbar(
                    "課程時間有重疊，請至模擬排課頁面隱藏重疊課程。",
                    {
                        variant: "warning",
                        action: () => (
                            <Button href={`/simulation?sem=${semester}`}>
                                前往
                            </Button>
                        ),
                    }
                );
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseIds]);

    useEffect(() => {
        enqueueSnackbar("特別注意: 目前尚無法保存設定，重新整理後設定會消失", {
            variant: "warning",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleExport = useCallback(
        ({ allowShareUserTheme, selectTheme }) => {
            setExporting(true);
            axios.post("/api/simulation/export/collect_theme/", {
                theme:
                    selectTheme === -1
                        ? allowShareUserTheme
                            ? JSON.stringify(theme)
                            : "private"
                        : selectTheme.toString(),
            });
            setTimeout(() => {
                DownloadAsImage(
                    document.getElementById("table"),
                    () => setExporting(false),
                    () => {
                        enqueueSnackbar(
                            "IOS匯出失敗，請稍後或重新整理後再嘗試。",
                            "error"
                        );
                    }
                );
            }, 500);
        },
        [enqueueSnackbar, setExporting, theme]
    );

    return loading || error ? (
        <FullLoading />
    ) : (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <Setting
                            semesters={semesters}
                            semester={semester}
                            handleSemesterChange={setSemester}
                            handleExport={handleExport}
                            courseOptions={courseOptions}
                            setCourseOptions={setCourseOptions}
                            tableOptions={tableOptions}
                            setTableOptions={setTableOptions}
                            setTheme={setTheme}
                            courseIds={courseIds}
                            allCourses={allCourses}
                        />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card style={{ overflowX: "scroll" }}>
                        <Table
                            courseIds={mergedCourseIds}
                            allCourses={mergedAllCourses}
                            courseOptions={courseOptions}
                            tableOptions={tableOptions}
                            tableTheme={theme}
                            exporting={exporting}
                        />
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

const mapStateToProps = (state) => ({
    courseIds: state.courseSim.timetable.courseIds,
    allCourses: state.courseSim.database.courses,
});

const mapDispatchToProps = (dispatch) => ({
    fetchDatabase: (semester) => dispatch(fetchDatabase(semester)),
});

export default withSnackbar(
    connect(mapStateToProps, mapDispatchToProps)(PrettierTable)
);
