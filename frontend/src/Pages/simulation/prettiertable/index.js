import React, { useEffect } from "react";
import { Card, Container, Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { fetchDatabase } from "../../../Redux/Actions";
import Setting from "./setting";
import Table from "./table";

const PrettierTable = ({ courseIds, allCourses, fetchDatabase, classes }) => {
    const [config, setConfig] = React.useState(null);
    const [semester, setSemester] = React.useState(null);
    useEffect(() => {
        if (config && config.semester !== semester) {
            setSemester(config.semester);
            fetchDatabase(config.semester);
        }
    }, [fetchDatabase, config, semester, setSemester]);

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

export default connect(mapStateToProps, mapDispatchToProps)(PrettierTable);
