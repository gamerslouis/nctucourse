import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Card, Container, Divider, Hidden, TextField, Typography, Button } from '@material-ui/core';
import GoogleButton from '../Components/GoogleButton'
import { connect } from 'react-redux'
import { setNickname } from '../Redux/Actions'
import { Check, Edit } from '@material-ui/icons';
import axios from 'axios'
import { api_url } from '../Util/dev';

const Nickname = withStyles(theme => ({
    root: {
        display: 'inline-flex',
        alignItems: 'center'
    },
    iconBtn: {
        marginLeft: '8px',
        color: 'rgba(0, 0, 0, 0.6)',
        cursor: 'pointer',
        transform: 'scale(0.8)',
        '&:hover': {
            color: 'rgba(0, 0, 0, 0.85)'
        }
    }
}))(({ classes, nickname, setNickname, ...otherProps }) => {
    const [editing, setEditing] = React.useState(false)
    const [nick, setNick] = React.useState(nickname)
    React.useEffect(() => {
        setNick(nickname)
    }, [nickname])
    const save = () => {
        setEditing(false)
        setNickname(nick)
    }
    return (
        <>
            {
                editing
                    ?
                    <div className={classes.root} {...otherProps}>
                        <TextField variant="outlined" size="small" value={nick} onChange={evt => setNick(evt.target.value)}
                            onKeyDown={evt => {
                                if (evt.key === 'Enter')
                                    save()
                            }} />
                        <Check className={classes.iconBtn} onClick={save} />
                    </div>
                    :
                    <div className={classes.root} {...otherProps}>
                        <Typography style={{ width: 'fit-content' }}>{nick}</Typography>
                        <Edit className={classes.iconBtn} onClick={() => setEditing(true)} />
                    </div>
            }
        </>
    )
})

const disconnect = (id) => {
    if (window.confirm("確定解除綁定?")) {
        axios.post(`/api/disconnect/google-oauth2/${id}/`).finally(() => window.location.reload())
    }
}

class Profile extends React.PureComponent {
    render() {
        const { user, setNick } = this.props
        console.log(user)
        return (
            <Container>
                <Card style={{ padding: 20, marginTop: '12px' }}>
                    <Typography variant="h5" align="center">使用者資料</Typography>
                    <Hidden mdUp>
                        <div style={{ padding: "10px 20px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h6" align="center">學號</Typography>
                            <Typography style={{ height: '28px' }} align="center">{user.username}</Typography>
                            <Typography variant="h6" align="center">暱稱</Typography>
                            <Nickname nickname={user.nickname} setNickname={setNick} />
                        </div>
                        <Divider />
                        <div style={{ padding: "10px 20px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h6" align="center">Google 帳號</Typography>
                            <Typography style={{ height: '28px' }} align="center">{user.social.length > 0 ? '已綁定' : '未綁定'}</Typography>
                            {
                                user.social.length > 0
                                    ? <>
                                        <Typography style={{ height: '28px' }} align="center">{user.social[0].uid}</Typography>
                                        <Button onClick={() => disconnect(user.social[0].id)} variant="contained">解除綁定</Button>
                                    </>
                                    : <GoogleButton href={api_url("/api/login/google-oauth2")}>綁定Google帳號</GoogleButton>
                            }
                        </div>
                    </Hidden>
                    <Hidden smDown>
                        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '18px', marginBottom: '6px', justifyContent: 'center' }}>
                            <div style={{ padding: "10px 20px", height: '80px', width: '50%' }}>
                                <Typography style={{ height: '28px' }}>學號：&nbsp;&nbsp;&nbsp;&nbsp;{user.username}</Typography>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '40px' }}>
                                    <Typography style={{ width: 'fit-content' }}>暱稱：&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
                                    <Nickname nickname={user.nickname} setNickname={setNick} />
                                </div>
                            </div>
                            <Divider orientation='vertical' flexItem />
                            <div style={{ padding: "10px 20px", height: '100px', width: '50%' }}>
                                <Typography style={{ height: '28px' }}>Google 帳號：&nbsp;&nbsp;&nbsp;&nbsp;{user.social.length > 0 ? '已綁定' : '未綁定'}</Typography>
                                {
                                    user.social.length > 0
                                        ? <>
                                            <Typography style={{ height: '40px', lineHeight: '40px', verticalAlign: 'center' }}>Google 信箱：&nbsp;&nbsp;&nbsp;&nbsp;{user.social[0].uid}</Typography>
                                            <Button onClick={() => disconnect(user.social[0].id)} variant="contained">解除綁定</Button>
                                        </>
                                        : <GoogleButton href={api_url("/api/login/google-oauth2")}>綁定Google帳號</GoogleButton>
                                }
                            </div>
                        </div>
                    </Hidden>
                </Card>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapDispatchToProps = (dispatch) => ({
    setNick: nick => dispatch(setNickname(nick))
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)