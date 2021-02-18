import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Divider, Hidden } from '@material-ui/core';
import Board from '../Components/BulletinBoard'
import GoogleLogo from '../Components/GoogleLogo'
import { useState } from 'react';
import { connect } from 'react-redux'
import { FETCH_STATUS } from '../Redux/Actions'
import { withSnackbar } from 'notistack';


const styles = (theme) => ({
    root: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'max-content',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    button: {
        width: '174px',
        height: '40px',
        marginTop: theme.spacing(2)
    },
    mdRoot: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        columnGap: `${theme.spacing(6)}px`
    },
    mdCont: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    mdTitle: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        columnGap: `${theme.spacing(1)}px`,
        userSelect: 'none'
    },
    loginout: {
        display: 'flex',
        flexDirection: 'row',
        margin: '20px auto',
        width: 'fit-content',
        columnGap: `${theme.spacing(2)}px`
    },
    lgRoot: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    lgTitle: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        columnGap: `${theme.spacing(1)}px`,
        userSelect: 'none',
        marginTop: 'calc(25vh - 32px)',
        marginBottom: '10px',
        flexShrink: 0
    }
})

const GoogleButton = withStyles((theme) => ({
    root: {
        fontFamily: "'Roboto', 'Noto Sans TC', sans-serif",
        fontSize: '14px !important',
        color: 'white',
        backgroundColor: '#4285f4',
        '&:hover': {
            backgroundColor: '#3367d6'
        }
    }
}))((props) => {
    const [hover, setHover] = useState(false)
    return (
        <Button startIcon={<GoogleLogo pressed={hover} />} {...props} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} />
    )
});

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: false
        }
    }

    componentDidMount() {
        if (new URLSearchParams(window.location.search).get('info') === '1') {
            this.props.enqueueSnackbar("請先登入以使用該功能",
                { variant: 'info' }
            )
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user.status !== FETCH_STATUS.SUCCESS &&
            this.props.user.status === FETCH_STATUS.SUCCESS) {
            if (new URLSearchParams(window.location.search).get('login') === '1' &&
                this.props.user.is_anonymous === true
            ) {
                const message = "Google 登入僅供已啟用會員使用，請先以交大單一入口登入後，至會員頁綁定 Google 帳號。"
                this.props.enqueueSnackbar(message, {
                    variant: 'info',
                    persist: true,
                });
            }
        }
    }

    render() {
        const { classes, user } = this.props
        const logged = user.status === FETCH_STATUS.SUCCESS && user.is_anonymous === false
        return (
            <>
                <Hidden mdDown>
                    <div className={classes.root}>
                        <div className={classes.mdRoot}>
                            <div className={classes.mdCont}>
                                <div className={classes.mdTitle}>
                                    <img src='/logo256.png' alt='logo' width='192px' />
                                    <Typography variant="h3">交大課程助理</Typography>
                                </div>
                            </div>
                            <div className={classes.mdCont}>
                                <Board />
                                {
                                    !logged &&
                                    <div style={{ alignItems: 'center', width: 'fit-content', marginTop: '-15px' }}>
                                        <Typography variant='h5' style={{ width: 'fit-content', margin: '0 auto', padding: '0px 8px', transform: 'translate(0px, 21px)', background: '#fafafa' }}>Login</Typography>
                                        <Divider style={{ background: '#999999', margin: '8px 0px' }} />
                                        <div className={classes.loginout}>
                                            <Button variant="contained" color="primary"
                                                className={classes.button} href="/api/accounts/login?mobile=false">NCTU&nbsp;OAuth</Button>
                                            {/* <GoogleButton variant="contained" color="primary"
                                                href="/api/login/google-oauth2"
                                                className={classes.button}
                                                style={{
                                                    padding: '0px 1px',
                                                    justifyContent: 'start',
                                                    overflow: 'hidden'
                                                }}>
                                                <span style={{ margin: '2px 0px 0px' }}>使用Google登入</span>
                                            </GoogleButton> */}
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </Hidden>
                <Hidden lgUp>
                    <div className={classes.lgRoot}>
                        <div className={classes.lgTitle}>
                            <img src='/logo256.png' alt='logo' width='72px' />
                            <Typography variant="h4">
                                交大課程助理
                        </Typography>
                        </div>
                        <div style={{ flexShrink: 0 }}>
                            {
                                !logged &&
                                <div style={{ alignItems: 'center', width: '80vw', marginTop: '-15px' }}>
                                    <Typography variant='subtitle1' style={{ width: 'fit-content', margin: '0 auto', padding: '0px 8px', transform: 'translate(0px, 18px)', background: '#fafafa' }}>Login</Typography>
                                    <Divider style={{ background: '#999999', margin: '4px 0px' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Button variant="contained" color="primary"
                                            className={classes.button} href="/api/accounts/login?mobile=true">NCTU&nbsp;OAuth</Button>
                                        {/* <GoogleButton variant="contained" color="primary"
                                            href="/api/login/google-oauth2"
                                            className={classes.button}
                                            style={{
                                                padding: '0px 1px',
                                                justifyContent: 'start',
                                                overflow: 'hidden'
                                            }}>
                                            <span style={{ margin: '2px 0px 0px' }}>使用Google登入</span>
                                        </GoogleButton> */}
                                        <Button variant="outlined" style={{ marginTop: '20px' }} onClick={evt => this.setState({ mobile: !this.state.mobile })}>{this.state.mobile ? '隱藏' : '顯示'}公告欄</Button>
                                    </div>
                                </div>
                            }
                        </div>
                        {
                            (logged || this.state.mobile) &&
                            <Board mobile />
                        }
                    </div>
                </Hidden>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user
})

export default withSnackbar(connect(mapStateToProps)(withStyles(styles)(Login)))