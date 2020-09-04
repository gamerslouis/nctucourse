import React from 'react';
import { Container, Typography, Button, Paper, Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import { fetchGPAData } from '../../Redux/Actions'
import nctu_gpa_rule from '../../Resources/nctu_gpa_rule.PNG'

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
    componentDidMount() {
        this.props.fetchGPAData()
    }
    render() {
        const { gpa } = this.props
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
                    <ScorePapar title="Overall 4.0" score={gpa.overall40GPA.toFixed(2)} />
                    <ScorePapar title="Overall 4.3" score={gpa.overall43GPA.toFixed(2)} />
                    <ScorePapar title={`Last 60 Credits 4.0 (${gpa.last60Credits})`} score={gpa.last6040GPA.toFixed(2)} />
                    <ScorePapar title={`Last 60 Credits 4.3 (${gpa.last60Credits})`} score={gpa.last6043GPA.toFixed(2)} />
                </Grid>
            </div>
            <div style={{ paddingTop: 20 }}>
                <Typography variant="caption">
                    註：此計算參考 <a href={nctu_gpa_rule} target='blank'>等級制與百分制及GP對照表-交通大學</a> 與 <a href='http://intra.tpml.edu.tw/study/upload/downloads/GPA.htm' target='_blank'> 美國大學四點制的算法</a>，採計百分法評分方式成績計算，Last 60 Credits 採由後往前計算至大於等於 60 學分為止，也就是可能超過 60 學分 (呈現於括號內)，實際成績以學校成績單為準。
                </Typography>
            </div >
        </Container >
    }

}
const mapStateToProps = (state) => ({
    gpa: state.gpa
})

const mapDispatchToProps = (dispatch) => ({
    fetchGPAData: () => dispatch(fetchGPAData())
})


export default connect(mapStateToProps, mapDispatchToProps)(Index)