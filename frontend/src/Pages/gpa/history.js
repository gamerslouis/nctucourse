import React from 'react';
import { Container, Typography, Button, Paper, Grid, useTheme } from '@material-ui/core';
import useAxios from 'axios-hooks'

import CourseTable from '../../Components/CourseTable'
import FullLoading from '../../Components/FullLoading';
import { useSnackbar } from 'notistack';

import * as gpaTool from '../../Util/dataUtil/gpa'

const History = (props) => {
    const [{ data, loading, error }, refetch] = useAxios(
        '/api/accounts/courses_history/'
    )
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme()

    if (loading) return <FullLoading />
    const courses = error ? [] : JSON.parse(data.data)
    if (error) enqueueSnackbar('載入失敗')

    return <Container>
        <Typography variant="h4" gutterBottom >修課記錄</Typography>

        <div style={{ marginBottom: 20 }}>
            <Button variant="contained" color="primary" style={{ marginLeft: 10 }}
                href="/gpa/import?redir=coursehistory"
            >匯入歷史成績</Button>
        </div>
        <Paper style={{ padding: theme.spacing(2) }}>
            <Typography variant="h5" gutterBottom align="center" >
                總計: {courses.length} 門課(含退選及未送出) 實得 {gpaTool.getCredits(
                courses.filter(gpaTool.filterNotCourse).concat(
                    courses.filter(gpaTool.filterTransCourse)
                ))} 學分
            </Typography>
            <CourseTable courses={courses}></CourseTable>
        </Paper>
    </Container >
}

export default History