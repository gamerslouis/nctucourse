import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Hidden, Drawer, List, ListItem, Divider, ButtonBase, Menu, MenuItem, withStyles, Avatar } from '@material-ui/core';
import logo256 from '../Resources/logo256.png'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { KeyboardArrowDown } from '@material-ui/icons';
import { api_url } from '../Util/dev';

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

const NavMenuDropdown = withStyles(theme => ({
    paper: {
        borderTopLeftRadius: '0px',
        borderTopRightRadius: '0px'
    }
}))(Menu)

const NavMenu = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const { text, children } = props
    return (
        <>
            <Button
                color="inherit"
                aria-haspopup="true"
                onClick={handleClick}
            >
                {text}
                <KeyboardArrowDownIcon fontSize="small" />
            </Button>

            <NavMenuDropdown
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
            </NavMenuDropdown>
        </>
    )
}

const NavMenuItem = (props) => (
    <MenuItem
        style={{ fontSize: 14 }}
        onClick={() => {
            if (props.blank) {
                window.open(props.href).opener = null
            } else {
                window.location.href = props.href
            }
        }}
        onAuxClick={() => {
            window.open(props.href).opener = null
        }}
        {...props}
    />
)

const NavProfile = withStyles(theme => ({
    navBtn: {
        paddingLeft: '12px',
        color: 'white'
    }
}))(({ classes, username, nickname }) => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    return (
        <>
            <Button className={classes.navBtn} onClick={evt => setAnchorEl(evt.currentTarget)}>
                <Avatar style={{ width: '32px', height: '32px' }} />
                <Typography style={{ fontSize: '16px', lineHeight: '16px', marginLeft: '8px' }}>
                    {nickname === '' ? username : nickname}
                </Typography>
                <KeyboardArrowDown />
            </Button>
            <NavMenuDropdown
                MenuListProps={{
                    style: { backgroundColor: "#3f51b5", color: "white" }
                }}
                elevation={0}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={evt => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <NavMenuItem href="/profile">關於我</NavMenuItem>
                <NavMenuItem href={api_url("/api/accounts/logout")}>Logout</NavMenuItem>
            </NavMenuDropdown>
        </>
    )
})

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
                        <NavMenu text="模擬排課">
                            <NavMenuItem href="/simulation">當期排課</NavMenuItem>
                            <NavMenuItem href="/simulation/history">歷年課程</NavMenuItem>
                            <NavMenuItem href="/simulation/export">課表匯出</NavMenuItem>
                        </NavMenu>
                        <NavMenu text="學分工具">
                            <NavMenuItem color="inherit" href="/coursehistory">修課記錄</NavMenuItem>
                            <NavMenuItem color="inherit" href="/gpa">GPA計算機</NavMenuItem>
                            <NavMenuItem color="inherit" href="/simulator">學分模擬器</NavMenuItem>
                        </NavMenu>
                        <NavMenu text="外部連結">
                            <NavMenuItem blank href="https://timetable.nycu.edu.tw/">課程時間表</NavMenuItem>
                            <NavMenuItem blank href="https://course.nycu.edu.tw/">選課系統</NavMenuItem>
                        </NavMenu>
                        <Button color="inherit" href="/tutorial">使用介紹</Button>
                        <div className={classes.grow} />
                        {
                            user.is_anonymous
                                ?
                                <>
                                    {
                                        window.location.pathname !== '/' && <Button color="inherit" href="/">Login</Button>
                                    }
                                </>
                                : <NavProfile username={user.username} nickname={user.nickname} />
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
                        {
                            user.is_anonymous
                                ?
                                <>
                                    {
                                        window.location.pathname !== '/' &&
                                        <>
                                            <List>
                                                <ListItem button onClick={() => window.location.href = "/"}>Login</ListItem>
                                            </List>
                                            <Divider />
                                        </>
                                    }
                                </>
                                :
                                <>
                                    <List>
                                        <ListItem button disabled>
                                            <Avatar style={{ width: '28px', height: '28px', marginRight: '6px' }} />
                                            {user.nickname === '' ? user.username : user.nickname}
                                        </ListItem>
                                        <ListItem button onClick={() => window.location.href = "/profile"}>關於我</ListItem>
                                        <ListItem button onClick={() => window.location.href = api_url("/api/accounts/logout")}>Logout</ListItem>
                                    </List>
                                    <Divider />
                                </>
                        }
                        <List>
                            <ListItem disabled >模擬排課</ListItem>
                            <ListItem button onClick={() => window.location.href = "/simulation"}>當期排課</ListItem>
                            <ListItem button onClick={() => window.location.href = "/simulation/history"}>歷年課程</ListItem>
                            <ListItem button onClick={() => window.location.href = "/simulation/export"}>課表匯出</ListItem>
                        </List>
                        <Divider />
                        <List>
                            <ListItem disabled >學分工具</ListItem>
                            <ListItem button onClick={() => window.location.href = "/coursehistory"}>修課記錄</ListItem>
                            <ListItem button onClick={() => window.location.href = "/gpa"}>GPA計算機</ListItem>
                            <ListItem button onClick={() => window.location.href = "/simulator"}>學分模擬器</ListItem>
                        </List>
                        <Divider />
                        <List>
                            <ListItem disabled >外部連結</ListItem>
                            <ListItem button onClick={() => window.location.href = "https://timetable.nycu.edu.tw/"}>交大課程時間表</ListItem>
                            <ListItem button onClick={() => window.location.href = "https://course.nycu.edu.tw/"}>交大選課系統</ListItem>
                        </List>
                        <Divider />
                        <List>
                            <ListItem button onClick={() => window.location.href = "/tutorial"}>使用介紹</ListItem>
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