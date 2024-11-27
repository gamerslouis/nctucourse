import React, { useCallback, useEffect, useState } from 'react';
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
import { getCoursesIdByDepId, getCoursesFromIds, campusCodeMap } from '../../../Util/dataUtil/course'
import CourseListItem from '../../../Components/CourseListItem'
import { addCollectCourse, removeCollectCourse, setSearchCourseList } from '../../../Redux/Actions/index'
import SearchBar from '../../../Components/SearchBar'
import PlaceIcon from '@material-ui/icons/Place';
import { Checkbox, FormGroup, Menu, Typography } from '@material-ui/core';

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
    },
    hint: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
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
                {Object.keys(cateMap).map((k) => (<option disabled={cateMap[k] === null} key={k} value={k}>{k}</option>))}
            </NativeSelect>
        </FormControl>
    )
}

function CampusFilterSelect({onFilterChange}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [filters, setFilters] = useState(new Set(Object.keys(campusCodeMap)));

  useEffect(() => {
    const defaults = JSON.stringify(Object.keys(campusCodeMap))
    if (
      window.localStorage &&
      window.localStorage.getItem("campus_filter") != null
    ) {
      try {
        setFilters(
          new Set(JSON.parse(window.localStorage.getItem("campus_filter")))
        );
      } catch {
        window.localStorage.setItem("campus_filter", defaults);
      }
    } else {
      window.localStorage.setItem("campus_filter", defaults);
    }
  }, []);
  const updateStorage = useCallback((set) => {
    window.localStorage.setItem("campus_filter", JSON.stringify([...set]));
  }, []);
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <>
      <IconButton onClick={handleClick}>
        <PlaceIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <FormGroup>
          {Object.keys(campusCodeMap).map((key, i) => (
            <FormControlLabel
              style={{ marginLeft: 5 }}
              key={i}
              name={key}
              control={
                <Checkbox
                  checked={filters.has(key)}
                  onChange={() => {
                    let newSet = null;
                    if (filters.has(key)) {
                      newSet = new Set([...filters].filter((x) => x !== key));
                    } else {
                      newSet = new Set([...filters, key]);
                    }
                    setFilters(newSet);
                    updateStorage(newSet);
                  }}
                />
              }
              label={`${campusCodeMap[key]} [${key}]`}
            />
          ))}
        </FormGroup>
      </Menu>
    </>
  );
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
            showCategorySearch: false,
            campusToIgnore: []
        }
        this.handleSelectChange = this.handleSelectChange.bind(this)
        this.handleCampusFilterChange = this.handleCampusFilterChange.bind(this)
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

    handleCampusFilterChange(newFilters) {
        this.setState({ campusToIgnore: Object.keys(campusCodeMap).filter(x=>!newFilters.has(x)) })
    }

    searchText() {
        if (this.state.searchText === '') return
        let regString = '^.*' + this.state.searchText.split('').reduce((s, v) => s + '.*' + v) + '.*$'
        this.props.setCourses(Object.values(this.props.allCourses).filter(course => (
            course.cos_cname.indexOf(this.state.searchText) !== -1 ||
            (course['meta'] !== undefined && course['meta']['cos_ename'] !== undefined &&
                course['meta']['cos_ename'].toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1) ||
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
                        <CampusFilterSelect onFilterChange={this.handleCampusFilterChange} />
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
                        .filter(course => !this.state.campusToIgnore.some(campus=>course.cos_time.indexOf(campus) !== -1))
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
                    <div className={classes.hint}>
                        <Typography variant="caption" color="textSecondary">
                            本系統課程資料來源於學校課程時間表網站，於每日凌晨五點更新，若查無課程代碼，可能是學校或系統尚未更新。
                            部分課程分類，如研究所-在職專班等未收入。
                        </Typography>
                    </div>
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
