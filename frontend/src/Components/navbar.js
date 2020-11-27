import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Hidden, Drawer, List, ListItem, Divider } from '@material-ui/core';
import logo256 from '../Resources/logo256.png'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        [theme.breakpoints.up('md')]: {
            marginBottom: theme.spacing(2)
        }
    },
    logo: {
        height: 40,
        marginRight: theme.spacing(1)
    },
    toolbar: {
        alignItems: 'center',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        marginRight: theme.spacing(2),
    },
    grow: {
        flexGrow: 1,
    },
    listContainer: {
        width: 200
    },
}));

const Navbar = (props) => {
    const classes = useStyles();
    const { user } = props
    const [show, setShow] = useState(false)
    return (
        <div className={classes.root}>
            <Hidden smDown>
                <AppBar position="static">
                    <Toolbar className={classes.toolbar}>
                        <img src={logo256} className={classes.logo} />
                        <Typography variant="h6" className={classes.title}>
                            交大課程助理
                        </Typography>
                        <Button color="inherit" href="/course">模擬排課</Button>
                        <Button color="inherit" href="/gpa">GPA計算機</Button>
                        <Button color="inherit" href="/history">歷年課程</Button>
                        <div className={classes.grow} />
                        <Typography variant="body2">
                            Hi, {user.username}.
                    </Typography>
                        <Button color="inherit" href="/api/accounts/logout">Logout</Button>
                    </Toolbar>
                </AppBar>
            </Hidden>
            <Hidden mdUp>
                <AppBar position="static">
                    <Toolbar className={classes.toolbar}>
                        <img src={logo256} className={classes.logo} />
                        <Typography variant="h6" className={classes.title}>
                            交大課程助理
                        </Typography>
                        <div className={classes.grow} />
                        <IconButton edge="start" className={classes.menuButton} color="inherit"
                            onClick={() => setShow(true)}>
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer open={show} anchor={"right"} onClose={() => setShow(false)}>
                    <div className={classes.listContainer}>
                        <List>
                            <ListItem>
                                <Typography variant="body2">
                                    Hi, {user.username}.
                                </Typography>
                            </ListItem>
                            <Divider />
                            <ListItem button onClick={() => window.location.href = "/course"}>模擬排課</ListItem>
                            <ListItem button onClick={() => window.location.href = "/gpa"} > GPA計算機</ListItem>
                            <ListItem button onClick={() => window.location.href = "/history"} > 歷年課程</ListItem>
                            <ListItem button onClick={() => window.location.href = "/api/accounts/logout"} > Logout</ListItem>
                        </List>
                    </div>
                </Drawer>
            </Hidden>
        </div>
    );
}

const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps)(Navbar)