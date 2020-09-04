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
import { removeCollectCourse, toggleCollectCourseVisible } from '../../../Redux/Actions/index'


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
            filter: ''
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
        const { classes, courseIds, allCourses, removeCourse, timetableIds, setTimetableVisible } = this.props
        const { filter } = this.state
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
                        .filter(ele => filter == '' | ele.cos_cname.indexOf(filter) != -1)
                        .sort((a, b) => typeOrder.indexOf(a.cos_type) - typeOrder.indexOf(b.cos_type))
                        .map(ele =>
                            <CourseListItem
                                key={ele.cos_id}
                                course={ele}
                                multiAction={2}
                                actions={
                                    <React.Fragment>
                                        {
                                            timetableIds.has(ele.cos_id) ?
                                                (<IconButton edge="end" onClick={() => setTimetableVisible(ele.cos_id, false)}>
                                                    <VisibilityIcon />
                                                </IconButton>) :
                                                (<IconButton edge="end" onClick={() => setTimetableVisible(ele.cos_id, true)}>
                                                    <VisibilityOffIcon />
                                                </IconButton>
                                                )

                                        }
                                        <IconButton edge="end" onClick={() => removeCourse(ele.cos_id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </React.Fragment>
                                }
                            />)}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    courseIds: state.collect.courseIds,
    timetableIds: state.timetable.courseIds,
    allCourses: state.database.courses
})

const mapDispatchToProps = (dispatch) => ({
    removeCourse: (courseId) => {
        dispatch(removeCollectCourse(courseId))
    },
    setTimetableVisible: (courseId, visible) => {
        dispatch(toggleCollectCourseVisible(courseId, visible))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CollectList))
