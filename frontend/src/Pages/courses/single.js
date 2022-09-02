import React, { useState, useEffect } from 'react'
import useAxios from 'axios-hooks'
import {
    Container, Paper, Typography, Link, Box, FormControlLabel, Checkbox, Button, Grid,
    Table, TableBody, TableCell, TableHead, TableRow, TableContainer, FormControl, NativeSelect, Switch, Divider, Tooltip, Hidden
} from '@material-ui/core'
import { Feedback } from './feedback/single'
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import InfoIcon from '@material-ui/icons/Info';
import { RatingDisplay } from '../../Components/StarRating';

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
    const [{ data }] = useAxios(url)
    let [thisTeacherOnly, setThisTeacherOnly] = useState(false)
    let [teacher, setTeacher] = useState("0")
    let [teachers, setTeachers] = useState([])
    let [expand, setExpand] = useState(false)
    useEffect(
        () => {
            setTeachers(data === undefined ? [] : data.history.map(c => c.teacher_name).filter((v, i, a) => a.indexOf(v) === i))
        }, [data]
    )
    const getRating = (ratings) => {
        let n = 0, d = 0
        for (let r of ratings) {
            if (r > 0) {
                n += r
                d++
            }
        }
        return d === 0 ? NaN : n / d
    }
    const getRatingText = (rating) => {
        return isNaN(rating) ? 'NA' : rating.toFixed(1)
    }

    if (data === undefined)
        return <div />

    const rating1 = getRating(data.feedbacks.map(f => f.rating1))
    const rating2 = getRating(data.feedbacks.map(f => f.rating2))
    const rating3 = getRating(data.feedbacks.map(f => f.rating3))
    const rating1F = thisTeacherOnly ? getRating(data.feedbacks.filter(f => f.course.teacher_name === teachers[teacher]).map(f => f.rating1)) : NaN
    const rating2F = thisTeacherOnly ? getRating(data.feedbacks.filter(f => f.course.teacher_name === teachers[teacher]).map(f => f.rating2)) : NaN
    const rating3F = thisTeacherOnly ? getRating(data.feedbacks.filter(f => f.course.teacher_name === teachers[teacher]).map(f => f.rating3)) : NaN

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
            <div style={{ display: "flex", alignItems: 'center', width: '100%', justifyContent: 'center' }}>
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
            <Hidden mdDown>
                <div style={{ display: "flex", alignItems: 'center', width: '100%', justifyContent: 'space-around', padding: '0.8rem 3.2rem' }}>
                    <Tooltip placement='top' arrow title={thisTeacherOnly
                        ? <span>此教授：{getRatingText(rating1F)}<br />所有教授：{getRatingText(rating1)}</span>
                        : `所有教授：${getRatingText(rating1)}`
                    }>
                        <Box>
                            <Typography align='center' gutterBottom>
                                深度 {getRatingText(thisTeacherOnly ? rating1F : rating1)}
                                {
                                    thisTeacherOnly && !isNaN(rating1) &&
                                    <span style={{ fontSize: '12px' }}> /{getRatingText(rating1)}</span>
                                }
                            </Typography>
                            <RatingDisplay size={5} value={thisTeacherOnly ? rating1F : rating1} />
                        </Box>
                    </Tooltip>
                    <Divider flexItem orientation='vertical' />
                    <Tooltip placement='top' arrow title={thisTeacherOnly
                        ? <span>此教授：{getRatingText(rating2F)}<br />所有教授：{getRatingText(rating2)}</span>
                        : `所有教授：${getRatingText(rating2)}`
                    }>
                        <Box>
                            <Typography align='center' gutterBottom>
                                涼度 {getRatingText(thisTeacherOnly ? rating2F : rating2)}
                                {
                                    thisTeacherOnly && !isNaN(rating2) &&
                                    <span style={{ fontSize: '12px' }}> /{getRatingText(rating2)}</span>
                                }
                            </Typography>
                            <RatingDisplay size={5} value={thisTeacherOnly ? rating2F : rating2} />
                        </Box>
                    </Tooltip>
                    <Divider flexItem orientation='vertical' />
                    <Tooltip placement='top' arrow title={thisTeacherOnly
                        ? <span>此教授：{getRatingText(rating3F)}<br />所有教授：{getRatingText(rating3)}</span>
                        : `所有教授：${getRatingText(rating3)}`
                    }>
                        <Box>
                            <Typography align='center' gutterBottom>
                                甜度 {getRatingText(thisTeacherOnly ? rating3F : rating3)}
                                {
                                    thisTeacherOnly && !isNaN(rating3) &&
                                    <span style={{ fontSize: '12px' }}> /{getRatingText(rating3)}</span>
                                }
                            </Typography>
                            <RatingDisplay size={5} value={thisTeacherOnly ? rating3F : rating3} />
                        </Box>
                    </Tooltip>
                </div>
            </Hidden>
            <Hidden lgUp>
                <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center', padding: '0.8rem', width: '100%' }}>
                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', padding: '0.5rem 0px' }}>
                        <Box paddingY={1}>
                            <Typography align='center' gutterBottom>
                                深度 {getRatingText(thisTeacherOnly ? rating1F : rating1)}
                                {
                                    thisTeacherOnly && !isNaN(rating1) &&
                                    <span style={{ fontSize: '12px' }}> /{getRatingText(rating1)}</span>
                                }
                            </Typography>
                            <RatingDisplay size={5} value={thisTeacherOnly ? rating1F : rating1} />
                        </Box>
                        <Divider flexItem orientation='vertical' />
                        <Box paddingY={1}>
                            <Typography align='center' gutterBottom>
                                涼度 {getRatingText(thisTeacherOnly ? rating2F : rating2)}
                                {
                                    thisTeacherOnly && !isNaN(rating2) &&
                                    <span style={{ fontSize: '12px' }}> /{getRatingText(rating2)}</span>
                                }
                            </Typography>
                            <RatingDisplay size={5} value={thisTeacherOnly ? rating2F : rating2} />
                        </Box>
                    </div>
                    <Divider style={{ width: '100%' }} />
                    <Box paddingY={1}>
                        <Typography align='center' gutterBottom>
                            甜度 {getRatingText(thisTeacherOnly ? rating3F : rating3)}
                            {
                                thisTeacherOnly && !isNaN(rating3) &&
                                <span style={{ fontSize: '12px' }}> /{getRatingText(rating3)}</span>
                            }
                        </Typography>
                        <RatingDisplay size={5} value={thisTeacherOnly ? rating3F : rating3} />
                    </Box>
                </div>
            </Hidden>
            <div style={{ display: "flex", alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                {
                    data.feedbacks.filter(f => f.course.teacher_name === teachers[teacher] || !thisTeacherOnly).length > 0 ?
                        <div style={{ padding: '0px 1.2rem' }}>
                            <Link href="/feedbacks/edit/">我也來發一篇！</Link>
                        </div>
                        :
                        <div style={{ padding: '0px 1.2rem' }}>
                            還沒有人寫心得。
                        <Link href="/feedbacks/edit/">成為第一個</Link>
                        </div>
                }
            </div>
            {

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
            }
        </Container>
    )


}

export default CoursePage