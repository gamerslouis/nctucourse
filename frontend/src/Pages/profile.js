import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Card, Container, Divider, TextField, Typography } from '@material-ui/core';
import GoogleButton from '../Components/GoogleButton'
import { connect } from 'react-redux'
import { setNickname } from '../Redux/Actions'
import { Check, Edit } from '@material-ui/icons';

const Nickname = withStyles(theme => ({
    iconBtn: {
        marginLeft: '8px',
        color: 'rgba(0, 0, 0, 0.6)',
        cursor: 'pointer',
        transform: 'scale(0.8)',
        '&:hover': {
            color: 'rgba(0, 0, 0, 0.85)'
        }
    }
}))(({ classes, nickname, setNickname }) => {
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
                    <>
                        <TextField variant="outlined" size="small" value={nick} onChange={evt => setNick(evt.target.value)}
                            onKeyDown={evt => {
                                if (evt.key === 'Enter')
                                    save()
                            }} />
                        <Check className={classes.iconBtn} onClick={save} />
                    </>
                    :
                    <>
                        <Typography style={{ width: 'fit-content' }}>{nick}</Typography>
                        <Edit className={classes.iconBtn} onClick={() => setEditing(true)} />
                    </>
            }
        </>
    )
})

class Profile extends React.PureComponent {
    render() {
        const { user, setNick } = this.props
        console.log(user)
        return (
            <Container>
                <Card style={{ padding: 20 }}>
                    <Typography variant="h4" align="center">使用者資料</Typography>
                    <div style={{ display: 'flex', flexDirection: 'row', marginTop: '12px', justifyContent: 'center' }}>
                        <div style={{ padding: "10px 20px", height: '80px', width: '50%' }}>
                            <Typography style={{ height: '28px' }}>學號：&nbsp;&nbsp;&nbsp;&nbsp;{user.username}</Typography>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '40px' }}>
                                <Typography style={{ width: 'fit-content' }}>暱稱：&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
                                <Nickname nickname={user.nickname} setNickname={setNick} />
                            </div>
                        </div>
                        <Divider orientation='vertical' flexItem />
                        <div style={{ padding: "10px 20px", height: '80px', width: '50%' }}>
                            <Typography style={{ height: '28px' }}>Google 帳號：&nbsp;&nbsp;&nbsp;&nbsp;{user.social.length > 0 ? '已綁定' : '未綁定'}</Typography>
                            {
                                user.social.length > 0
                                    ? <Typography style={{ height: '40px', lineHeight: '40px', verticalAlign: 'center' }}>Google 信箱：&nbsp;&nbsp;&nbsp;&nbsp;{user.social[0].email}</Typography>
                                    : <GoogleButton>使用Google登入</GoogleButton>
                            }
                        </div>
                    </div>
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