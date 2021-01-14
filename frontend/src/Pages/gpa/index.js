import React from 'react';
import { Container, Typography, Button, Paper, Grid } from '@material-ui/core';
import nctu_gpa_rule from '../../Resources/nctu_gpa_rule.PNG'
import * as gpaTool from '../../Util/dataUtil/gpa'
import axios from 'axios';

const ScorePapar = (props) => {
    return <Grid item xs={12} md={6}>
        <Paper style={{ padding: 50 }}>
            <Typography variant="body1" align="center" gutterBottom
                style={{ fontWeight: 'bold', fontSize: '1.2rem' }}
            >{props.title}</Typography>
            <Typography variant="body1" align="center"
                style={{ fontSize: '2rem' }}
            >{props.score}</Typography>
        </Paper>
    </Grid>
}

class Index extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            overall40GPA: 0.00,
            overall43GPA: 0.00,
            last6040GPA: 0.00,
            last6043GPA: 0.00,
            last60Credits: 0
        }
    }
    componentDidMount() {
        this.fetchGPAData()
    }
    fetchGPAData(){
        axios.get('/api/accounts/courses_history/').then((res) => {
            let courses = JSON.parse(res.data['data']).filter(gpaTool.filterNotCourse)
            let credits = gpaTool.getCredits(courses)
            let [last60Courses, last60Credits] = gpaTool.getLast60Courses(courses)
            const sum = (a, b) => a + b
            if(credits !== 0) {
                this.setState({
                    overall40GPA: courses.map(c => gpaTool.courseTo40Point(c) * c.cos_credit).reduce(sum) / credits,
                    overall43GPA: courses.map(c => gpaTool.courseTo43Point(c) * c.cos_credit).reduce(sum) / credits,
                    last6040GPA: last60Courses.map(c => gpaTool.courseTo40Point(c) * c.cos_credit).reduce(sum) / last60Credits,
                    last6043GPA: last60Courses.map(c => gpaTool.courseTo43Point(c) * c.cos_credit).reduce(sum) / last60Credits,
                    last60Credits: last60Credits
                })
            }
        })
    }
    render() {
        const { overall40GPA, overall43GPA, last6040GPA, last6043GPA, last60Credits } = this.state
        return <Container>
            <Typography variant="h4" gutterBottom >GPA 計算機</Typography>
            <div style={{ marginBottom: 20 }}>
                <Typography display="inline">
                    提供 Overall GPA、Last 60 Credits 的成績試算，查看計算結果前必須先匯入您的歷史成績。
            </Typography>
                <Button variant="contained" color="primary" style={{ marginLeft: 10 }}
                    href="/gpa/import"
                >匯入歷史成績</Button>
            </div>
            <div style={{ padding: '0 45px' }}>
                <Grid container spacing={6} >
                    <ScorePapar title="Overall 4.0" score={overall40GPA.toFixed(2)} />
                    <ScorePapar title="Overall 4.3" score={overall43GPA.toFixed(2)} />
                    <ScorePapar title={`Last 60 Credits 4.0 (${last60Credits})`} score={last6040GPA.toFixed(2)} />
                    <ScorePapar title={`Last 60 Credits 4.3 (${last60Credits})`} score={last6043GPA.toFixed(2)} />
                </Grid>
            </div>
            <div style={{ paddingTop: 20 }}>
                <Typography variant="caption">
                    註：此計算參考 <a href={nctu_gpa_rule} target='_blank' rel='noopener noreferrer'>等級制與百分制及GP對照表-交通大學</a> 與 <a href='http://intra.tpml.edu.tw/study/upload/downloads/GPA.htm' target='_blank'  rel='noopener noreferrer'> 美國大學四點制的算法</a>，採計百分法評分方式成績計算，Last 60 Credits 採由後往前計算至大於等於 60 學分為止，也就是可能超過 60 學分 (呈現於括號內)，實際成績以學校成績單為準。
                </Typography>
            </div >
        </Container >
    }

}

export default Index