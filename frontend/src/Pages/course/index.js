import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SearchIcon from '@material-ui/icons/Search';
import FavoriteIcon from '@material-ui/icons/Favorite';
import DateRangeIcon from '@material-ui/icons/DateRange';
import SettingsIcon from '@material-ui/icons/Settings';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import TimeTable from './timetable'
import CollectList from './collectList'
import QueryPage from './query'
import Setting from './setting'
import { fetchDatabase } from '../../Redux/Actions/index'

const styles = theme => ({
    root: {
        height: `calc( 100vh - 130px )`
    },
    gridout: {
        height: `100%`
    },
    grid: {
        height: `100%`
    },
    paper: {
        height: `100%`
    },
    switchView: {
        height: `calc( 100% - 48px )`,
        '& > div': {
            height: `100%`,
        }
    },
    switchTab: {
        height: `100%`,
    },
    mobileRoot: {
        minHeight: `calc( 100vh - 120px )`,
        paddingBottom: 70
    },
    nav: {
        position: 'fixed',
        bottom: 0,
        marginBottom: 50,
        width: '100vw'
    }
})

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {children}
        </div>
    );
}


function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabIndex: 0,
            selectCourses: {},
            mobileIndex: 0,
            mobileSetting: false
        }
        this.handleTabSwitch = this.handleTabSwitch.bind(this)
        this.handleTabIndexChange = this.handleTabIndexChange.bind(this)
    }

    componentDidMount() {
        this.props.fetchDatabase()
    }

    handleTabSwitch(event, newValue) {
        this.setState({ tabIndex: newValue })
    }
    handleTabIndexChange(index) {
        this.setState({ tabIndex: index })
    }

    render() {
        const { classes } = this.props
        const { tabIndex, mobileIndex, mobileSetting } = this.state
        return (
            <React.Fragment>
                <Hidden mdDown>
                    <Setting />
                    <Container maxWidth={false} className={classes.root}>
                        <Grid container spacing={2} className={classes.gridout}>
                            <Grid item xs={12} lg={4} className={classes.grid}>
                                <Paper className={classes.paper}>
                                    <Tabs
                                        value={tabIndex}
                                        textColor="primary"
                                        variant="fullWidth"
                                        onChange={this.handleTabSwitch}
                                    >
                                        <Tab label="搜尋" {...a11yProps(0)} />
                                        <Tab label="收藏" {...a11yProps(0)} />
                                    </Tabs>
                                    <SwipeableViews
                                        className={classes.switchView}
                                        index={tabIndex}
                                        onChangeIndex={this.handleTabIndexChange}
                                    >
                                        <TabPanel className={classes.switchTab} value={tabIndex} index={0}>
                                            <QueryPage />
                                        </TabPanel>
                                        <TabPanel className={classes.switchTab} value={tabIndex} index={1}>
                                            <CollectList />
                                        </TabPanel>
                                    </SwipeableViews>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} lg={8} className={classes.grid}>
                                <Paper className={classes.paper}>
                                    <TimeTable />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Hidden>
                <Hidden lgUp>
                    <div className={classes.mobileRoot} style={{ backgroundColor: 'white' }}>
                        <Hidden xlDown={mobileIndex != 0}><QueryPage /></Hidden>
                        <Hidden xlDown={mobileIndex != 1}><CollectList /></Hidden>
                        <Hidden xlDown={mobileIndex != 2}><TimeTable /></Hidden>
                        <BottomNavigation
                            value={mobileIndex}
                            onChange={(event, newValue) => {
                                if (newValue != 3)
                                    this.setState({ mobileIndex: newValue })
                            }}
                            showLabels
                            className={classes.nav}
                        >
                            <BottomNavigationAction label="搜尋" icon={<SearchIcon />} />
                            <BottomNavigationAction label="收藏" icon={<FavoriteIcon />} />
                            <BottomNavigationAction label="課表" icon={<DateRangeIcon />} />
                            <BottomNavigationAction label="設定" icon={<SettingsIcon />} onClick={() => this.setState({ mobileSetting: true })} />
                        </BottomNavigation>
                        <SwipeableDrawer
                            anchor="right"
                            open={mobileSetting}
                            onClose={() => this.setState({ mobileSetting: false })}
                            onOpen={() => this.setState({ mobileSetting: true })}
                        >
                            <Setting mobile />
                        </SwipeableDrawer>
                    </div>
                </Hidden>
            </React.Fragment >
        )
    }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
    fetchDatabase: () => dispatch(fetchDatabase())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Index))