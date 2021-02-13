import React from 'react'
import {
    Container, Paper, Table, TableContainer, TableRow, TableCell, TableHead, TableBody, FormControlLabel, Checkbox,
    TablePagination, InputBase, Typography, Button, InputLabel, Select, Box, FormControl, FormGroup, Grid, FormLabel, TextField
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios'

const defaultText = '★修課年度★\n\n￡教了什麼￡\n\n◆上課方式◆\n\n▼考試作業▼\n\n￥其他￥\n\n＆誰適合修這門課＆\n\n'

class CourseList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            semesters: null,
            semester: null,
            enableCourseSearch: false,
            courses: [],
            course: null,
            title: '',
            content: defaultText,
            anonymous: false,
            draft: true,
        }
        this.handleSemesterChange = this.handleSemesterChange.bind(this)
        this.handleCourseInputChange = this.handleCourseInputChange.bind(this)
        this.handleCourseChange = this.handleCourseChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        console.log(props)
    }

    componentDidMount() {
        console.log(this.props)
        this.updateSemesters()
        if (this.props.match.params.fid !== undefined)
            this.fetchContent(this.props.match.params.fid)
    }

    async updateSemesters() {
        let res = await axios.get('/api/courses/semesters/')
        console.log(res.data)
        this.setState({ semesters: res.data })
    }

    async fetchContent(fid) {
        try {
            let res = await axios.get(`/api/courses/feedbacks/my/${fid}`)
            this.setState({
                course: res.data.course,
                title: res.data.title,
                content: res.data.content,
                anonymous: res.data.anonymous,
                draft: res.data.draft,
            })
        } catch (error) {
            if (error.response.status === 404) {
                window.location.href = '/404'
            }
            else {
                //TODO
            }
        }
    }

    makeCourseName(course) {
        return `${course.cos_id} ${course.cname}（${course.teacher_name}）`
    }

    async handleSemesterChange(e) {
        const value = e.target.value
        if (value != '') {
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
        console.log(value)
        const { ayc, sem } = this.state.semester
        const param = `?ayc=${ayc}&sem=${sem}&search=${value}`
        let res = await axios.get('/api/courses/' + param)
        this.setState({ courses: res.data.results })
    }

    async handleCourseChange(value) {
        this.setState(state => ({
            course: value
        }))
    }

    async handleSubmit(draft) {
        if (!draft) {
            // TODO
            if (this.state.course === null) {
                window.alert('請選擇課程')
                return
            }
        }

        const data = {
            title: this.state.title,
            content: this.state.content,
            anonymous: this.state.anonymous,
            draft: draft,
        }
        if (this.state.course !== null) {
            data['course'] = this.state.course.id
        }
        console.log(data)
        try {
            if (this.props.match.params.fid !== undefined) {
                await axios.put(`/api/courses/feedbacks/my/${this.props.match.params.fid}/`, data)

            } else {
                await axios.post('/api/courses/feedbacks/my/', data)
            }
        } catch (error) {
            // TODO
            console.log(error)
        }
        // TODO
        console.log('ok')
    }

    async handleDelete() {
        if (window.confirm("確定刪除文章?")) {
            try {
                await axios.delete(`/api/courses/feedbacks/my/${this.props.match.params.fid}/`)
                window.location.href = '/feedbacks'
            } catch (error) {
                // TODO
            }
        }
    }

    render() {
        console.log(this.state)
        return (
            <Container>
                <Typography variant="h4" gutterBottom >{this.state.draft ? '新增心得' : '更新心得'}</Typography>
                <Box component={Paper} paddingX={3} paddingY={1}>
                    <Box my={3}>
                        <Typography>
                            1. 選擇課程
                        </Typography>
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
                                    console.log(event)
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
                    </Box>
                    <Box my={3}>
                        <Typography>
                            2. 心得撰寫
                        </Typography>
                        <Box paddingX={2}>
                            <Box marginY={2}>
                                <Typography>
                                    課程: {this.state.course === null ? '未選取' : this.makeCourseName(this.state.course)}
                                </Typography>
                            </Box>
                            <Box marginBottom={2}>
                                <TextField id="title" name="title" label="標題" color="secondary" fullWidth
                                    value={this.state.title} onChange={e => this.setState({ title: e.target.value })}
                                />
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
                            <Box>
                                <FormControlLabel control={<Checkbox name="checkedC"
                                    checked={this.state.anonymous} onChange={e => this.setState({ anonymous: e.target.checked })} />}
                                    label="匿名"
                                />
                            </Box>
                        </Box>
                    </Box>
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
            </Container >
        )
    }
}

export default CourseList