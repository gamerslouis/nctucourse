import React from 'react';
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import GradeIcon from '@material-ui/icons/Grade';
import { makeInfoPageUrl, origin_time_key_to_new } from '../Util/dataUtil/course'
import { CourseTypeColorMap } from '../Util/style'


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    subtext: {
        float: 'right',
        display: 'inline-flex',
        alignItems: 'center'
    },
    twoAction: {
        paddingRight: 96
    },
    cardRoot: {
        marginRight: theme.spacing(1),
        marginBottom: 1
    }
}));

function begdeLebalPipe(key, course, briefMap) {
    let label = briefMap[key][1]
    if(key === 'A504' && course['meta'] !== undefined && course['meta']['geci'] !== undefined) {
        return [key, `[${course['meta']['geci']}]${label}`]
    }
    return [key, label]
}

const CourseListItem = (props) => {
    const classes = useStyles();
    const { course, onClick, actions, multiAction } = props
    const newTimeCode = useSelector(state => state.courseSim.settings.newTimeCode)
    const begdeClasses = ['#ff7675', '#ffeaa7', '#55efc4', '#74b9ff'] // palette/cn
    const briefMap = {
        'A501': [1, '核心(人文)'],
        'A502': [1, '核心(社會)'],
        'A503': [1, '核心(自然)'],
        'A504': [2, '跨院'],
        'A505': [3, '校基本'],
    }
    let realOnClick
    if (!onClick) realOnClick = (courseId) => { window.open(makeInfoPageUrl(courseId)) }
    else { realOnClick = onClick }
    return (<ListItem dense button onClick={e => realOnClick(course.cos_id)}
        className={multiAction === 2 ? classes.twoAction : multiAction === 3 ? classes.threeAction : undefined}
    >
        <ListItemText
            primary={
                <React.Fragment>
                    <div>
                        <Typography display='inline'>{course.cos_cname}</Typography>
                        <Typography variant='body2' display='inline'> {course.teacher}</Typography>
                    </div>
                    <div>
                        <div className={classes.subtext}>
                            <Typography variant='body2' display='inline'>{course.cos_id.split('_')[1]}|</Typography>
                            <Typography variant='body2' display='inline'>{
                            newTimeCode ? origin_time_key_to_new(course.cos_time) : course.cos_time
                            }|</Typography>
                            <GradeIcon fontSize="small" />
                            <Typography>{Number(course.cos_credit)}</Typography>
                        </div>
                        <Chip className={classes.cardRoot} size="small" label={course.cos_type}
                            style={{ backgroundColor: CourseTypeColorMap[course.cos_type] }} />
                        {Object.keys(briefMap)
                            .filter(key => course.brief_code.indexOf(key) !== -1)
                            .map(key => begdeLebalPipe(key, course, briefMap))
                            .map(([key, realLabel]) => <Chip key={key} className={classes.cardRoot} size="small" label={realLabel}
                                style={{ backgroundColor: begdeClasses[briefMap[key][0]] }} />)}
                        {course.lang === "1" && <Chip className={classes.cardRoot} size="small" label="英文授課"
                            style={{ backgroundColor: begdeClasses[0] }} />}
                    </div>
                </React.Fragment>
            }
        />
        <ListItemSecondaryAction>
            {actions}
        </ListItemSecondaryAction>
    </ListItem>)
}

export default CourseListItem;