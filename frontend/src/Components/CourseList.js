import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    }
}));

export default function CourseList(props) {
    const classes = useStyles();
    const { courseListItems } = props
    // let items = courseListItems
    let items = [[], ...courseListItems].reduce((a, c, i) =>
        a.concat(<Divider variant="fullWidth" component="li" key={100000 + i} />, c)
    ).slice(1)
    return (
        <List className={classes.root} dense>
            {items}
        </List>
    );
}