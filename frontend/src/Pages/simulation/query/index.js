import React from 'react';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import CourseList from '../../../Components/CourseList'
import { getCoursesIdByDepId, getCoursesFromIds } from '../../../Util/dataUtil/course'
import CourseListItem from '../../../Components/CourseListItem'
import { addCollectCourse, removeCollectCourse, setSearchCourseList } from '../../../Redux/Actions/index'
import SearchBar from '../../../Components/SearchBar'


const styles = (theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
    },
    selectContainer: {
        alignItems: 'baseline',
        display: 'flex',
        flexWrap: 'wrap',
        padding: theme.spacing(2)
    },
    list: {
        [theme.breakpoints.up('lg')]: {
            flexGrow: 1,
            overflowY: 'scroll'
        }
    },
    inputContainerOut: {
        width: '100%',
        display: 'flex',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        display: 'flex',
        marginRight: 10
    }
});

function CategorySelect({ classes, cateMap, values, index, handleChange }) {
    return (
        <FormControl className={classes.formControl}>
            <NativeSelect
                className={classes.selectEmpty}
                value={values[index]}
                onChange={e => { handleChange(index, e.target.value, cateMap) }}
            >
                <option value="" disabled>
                    選擇
                </option>
                {Object.keys(cateMap).map((k) => (<option key={k} value={k}>{k}</option>))}
            </NativeSelect>
        </FormControl>
    )
}

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            depId: -1,
            selects: [""],
            enableSelectSearch: false,
            courseList: [],
            searchText: '',
            showCategorySearch: false
        }
        this.handleSelectChange = this.handleSelectChange.bind(this)
    }

    handleSelectChange(index, value, curCate) {
        let newarr = [...this.state.selects]
        let enableSelectSearch = false
        newarr[index] = value
        newarr = newarr.splice(0, index + 1)
        if (typeof (curCate[value]) == "number") { enableSelectSearch = true }
        else newarr = newarr.concat("")
        this.setState({ selects: newarr, enableSelectSearch, depId: curCate[value] })
    }

    searchText() {
        if (this.state.searchText === '') return
        let regString = '^.*' + this.state.searchText.split('').reduce((s, v) => s + '.*' + v) + '.*$'
        this.props.setCourses(Object.values(this.props.allCourses).filter(course => (
            course.cos_cname.indexOf(this.state.searchText) !== -1 ||
            course.teacher.indexOf(this.state.searchText) !== -1 ||
            course.cos_id.split('_')[1] === this.state.searchText ||
            (new RegExp(regString, "i")).test(course.cos_cname)
        )))
    }

    render() {
        const { classes, addCourse, allCourses, category, categoryMap,
            selectCourseIds, removeCourse } = this.props
        return (
            <div className={classes.root}>
                <div className={classes.selectContainer}>
                    <div className={classes.inputContainerOut}>
                        <SearchBar className={classes.input}
                            onChange={e => this.setState({ searchText: e.target.value })}
                            onSearch={() => this.searchText()}
                        />
                        <FormControlLabel
                            control={<Switch name="checkedA"
                                checked={this.state.showCategorySearch}
                                onChange={(event, value) => this.setState({ showCategorySearch: value })} />}
                            label="分類搜尋"
                        />
                    </div>
                    {this.state.showCategorySearch &&
                        <div style={{ marginTop: 5 }}>
                            {this.state.selects.map((value, index, arr) => {
                                let cateMap = [categoryMap, ...arr.slice(0, index)].reduce((prev, cur) => prev[cur])
                                return <CategorySelect
                                    classes={classes}
                                    cateMap={cateMap}
                                    values={this.state.selects}
                                    index={index}
                                    key={index}
                                    handleChange={this.handleSelectChange} />
                            })}
                            <FormControl className={classes.formControl}>
                                <Button variant="outlined" color="primary" disabled={!this.state.enableSelectSearch}
                                    onClick={() => this.props.setCourses(getCoursesFromIds(allCourses, getCoursesIdByDepId(category, this.state.depId)))}>
                                    搜尋
                        </Button>
                            </FormControl>
                        </div>
                    }
                </div>
                <div className={classes.list}>
                    <CourseList courseListItems={this.props.courseList
                        .filter(course => ((course.cos_cname.indexOf('大一英文') === -1) || (!this.props.queryOptions.ignoreFreshEnglish)))
                        .filter(course => ((course.cos_cname.indexOf('大一體育') === -1) || (!this.props.queryOptions.ignoreFreshPhysical)))
                        .map(ele =>
                            <CourseListItem
                                key={ele.cos_id}
                                course={ele}
                                actions={
                                    (selectCourseIds.has(ele.cos_id)) ?
                                        (
                                            < IconButton edge="end" onClick={() => removeCourse(ele.cos_id)}>
                                                <RemoveIcon />
                                            </IconButton>)
                                        : (
                                            < IconButton edge="end" onClick={() => addCourse(ele.cos_id)}>
                                                <AddIcon />
                                            </IconButton>
                                        )}
                            />)} />
                </div>
            </div >)
    }
}

const mapStateToProps = (state) => ({
    allCourses: state.courseSim.database.courses,
    category: state.courseSim.database.category,
    categoryMap: state.courseSim.database.categoryMap,
    selectCourseIds: state.courseSim.collect.courseIds,
    queryOptions: state.courseSim.settings,
    courseList: state.courseSim.query.courseSearchList,
})

const mapDispatchToProps = (dispatch) => ({
    addCourse: (courseId) => {
        dispatch(addCollectCourse(courseId, true))
    },
    removeCourse: (courseId) => {
        dispatch(removeCollectCourse(courseId))
    },
    setCourses: (courses) => {
        dispatch(setSearchCourseList(courses))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Index))
