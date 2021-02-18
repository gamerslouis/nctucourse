import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Hidden, Drawer, List, ListItem, Divider, ButtonBase, Menu, MenuItem } from '@material-ui/core';
import logo256 from '../Resources/logo256.png'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

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

const NavMenu = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const { text, children } = props
    return (<>
        <Button
            color="inherit"
            aria-haspopup="true"
            onClick={handleClick}
        >
            {text}
            <KeyboardArrowDownIcon fontSize="small" />
        </Button>

        <Menu
            MenuListProps={{
                style: { backgroundColor: "#3f51b5", color: "white" }
            }}
            elevation={0}
            getContentAnchorEl={null}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            {children}
        </Menu>
    </>)
}

const NavMemuItem = (props) => (
    <MenuItem
        style={{ fontSize: 14 }}
        onClick={() => {
            if (props.blank) {
                window.open(props.href);
            } else {
                window.location.href = props.href
            }
        }}
        {...props} />
)

const Navbar = (props) => {
    const classes = useStyles();
    const { user } = props
    const [show, setShow] = useState(false)
    return (
        <div className={classes.root}>
            <Hidden smDown>
                <AppBar position="static">
                    <Toolbar className={classes.toolbar}>
                        <ButtonBase href="/">
                            <img src={logo256} className={classes.logo} alt="" />
                            <Typography variant="h6" className={classes.title}>
                                交大課程助理
                            </Typography>
                        </ButtonBase>
                        <Button color="inherit" href="/">首頁</Button>
                        <NavMenu text="模擬排課">
                            <NavMemuItem href="/simulation">當期排課</NavMemuItem>
                            <NavMemuItem href="/simulation/history">歷年課程</NavMemuItem>
                        </NavMenu>
                        <Button color="inherit" href="/gpa">GPA計算機</Button>
                        <NavMenu text="全校課程">
                            <NavMemuItem href="/courses">全校課程</NavMemuItem>
                            <NavMemuItem href="/feedbacks">心得</NavMemuItem>
                        </NavMenu>
                        <NavMenu text="外部連結">
                            <NavMemuItem blank href="https://timetable.nycu.edu.tw/">課程時間表</NavMemuItem>
                            <NavMemuItem blank href="https://course.nycu.edu.tw/">選課系統</NavMemuItem>
                        </NavMenu>
                        <div className={classes.grow} />
                        {
                            user.is_anonymous ? (
                                <Button color="inherit" href="/">Login</Button>
                            ) : (<>
                                <Typography variant="body2">
                                    Hi, {user.username}.
                                </Typography>
                                <Button color="inherit" href="/api/accounts/logout">Logout</Button>
                            </>)
                        }


                    </Toolbar>
                </AppBar>
            </Hidden>
            <Hidden mdUp>
                <AppBar position="static">
                    <Toolbar className={classes.toolbar}>
                        <img src={logo256} className={classes.logo} alt="" />
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
                            {
                                !user.is_anonymous && <>
                                    <ListItem>
                                        <Typography variant="body2">
                                            Hi, {user.username}.
                                        </Typography>
                                    </ListItem>
                                    <Divider />
                                </>

                            }
                            <ListItem button onClick={() => window.location.href = "/"}>首頁</ListItem>
                            <ListItem button onClick={() => window.location.href = "/gpa"} > GPA計算機</ListItem>
                        </List>
                        <Divider />
                        <List>
                            <ListItem disabled >模擬排課</ListItem>
                            <ListItem button onClick={() => window.location.href = "/simulation"} > 當期排課</ListItem>
                            <ListItem button onClick={() => window.location.href = "/simulation/history"} > 歷年課程</ListItem>
                        </List>
                        <Divider />
                        <List>
                            <ListItem button onClick={() => window.location.href = "/courses"} > 全校課程</ListItem>
                            <ListItem button onClick={() => window.location.href = "/feedbacks"} > 心得</ListItem>
                        </List>
                        <Divider />
                        <List>
                            <ListItem disabled >外部連結</ListItem>
                            <ListItem button onClick={() => window.location.href = "https://timetable.nctu.edu.tw/"} > 交大課程時間表</ListItem>
                            <ListItem button onClick={() => window.location.href = "https://course.nctu.edu.tw/"} > 交大選課系統</ListItem>
                        </List>
                        <Divider />
                        <List>
                            {
                                user.is_anonymous ? (
                                    <ListItem button onClick={() => window.location.href = "/"} > Login</ListItem>
                                ) : (
                                        <ListItem button onClick={() => window.location.href = "/api/accounts/logout"} > Logout</ListItem>
                                    )
                            }
                        </List>
                    </div>
                </Drawer>
            </Hidden>
        </div >
    );
}

const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps)(Navbar)