import React from 'react';
import { Container, Typography, Button, Paper, useTheme } from '@material-ui/core';
import useAxios from 'axios-hooks'

import CourseTable from './import/CourseTable'
import FullLoading from '../../Components/FullLoading';
import { useSnackbar } from 'notistack';

import * as gpaTool from '../../Util/dataUtil/gpa'

const History = () => {
    const [{ data, loading, error }] = useAxios(
        '/api/accounts/courses_history/'
    )
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme()

    if (loading) return <FullLoading />
    const courses = error ? [] : JSON.parse(data.data)
    if (error) enqueueSnackbar('載入失敗')

    return <Container>
        <Typography variant="h4" gutterBottom >修課記錄</Typography>

        <div style={{ marginBottom: theme.spacing(2) }}>
            <Button variant="contained" color="primary" style={{ marginLeft: 10 }}
                href="/gpa/import?redir=coursehistory"
            >匯入歷史成績</Button>
        </div>
        <div style={{ marginBottom: theme.spacing(2) }}>
            <Typography variant="caption">
                註：課程數包含退選及未送註冊組。實得學分僅計算非退選、已送註冊組之學分及抵免學分，另外不及格及重修均會計入。
            </Typography>
        </div>
        <Paper style={{ padding: theme.spacing(2), marginBottom: theme.spacing(2) }}>
            <Typography variant="h5" gutterBottom align="center" >
                總計: {courses.length} 門課 實得 {gpaTool.getCredits(
                courses.filter(gpaTool.filterEffectiveCourse).concat(
                    courses.filter(gpaTool.filterTransCourse)
                ))} 學分
            </Typography>
            <CourseTable courses={courses}></CourseTable>
        </Paper>
    </Container >
}

export default History