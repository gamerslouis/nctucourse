import React from 'react';
import { withStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    root: {
        transition: 'opacity 0.5s',
        overflow: 'hidden',
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#000000',
        opacity: 0.8,
        zIndex: 10000
    },
    hidden: {
        display: 'none',
        opacity: 0,
    },
    progress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }
})

const FullLoading = (props) => {
    const { classes, show } = props
    return (
        <div className={classes.root + (show ? '' : ' ' + classes.hidden)}>
            <div className={classes.progress}>
                <CircularProgress />
            </div>
        </div>
    )
}

export default withStyles(styles)(FullLoading)