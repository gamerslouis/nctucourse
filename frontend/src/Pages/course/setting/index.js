import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import SubjectIcon from '@material-ui/icons/Subject';
import SportsBaseballIcon from '@material-ui/icons/SportsBaseball';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';
import GetAppIcon from '@material-ui/icons/GetApp';
import Fab from '@material-ui/core/Fab';
import Switch from '@material-ui/core/Switch';
import html2canvas from 'html2canvas';
import { actions, clearAllUserCourse, saveImage, updateSetting, loadSavedSettings } from '../../../Redux/Actions/index'

const styles = theme => ({
    fab: {
        position: 'absolute',
        bottom: 70,
        right: theme.spacing(2),
    },
    listContainer: {
        width: 250
    }
})

class Setting extends React.Component {
    constructor(porps) {
        super(porps)
        this.state = { show: false }
    }

    componentDidMount() {
        this.props.loadSavedSettings()
    }

    render() {
        const { classes, ignoreFreshEnglish, ignoreFreshPhysical, extendTimetable, showWeekend,
            storeTimetable, storeQuery, hideTimetableOverflowText, clearCourse, mobile, saveImage, updateSetting } = this.props
        const { show } = this.state

        const SettingList = () => (
            <div className={classes.listContainer}>
                <List subheader={<ListSubheader>Settings</ListSubheader>}>
                    <ListItem>
                        <ListItemIcon>
                            <SportsBaseballIcon />
                        </ListItemIcon>
                        <ListItemText primary="隱藏大一體育" />
                        <ListItemSecondaryAction>
                            <Switch
                                edge="end"
                                onChange={(event, value) => updateSetting('ignoreFreshPhysical', value)}
                                checked={ignoreFreshPhysical}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <SubjectIcon />
                        </ListItemIcon>
                        <ListItemText primary="隱藏大一英文" />
                        <ListItemSecondaryAction>
                            <Switch
                                edge="end"
                                onChange={(event, value) => updateSetting('ignoreFreshEnglish', value)}
                                checked={ignoreFreshEnglish}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <DateRangeIcon />
                        </ListItemIcon>
                        <ListItemText primary="顯示周末" />
                        <ListItemSecondaryAction>
                            <Switch
                                edge="end"
                                onChange={(event, value) => updateSetting('showWeekend', value)}
                                checked={showWeekend}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ViewDayIcon />
                        </ListItemIcon>
                        <ListItemText primary="擴展課表" />
                        <ListItemSecondaryAction>
                            <Switch
                                edge="end"
                                onChange={(event, value) => updateSetting('extendTimetable', value)}
                                checked={extendTimetable}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                    {!mobile &&
                        <ListItem>
                            <ListItemIcon>
                                <ViewDayIcon />
                            </ListItemIcon>
                            <ListItemText primary="隱藏超出文字" />
                            <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    onChange={(event, value) => updateSetting('hideOverflowText', value)}
                                    checked={hideTimetableOverflowText}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>}
                    <Divider />
                    <ListItem button onClick={() => { if (window.confirm('是否確定清除所有課表和收藏課程')) clearCourse() }}>
                        <ListItemIcon>
                            <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText id="switch-list-label-wifi" primary="清除所有課程" />
                    </ListItem>
                    <ListItem button onClick={() => {
                        let temp = hideTimetableOverflowText
                        storeTimetable({ hideOverflowText: false })
                        setTimeout(() => {
                            html2canvas(document.getElementById('timetable')).then(canvas => {
                                let a = document.createElement('a');
                                a.href = canvas.toDataURL("image/png");
                                a.download = '課表.png';
                                a.click();
                            }).then(() => storeTimetable({ hideOverflowText: temp }))

                        }, 500)
                    }}>
                        <ListItemIcon>
                            <GetAppIcon />
                        </ListItemIcon>
                        <ListItemText id="switch-list-label-wifi" primary="匯出課表" />
                    </ListItem>
                </List>
            </div>
        )
        if (mobile) {
            return (
                <SettingList />
            )
        }
        else {
            return (
                <React.Fragment>
                    <Fab aria-label="add" size="small" color="secondary"
                        className={classes.fab} onClick={() => this.setState({ show: true })}>
                        <SettingsIcon />
                    </Fab>
                    <SwipeableDrawer
                        anchor="right"
                        open={show}
                        onClose={() => this.setState({ show: false })}
                        onOpen={() => this.setState({ show: true })}
                    >
                        <SettingList />
                    </SwipeableDrawer>
                </React.Fragment>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    ignoreFreshPhysical: state.settings.ignoreFreshPhysical,
    ignoreFreshEnglish: state.settings.ignoreFreshEnglish,
    extendTimetable: state.settings.extendTimetable,
    showWeekend: state.settings.showWeekend,
    hideTimetableOverflowText: state.settings.hideOverflowText
})

const mapDispatchToProps = (dispatch) => ({
    storeTimetable: value => dispatch(actions.timetable.store(value)),
    storeQuery: value => dispatch(actions.query.store(value)),
    clearCourse: () => dispatch(clearAllUserCourse()),
    updateSetting: (key, value) => dispatch(updateSetting(key, value)),
    loadSavedSettings: () => dispatch(loadSavedSettings())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Setting))

