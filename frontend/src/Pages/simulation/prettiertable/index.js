import React, { useEffect } from "react";
import { Button, Card, Container, Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { fetchDatabase } from "../../../Redux/Actions";
import Setting from "./setting";
import Table from "./table";
import { withSnackbar } from "notistack";

const PrettierTable = ({
    courseIds,
    allCourses,
    fetchDatabase,
    enqueueSnackbar,
}) => {
    const [config, setConfig] = React.useState(null);
    const [semester, setSemester] = React.useState(null);
    useEffect(() => {
        if (config && config.semester !== semester) {
            setSemester(config.semester);
            fetchDatabase(config.semester);
        }
    }, [fetchDatabase, config, semester, setSemester]);

    useEffect(() => {
        if (Object.keys(allCourses).length !== 0 && courseIds.size === 0) {
            enqueueSnackbar("尚未加入任何課程，請至模擬排課頁面添加課程!", {
                variant: "warning",
                action: () => (
                    <Button href={`/simulation?sem=${config.semester}`}>
                        前往
                    </Button>
                ),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseIds]);

    useEffect(() => {
        enqueueSnackbar("特別注意: 目前尚無法保存設定，重新整理後設定會消失", {
            variant: "warning",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <Setting
                            handleConfigChange={setConfig}
                            courseIds={courseIds}
                            allCourses={allCourses}
                        />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    {config && allCourses && (
                        <Card style={{ overflowX: "scroll" }}>
                            <Table
                                {...config}
                                courseIds={courseIds}
                                allCourses={allCourses}
                            />
                        </Card>
                    )}
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
