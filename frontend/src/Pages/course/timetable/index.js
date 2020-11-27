import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { getCourseTimesAndRooms } from '../../../Util/dataUtil/course'
import Tooltip from '@material-ui/core/Tooltip';
import { CourseTypeColorMap } from '../../../Util/style'
import { makeInfoPageUrl } from '../../../Util/dataUtil/course'
import { removeCollectCourse, toggleCollectCourseVisible } from '../../../Redux/Actions/index'
import semesterMap from '../../../Util/semesterMap'

const styles = theme => ({
    root: {
        width: '100%',
        padding: theme.spacing(3),
        height: '100%',
        overflow: 'auto'
    },
    tableContainer: {
        [theme.breakpoints.down('sm')]: {
            width: '200%',
            paddingRight: 20
        },
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'center',
        tableLayout: 'fixed'
    },
    td: {
        borderWidth: 1,
        borderColor: '#aaaaaa',
        borderStyle: 'solid',
        height: 50,
        padding: '2px 3px'
    },
    td1: {
        width: '2.5rem',
        whiteSpace: 'nowrap'
    },
    course: {
        width: '100%',
        margin: '1px 0',
        padding: '0.2rem 0.1rem',
        borderRadius: 10
    },
    textSpan: {
        display: 'inline-block',
        width: '100%',
        overflow: 'hidden !important',
        textOverflow: 'ellipsis'
    },
    textSpanHide: {
        [theme.breakpoints.up('lg')]: {
            whiteSpace: 'nowrap',
        }
    },
    textTeacherHide: {
        [theme.breakpoints.up('lg')]: {
            display: 'inline'
        },
    },
    xd: {
        q: '#fbfbfb'
    }
})

class TimeTable extends React.Component {
    secs = ['M', 'N', 'A', 'B', 'C', 'D', 'X', 'E', 'F', 'G', 'H', 'Y', 'I', 'J', 'K', 'L']

    constructor(props) {
        super(props)
        this.state = { menuAnchorEl: null, menuTarget: '' }
        this.closeMenu = this.closeMenu.bind(this)
    }

    closeMenu() {
        this.setState({ menuAnchorEl: null })
    }

    makeCourseClasses() {
        let credits = 0, hours = 0
        let classes = [...Array(this.secs.length)].map(e => [...Array(7)].map(e2 => Array(0)))
        let { courseIds, allCourses } = this.props
        for (let course of Array.from(courseIds).map(id => allCourses[id])) {
            credits += Number(course['cos_credit'])
            let times = getCourseTimesAndRooms(course)
            hours += times.length
            for (let time of times) {
                classes[this.secs.indexOf(time[1])][time[0] - 1].push({
                    course: course,
                    roomCode: time[2],
                    roomName: time[3],
                })
            }
        }
        return [classes, credits, hours]
    }

    render() {
        const { showWeekend, extendTimetable, classes, hideOverflowText, showRoomCode } = this.props
        let [courseClasses, credits, hours] = this.makeCourseClasses()
        let titles = ['一', '二', '三', '四', '五']
        if (showWeekend) titles = titles.concat(['六', '日'])

        return (<div className={classes.root}>
            <div className={classes.tableContainer}>
                <div>
                    { this.props.semester && <Typography variant="h4">歷年課程：{semesterMap[this.props.semester]}</Typography>}
                    <Typography>總計: {credits}學分/{hours}小時</Typography>
                </div>
                <table className={classes.table} border={1} id="timetable">
                    <thead>
                        <tr>
                            <td className={clsx(classes.td, classes.td1)}>節數</td>
                            {titles.map(text => <td className={classes.td}>{text}</td>)}
                        </tr>
                    </thead>
                    <tbody>
                        {courseClasses.map((rowClasses, index) => (<tr key={index}>
                            <td className={clsx(classes.td, classes.td1)}>{this.secs[index]}</td>
                            {rowClasses.slice(0, showWeekend ? 7 : 5).map(cellClasses => (
                                <td className={classes.td}>
                                    {cellClasses.map(({ course, roomCode, roomName }) =>
                                        <ButtonBase style={{
                                            width: '100%',
                                        }} focusRipple
                                            onClick={(event) => {
                                                this.setState({
                                                    menuAnchorEl: event.currentTarget,
                                                    menuTarget: course.cos_id
                                                })
                                            }}
                                            aria-controls="timetable-course-menu" aria-haspopup="true"
                                        >
                                            <Tooltip title={`${course.cos_cname} ${course.teacher}/${showRoomCode ? roomCode : roomName}`} arrow>
                                                <div className={classes.course} style={{ backgroundColor: CourseTypeColorMap[course.cos_type] }}>
                                                    <span className={clsx(classes.textSpan, hideOverflowText && classes.textSpanHide)}>
                                                        <Typography display="inline" variant="body2">{course.cos_cname} </Typography>
                                                        <div className={hideOverflowText && classes.textTeacherHide}>
                                                            <Typography display="inline" variant="caption">{course.teacher}/</Typography>
                                                            <Typography display="inline" variant="caption">{showRoomCode ? roomCode : roomName}</Typography>
                                                        </div>
                                                    </span>
                                                </div>
                                            </Tooltip>
                                        </ButtonBase>
                                    )}
                                </td>
                            ))}
                        </tr>)).splice(extendTimetable ? 0 : 1, this.secs.length - (extendTimetable ? 0 : 2))}
                    </tbody>
                </table>
            </div>

            <Menu
                id="timetable-course-menu"
                anchorEl={this.state.menuAnchorEl}
                keepMounted
                open={Boolean(this.state.menuAnchorEl)}
                onClose={this.closeMenu}
            >
                <MenuItem onClick={() => {
                    this.closeMenu()
                    this.props.setTimetableVisible(this.state.menuTarget, false)
                }}>隱藏</MenuItem>
                <MenuItem onClick={() => {
                    this.closeMenu()
                    this.props.removeCourse(this.state.menuTarget)
                }}>移除</MenuItem>
                <MenuItem onClick={() => {
                    this.closeMenu()
                    window.open(makeInfoPageUrl(this.state.menuTarget))
                }}>詳細資訊</MenuItem>
            </Menu>
        </div >)
    }
}

const mapStateToProps = (state) => ({
    courseIds: state.courseSim.timetable.courseIds,
    allCourses: state.courseSim.database.courses,
    extendTimetable: state.courseSim.settings.extendTimetable,
    showWeekend: state.courseSim.settings.showWeekend,
    hideOverflowText: state.courseSim.settings.hideOverflowText,
    showRoomCode: state.courseSim.settings.showRoomCode
})

const mapDispatchToProps = (dispatch) => ({
    removeCourse: (courseId) => {
        dispatch(removeCollectCourse(courseId))
    },
    setTimetableVisible: (courseId, visible) => {
        dispatch(toggleCollectCourseVisible(courseId, visible))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TimeTable))

