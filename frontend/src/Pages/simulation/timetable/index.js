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
import { removeCollectCourse, toggleCollectCourseVisible, searchTimeCourses } from '../../../Redux/Actions/index'

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
    tdx: {
        padding: 0
    },
    courseContainer: {
        height: "100%",
        width: "100%",
        padding: '2px 3px',
        border: "2px #ffffff solid",
        '&:hover': {
            border: "2px #81C4FF solid",
            boxSizing: "border-box",
            cursor: "pointer",
            // boxShadow: "rgba(0,0,0,0.4) 3px 3px 3px 0px inset",  
        },
    }
})

const courseStyles = theme => ({
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
})

const TimeTableCourse = withStyles(courseStyles)((props) => {
    const { course, roomCode, roomName, time, showRoomCode, hideOverflowText, classes, setAnchor } = props
    return (
        <ButtonBase
            style={{ width: '100%' }}
            focusRipple
            onClick={(event) => {
                setAnchor({
                    menuAnchorEl: event.currentTarget,
                    menuTarget: course.cos_id,
                    menuTargetTime: time,
                    menuTargetIsCourse: true
                })
                event.stopPropagation()
            }}
            aria-controls="timetable-course-menu"
            aria-haspopup="true"
        >
            <Tooltip title={`${course.cos_cname} ${course.teacher}/${showRoomCode ? roomCode : roomName}`} arrow>
                <div className={classes.course} style={{ backgroundColor: CourseTypeColorMap[course.cos_type] }}>
                    <span className={clsx(classes.textSpan, hideOverflowText ? classes.textSpanHide : "")}>
                        <Typography display="inline" variant="body2">{course.cos_cname} </Typography>
                        <div className={hideOverflowText ? classes.textTeacherHide : ""}>
                            <Typography display="inline" variant="caption">{course.teacher}/</Typography>
                            <Typography display="inline" variant="caption">{showRoomCode ? roomCode : roomName}</Typography>
                        </div>
                    </span>
                </div>
            </Tooltip>
        </ButtonBase>
    )
})

class TimeTable extends React.Component {
    secs = ['M', 'N', 'A', 'B', 'C', 'D', 'X', 'E', 'F', 'G', 'H', 'Y', 'I', 'J', 'K', 'L']
    newSecs = ['y', 'z', '1', '2', '3', '4', 'n', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd']

    constructor(props) {
        super(props)
        this.state = { menuAnchorEl: null, menuTarget: '', menuTargetTime: '', menuTargetIsCourse: true }
        this.closeMenu = this.closeMenu.bind(this)
        this.setAnchor = this.setAnchor.bind(this)
        this.handleCourseSpaceClick = this.handleCourseSpaceClick.bind(this)
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
                const secIdx = this.secs.indexOf(time[1])
                const timeIdx = time[0] - 1
                const l = classes[secIdx][timeIdx].length
                if (l > 0 && classes[secIdx][timeIdx][l-1].course.cos_id === course.cos_id) 
                    continue
                classes[secIdx][timeIdx].push({
                    course: course,
                    roomCode: time[2],
                    roomName: time[3],
                    time: time.slice(0, 2),
                })
            }
        }
        return [classes, credits, hours]
    }
    handleCourseSpaceClick(e, time) {
        this.setState({
            menuAnchorEl: e.currentTarget,
            menuTargetTime: time,
            menuTargetIsCourse: false
        })
    }
    setAnchor(archorMeta) {
        this.setState(archorMeta)
    }

    render() {
        const { showWeekend, extendTimetable, classes, hideOverflowText, showRoomCode, newTimeCode } = this.props
        let [courseClasses, credits, hours] = this.makeCourseClasses()
        let titles = newTimeCode ? ['M', 'T', 'W', 'R', 'F'] : ['一', '二', '三', '四', '五']
        if (showWeekend) titles = titles.concat(newTimeCode ? ['S', 'U'] : ['六', '日'])

        return (<div className={classes.root}>
            <div className={classes.tableContainer}>
                <div>
                    { this.props.semester && <Typography variant="h4">歷年課程：{this.props.semester}</Typography>}
                    <Typography>總計: {credits}學分/{hours}小時</Typography>
                </div>
                <table className={classes.table} border={1} id="timetable">
                    <thead>
                        <tr>
                            <td className={clsx(classes.td, classes.td1)}>節數</td>
                            {titles.map(text => <td className={classes.td} key={text}>{text}</td>)}
                        </tr>
                    </thead>
                    <tbody>
                        {courseClasses.map((rowClasses, index) => (<tr key={index}>
                            <td className={clsx(classes.td, classes.td1)}>{newTimeCode ? this.newSecs[index] : this.secs[index]}</td>
                            {rowClasses.slice(0, showWeekend ? 7 : 5).map((cellClasses, index2) => (
                                <td className={clsx(classes.td, classes.tdx)} key={index2}>
                                    <div className={classes.courseContainer}
                                        onClick={e => this.handleCourseSpaceClick(e, [index2 + 1, this.secs[index]])}>
                                        {cellClasses.map(courseData =>
                                            <TimeTableCourse {...courseData}
                                                hideOverflowText={hideOverflowText}
                                                showRoomCode={showRoomCode}
                                                setAnchor={this.setAnchor}
                                                key={courseData.course.cos_id} />

                                        )}
                                    </div>
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
                {this.state.menuTargetIsCourse &&
                    <MenuItem onClick={() => {
                        this.closeMenu()
                        this.props.setTimetableVisible(this.state.menuTarget, false)
                    }}>隱藏</MenuItem>
                }
                {this.state.menuTargetIsCourse &&
                    <MenuItem onClick={() => {
                        this.closeMenu()
                        this.props.removeCourse(this.state.menuTarget)
                    }}>移除</MenuItem>
                }
                {this.state.menuTargetIsCourse &&
                    <MenuItem onClick={() => {
                        this.closeMenu()
                        window.open(makeInfoPageUrl(this.state.menuTarget))
                    }}>詳細資訊</MenuItem>
                }
                <MenuItem onClick={() => {
                    this.closeMenu()
                    this.props.searchTimeCourses(this.state.menuTargetTime, true)
                }}>找通識</MenuItem>
                <MenuItem onClick={() => {
                    this.closeMenu()
                    this.props.searchTimeCourses(this.state.menuTargetTime)
                }}>找所有課</MenuItem>
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
    showRoomCode: state.courseSim.settings.showRoomCode,
    newTimeCode: state.courseSim.settings.newTimeCode,
})

const mapDispatchToProps = (dispatch, props) => ({
    removeCourse: (courseId) => {
        dispatch(removeCollectCourse(courseId))
    },
    setTimetableVisible: (courseId, visible) => {
        dispatch(toggleCollectCourseVisible(courseId, visible))
    },
    searchTimeCourses: (time, commonOnly) => {
        dispatch(searchTimeCourses(time, commonOnly))
        if (props.changeTabIndex) {
            props.changeTabIndex(0)
        }
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TimeTable))

