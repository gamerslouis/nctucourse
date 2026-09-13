import React from 'react';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import ClearIcon from '@material-ui/icons/Clear';
import CourseList from '../../../Components/CourseList'
import CourseListItem from '../../../Components/CourseListItem'
import CustomCourseDialog from '../../../Components/CustomCourseDialog'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import Button from '@material-ui/core/Button'
import {
    removeCollectCourse, toggleCollectCourseVisible,
    addCustomCourse, updateCustomCourse, removeCustomCourse
} from '../../../Redux/Actions/index'


const styles = (theme) => ({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column'
    },
    filter: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    },
    list: {
        overflowY: 'scroll'
    }
});

class CollectList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filter: '',
            customOpen: false,
            editing: null
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(key) {
        return (e) => {
            this.setState({
                [key]: e.target.value
            })
        }
    }

    render() {
        const { classes, courseIds, allCourses, removeCourse, timetableIds, setTimetableVisible,
            addCustom, updateCustom, removeCustom } = this.props
        const { filter, customOpen, editing } = this.state
        const typeOrder = ['必修', '選修', '通識', '體育', '外語', '軍訓']
        return (
            <div className={classes.root}>
                <div className={classes.filter}>
                    <FormControl
                        fullWidth
                        margin="normal"
                        className={classes.filter}
                    >
                        <OutlinedInput
                            id="course-list-filter-text"
                            placeholder="filter"
                            margin="dense"
                            value={this.state.filter}
                            onChange={this.handleChange('filter')}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="clear filter"
                                        onClick={() => this.setState({ filter: '' })}
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </div>
                <div>
                    <CourseList courseListItems={Array.from(courseIds).map(ele => allCourses[ele])
                        .filter(ele => filter === '' | ele.cos_cname.indexOf(filter) !== -1)
                        .sort((a, b) => typeOrder.indexOf(a.cos_type) - typeOrder.indexOf(b.cos_type))
                        .map(ele =>
                            <CourseListItem
                                key={ele.cos_id}
                                course={ele}
                                multiAction={ele.custom ? 3 : 2}
                                actions={
                                    <React.Fragment>
                                        {
                                            timetableIds.has(ele.cos_id) ?
                                                (<IconButton edge="end" onClick={() => ele.custom
                                                    ? updateCustom(ele.custom.id, { visible: false }).catch((err) => console.log(err))
                                                    : setTimetableVisible(ele.cos_id, false)}>
                                                    <VisibilityIcon />
                                                </IconButton>) :
                                                (<IconButton edge="end" onClick={() => ele.custom
                                                    ? updateCustom(ele.custom.id, { visible: true }).catch((err) => console.log(err))
                                                    : setTimetableVisible(ele.cos_id, true)}>
                                                    <VisibilityOffIcon />
                                                </IconButton>
                                                )

                                        }
                                        {ele.custom &&
                                            <IconButton edge="end"
                                                onClick={() => this.setState({ editing: ele.custom, customOpen: true })}>
                                                <EditIcon />
                                            </IconButton>}
                                        <IconButton edge="end" onClick={() =>
                                            ele.custom ? removeCustom(ele.custom.id).catch((err) => console.log(err)) : removeCourse(ele.cos_id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </React.Fragment>
                                }
                            />)}
                    />
                </div>
                <div style={{ padding: 8 }}>
                    <Button fullWidth startIcon={<AddIcon />}
                        onClick={() => this.setState({ editing: null, customOpen: true })}>
                        新增自訂課程
                    </Button>
                </div>
                <CustomCourseDialog
                    open={customOpen}
                    initial={editing}
                    onClose={() => this.setState({ customOpen: false, editing: null })}
                    onSubmit={(course) => {
                        const done = () => this.setState({ customOpen: false, editing: null })
                        return (editing ? updateCustom(editing.id, course) : addCustom(course))
                            .then(done)
                    }}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    courseIds: state.courseSim.collect.courseIds,
    timetableIds: state.courseSim.timetable.courseIds,
    allCourses: state.courseSim.database.courses
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    addCustom: (course) => dispatch(addCustomCourse(course, ownProps.semester)),
    updateCustom: (id, course) => dispatch(updateCustomCourse(id, course)),
    removeCustom: (id) => dispatch(removeCustomCourse(id)),
    removeCourse: (courseId) => {
        dispatch(removeCollectCourse(courseId))
    },
    setTimetableVisible: (courseId, visible) => {
        dispatch(toggleCollectCourseVisible(courseId, visible))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CollectList))
