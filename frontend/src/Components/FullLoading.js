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
        opacity: 0.3,
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

class FullLoading extends React.Component {
    constructor(props){
        super(props)
        this.timerId = null;
        this.state = {
            showLoader: false
        }
    }

    componentDidMount() {
        this.ensureTimer(this.props);
    }

    componentWillUnmount() {
        this.destroyTimer();
    }

    componentWillReceiveProps(props) {
        if (props.show !== this.props.show) {
          this.ensureTimer(props);
        }
    }

    ensureTimer(props){
        if(props.show){
            if(this.timerId == null){
                this.timerId = setTimeout(()=>{
                    this.timerId = null;
                    this.setState({showLoader: true});
                }, 700)
            }
        }
        else {
            this.destroyTimer()
        }
    }

    destroyTimer() {
        clearTimeout(this.timerId)
        this.timerId = null
        this.setState({showLoader: false})
    }


    render(){
        const { classes } = this.props
        const { showLoader } = this.state
        return (
            <div className={classes.root + (showLoader ? '' : ' ' + classes.hidden)}>
                <div className={classes.progress}>
                    <CircularProgress />
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(FullLoading)