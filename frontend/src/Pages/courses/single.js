import React, { useState, useEffect } from 'react'
import useAxios from 'axios-hooks'
import {
    Container, Paper, Typography, Link, Box, FormControlLabel, Checkbox, Button, Grid,
    Table, TableBody, TableCell, TableHead, TableRow, TableContainer, FormControl, NativeSelect, Switch
} from '@material-ui/core'
import { Feedback } from './feedback/single'
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import InfoIcon from '@material-ui/icons/Info';

const Title = (props) => (
    <Grid container direction="row" alignItems="center">
        <Grid item style={{ marginRight: 5 }}>
            <props.icon />
        </Grid>
        <Grid item>
            <Typography variant="h5" gutterBottom>
                {props.text}
            </Typography>
        </Grid>
    </Grid>
)

const CoursePage = (props) => {
    let url = `/api/courses/courses/${props.match.params.cid}/?detail=true`
    const [{ data, loading, error }, refetch] = useAxios(url)
    let [thisTeacherOnly, setThisTeacherOnly] = useState(false)
    let [teacher, setTeacher] = useState("0")
    let [teachers, setTeachers] = useState([])
    let [expand, setExpand] = useState(false)
    useEffect(
        () => {
            setTeachers(data === undefined ? [] : data.history.map(c => c.teacher_name).filter((v, i, a) => a.indexOf(v) === i))
        }, [data]
    )

    if (data === undefined)
        return <div />

    return (
        <Container>
            <Typography variant="h4" gutterBottom >{data.cname}</Typography>

            <Title icon={InfoIcon} text="課程資訊" />
            <Box component={Paper} paddingX={5} paddingY={3} marginBottom={5}>
                <Typography>
                    永久課號: {data.perm_id}<br />
                </Typography>
                <FormControlLabel
                    control={<Switch checked={expand} onChange={e => setExpand(e.target.checked)} />}
                    label="展開"
                />
                <TableContainer className="table-responsive" style={{ whiteSpace: "nowrap" }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>學期</TableCell>
                                <TableCell>課號</TableCell>
                                <TableCell>老師</TableCell>
                                <TableCell>修課人數/上限</TableCell>
                                <TableCell>時間/教室</TableCell>
                                <TableCell>備註</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.history.slice(0, expand ? data.history.length : 5).map(row => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                        {row.sem_name}
                                    </TableCell>
                                    <TableCell>{row.cos_id}</TableCell>
                                    <TableCell>{row.teacher_name}</TableCell>
                                    <TableCell>{row.reg_number}/{row.num_limit}</TableCell>
                                    <TableCell>{row.time}</TableCell>
                                    <TableCell>{row.memo}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Title icon={RecentActorsIcon} text="修課心得" />
            <div style={{ display: "flex", alignItems: 'center' }}>
                <FormControlLabel
                    control={<Checkbox checked={thisTeacherOnly} onChange={e => setThisTeacherOnly(e.target.checked)} />}
                    label="只看"
                />
                <FormControl>
                    <NativeSelect
                        value={teacher}
                        onChange={e => setTeacher(e.target.value)}
                    >
                        {teachers.map((t, i) =>
                            <option key={t} value={i}>{t}</option>
                        )}
                    </NativeSelect>
                </FormControl>
            </div>
            {
                data.feedbacks.length > 0 ?
                    data.feedbacks
                        .filter(f => f.course.teacher_name === teachers[teacher] || !thisTeacherOnly)
                        .map(f =>
                            <Box key={f.id} marginY={2}>
                                <Feedback id={f.id} feedback={f}
                                    renderActions={f => (
                                        <>
                                            {
                                                f.owned &&
                                                <Button variant="contained" color="primary" size="small"
                                                    href={`/feedbacks/edit/${f.id}`}
                                                >
                                                    編輯
                                                </Button>
                                            }
                                        </>
                                    )}
                                />
                            </Box>)
                    :
                    <div align="center">
                        還沒有人寫心得。
                        <Link href="/feedbacks/edit/">成為第一個</Link>
                    </div>
            }
        </Container>
    )


}

export default CoursePage