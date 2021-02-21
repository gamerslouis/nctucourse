import React from 'react'
import {
    Container, FormControlLabel, Checkbox, Typography, Button,
    InputLabel, Select, Box, FormControl, TextField
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withSnackbar } from 'notistack';


const defaultText = '+★修課年度★\n\n+￡教了什麼￡\n\n+◆上課方式◆\n\n+▼考試作業▼\n\n+￥其他￥\n\n+＆誰適合修這門課＆\n\n'

class NewFeedback extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            semesters: null,
            semester: null,
            enableCourseSearch: false,
            courses: [],
            course: null,
            content: defaultText,
            // anonymous: false,
            draft: true,
            expanded: 'panel1',
        }
        this.handleSemesterChange = this.handleSemesterChange.bind(this)
        this.handleCourseInputChange = this.handleCourseInputChange.bind(this)
        this.handleCourseChange = this.handleCourseChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    }

    componentDidMount() {
        this.updateSemesters()
        if (this.props.match.params.fid !== undefined)
            this.fetchContent(this.props.match.params.fid)
        else if (new URLSearchParams(window.location.search).get('cid') != null) {
            this.fetchCourse(new URLSearchParams(window.location.search).get('cid'))
        }
    }

    async updateSemesters() {
        let res = await axios.get('/api/courses/semesters/')
        this.setState({ semesters: res.data })
    }

    async fetchCourse(cid) {
        let res = await axios.get(`/api/courses/courses/${cid}/`)
        this.setState({
            course: res.data,
            expanded: 'panel2',
        })
    }

    async fetchContent(fid) {
        try {
            let res = await axios.get(`/api/courses/feedbacks/my/${fid}`)
            this.setState({
                course: res.data.course,
                content: res.data.content,
                // anonymous: res.data.anonymous,
                draft: res.data.draft,
                expanded: res.data.course === null ? 'panel1' : 'panel2',
            })
        } catch (error) {
            if (error.response.status === 404) {
                window.location.href = '/404'
            }
            else {
                this.props.enqueueSnackbar(
                    `讀取失敗(${error.request.status})`, { variant: 'error' }
                )
            }
        }
    }

    makeCourseName(course) {
        return `${course.cos_id} ${course.cname}（${course.teacher_name}）`
    }

    async handleSemesterChange(e) {
        const value = e.target.value
        if (value !== '') {
            await this.setState(state => ({
                'enableCourseSearch': true,
                'semester': state.semesters[value]
            }))
            this.handleCourseInputChange('')
        }
        else {
            this.setState({ 'enableCourseSearch': false })
        }
    }

    async handleCourseInputChange(value) {
        const { ayc, sem } = this.state.semester
        const param = `?ayc=${ayc}&sem=${sem}&search=${value}`
        let res = await axios.get('/api/courses/courses/' + param)
        this.setState({ courses: res.data.results })
    }

    async handleCourseChange(value) {
        this.setState(state => ({
            course: value,
            expanded: 'panel2'
        }))
    }

    async handleSubmit(draft) {
        if (!draft) {
            if (this.state.course === null) {
                this.props.enqueueSnackbar(`請選擇課程`, { variant: 'warning' })
                return
            } 
            if (this.state.content === "") {
                this.props.enqueueSnackbar(`請填寫內文`, { variant: 'warning' })
                return
            }
        }

        const data = {
            content: this.state.content,
            // anonymous: this.state.anonymous,
            draft: draft,
        }
        if (this.state.course !== null) {
            data['course'] = this.state.course.id
        }
        try {
            if (this.props.match.params.fid !== undefined) {
                await axios.put(`/api/courses/feedbacks/my/${this.props.match.params.fid}/`, data)

            } else {
                await axios.post('/api/courses/feedbacks/my/', data)
            }
            this.props.enqueueSnackbar(
                "上傳成功", { variant: 'success' }
            )
            setTimeout(() => window.location.href = "/feedbacks?my=true", 1000)
        } catch (error) {
            this.props.enqueueSnackbar(
                `上傳失敗(${error.request.status})`, { variant: 'error' }
            )
        }

    }

    async handleDelete() {
        if (window.confirm("確定刪除文章?")) {
            try {
                await axios.delete(`/api/courses/feedbacks/my/${this.props.match.params.fid}/`)
                window.location.href = '/feedbacks'
            } catch (error) {
                this.props.enqueueSnackbar(
                    `刪除失敗(${error.request.status})`, { variant: 'error' }
                )
            }
        }
    }

    render() {
        return (
            <Container>
                <Typography variant="h4" gutterBottom >{this.state.draft ? '新增心得' : '更新心得'}</Typography>
                <ExpansionPanel expanded={this.state.expanded === 'panel1'} onChange={() => this.setState({ expanded: 'panel1' })}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>

                        <Typography>
                            1. 選擇課程
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Box paddingX={2}>
                            <FormControl style={{ marginRight: 24 }}>
                                <InputLabel htmlFor="semester">修課學期</InputLabel>
                                <Select
                                    native
                                    onChange={this.handleSemesterChange}
                                    inputProps={{
                                        style: { minWidth: "4rem" },
                                        id: 'semester',
                                    }}
                                >
                                    {this.state.semesters !== null &&
                                        (
                                            [(<option aria-label="None" key="x"></option>)].concat(
                                                this.state.semesters.map((s, i) => (<option value={i} key={s.name}>{s.name}</option>))
                                            )
                                        )
                                    }
                                </Select>
                            </FormControl>
                            <Autocomplete
                                style={{ width: "fit-content", display: "inline" }}
                                options={this.state.courses}
                                disabled={!this.state.enableCourseSearch}
                                getOptionLabel={o => this.makeCourseName(o)}
                                onChange={(event, newValue) => {
                                    this.handleCourseChange(newValue);
                                }}
                                onInputChange={(event, newInputValue) => {
                                    this.handleCourseInputChange(newInputValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params}
                                        style={{ minWidth: "15rem" }}
                                        fullWidth={false}
                                        label="課名/課號/老師" color="secondary" />
                                )}
                            />
                        </Box>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel expanded={this.state.expanded === 'panel2'} onChange={() => this.setState({ expanded: 'panel2' })}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>
                            2. 心得撰寫
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{ display: 'block' }}>
                        <Box paddingX={2}>
                            <Box marginY={2}>
                                <Typography>
                                    課程: {this.state.course === null ? '未選取' : this.makeCourseName(this.state.course)}
                                </Typography>
                            </Box>
                            <TextField
                                id="content"
                                name="content"
                                multiline
                                fullWidth
                                rows={15}
                                defaultValue={defaultText}
                                variant="outlined"
                                value={this.state.content}
                                onChange={e => this.setState({ content: e.target.value })}
                            />
                            {"Ps. 行首加號表示該行為段落標題。"}
                            {/* <Box>
                                <FormControlLabel control={<Checkbox name="checkedC"
                                    checked={this.state.anonymous} onChange={e => this.setState({ anonymous: e.target.checked })} />}
                                    label="匿名"
                                />
                            </Box> */}
                            <Box style={{ display: "flex", justifyContent: "center" }} marginBottom={2}>
                                <Box marginX={1}>
                                    <Button variant="contained" color="primary" onClick={() => this.handleSubmit(false)} >{this.state.draft ? '發布' : '更新'}</Button>
                                </Box>
                                {this.state.draft &&
                                    <Box marginX={1}>
                                        <Button variant="contained" onClick={() => this.handleSubmit(true)}>草稿</Button>
                                    </Box>
                                }
                                {this.props.match.params.fid &&
                                    <Box marginX={1}>
                                        <Button variant="contained" onClick={this.handleDelete}>刪除</Button>
                                    </Box>
                                }
                            </Box>
                        </Box>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Container >
        )
    }
}

export default withSnackbar(NewFeedback)