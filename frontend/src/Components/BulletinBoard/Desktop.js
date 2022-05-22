import { Button, createMuiTheme, Typography, withStyles, ThemeProvider, LinearProgress } from '@material-ui/core';
import { blue, green, orange, red } from '@material-ui/core/colors';
import React from 'react'
import { Post } from '.'

const TYPE_THEME = [
    createMuiTheme({
        palette: {
            primary: blue
        }
    }),
    createMuiTheme({
        palette: {
            primary: orange,
            contrastThreshold: 1
        }
    }),
    createMuiTheme({
        palette: {
            primary: red
        }
    }),
    createMuiTheme({
        palette: {
            primary: green,
            contrastThreshold: 1
        }
    })
]

const style = theme => ({
    title: {
        transform: 'translate(20px, 12px)',
        background: '#fafafa',
        padding: '0px 6px',
        width: 'fit-content'
    },
    board: {
        width: '60vh',
        height: '50vh',
        border: '1px solid #666666',
        borderRadius: '1rem',
        marginBottom: `${theme.spacing(3)}px`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    setting: {
        width: '100%',
        padding: '8px 12px ',
        borderTop: '1px solid #666666',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        boxShadow: '0px -6px 8px 0px #dddddd',
        background: 'white',
        "& > button": { marginRight: theme.spacing(0.5) }
    },
    btn: {
        fontWeight: 'bold'
    },
    postArea: {
        borderTop: '1px solid #666666',
        overflowY: 'scroll',
        flexGrow: 1,
        marginTop: '16px'
    },
    loader: {
        position: 'relative',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '150px',
        textAlign: 'center'
    }
})

class Board extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hidden: new Array(4).fill(false),
            expandIdx: -1
        }
    }

    render() {
        const { classes, loading, posts } = this.props;
        return (
            <div>
                <Typography variant="h5" className={classes.title}>
                    公告欄
                </Typography>
                <div className={classes.board}>
                    <div className={classes.postArea}>
                        {
                            loading ?
                                <div className={classes.loader}>
                                    <Typography variant='h6'>載入中&nbsp;.&nbsp;.&nbsp;.</Typography>
                                    <LinearProgress />
                                </div> :
                                <>
                                    {
                                        posts.filter(post => post.cont.priority > 0 || !this.state.hidden[post.cont.type])
                                            .map(post =>
                                                <Post key={post.idx} priority={post.cont.priority} type={post.cont.type} title={post.cont.title}
                                                    content={post.cont.content}
                                                    timestamp={post.cont.timestamp}
                                                    expanded={this.state.expandIdx === post.idx}
                                                    expandToggle={() => {
                                                        if (this.state.expandIdx === post.idx)
                                                            this.setState({ expandIdx: -1 })
                                                        else if (post.cont.content)
                                                            this.setState({ expandIdx: post.idx })
                                                    }}
                                                />)
                                    }
                                </>
                        }
                    </div>
                    <div className={classes.setting}>
                        <Typography variant="subtitle2" style={{ flexShrink: 0 }}>
                            顯示：
                        </Typography>
                        <ThemeProvider theme={TYPE_THEME[0]}>
                            <Button disableElevation size="small" variant={this.state.hidden[0] ? "outlined" : "contained"}
                                color="primary" className={classes.btn}
                                onClick={evt => {
                                    const hidden = this.state.hidden.slice()
                                    hidden[0] = !hidden[0]
                                    this.setState({ hidden })
                                }}>通知</Button>
                        </ThemeProvider>
                        <ThemeProvider theme={TYPE_THEME[1]}>
                            <Button disableElevation size="small" variant={this.state.hidden[1] ? "outlined" : "contained"}
                                color="primary" className={classes.btn}
                                onClick={evt => {
                                    const hidden = this.state.hidden.slice()
                                    hidden[1] = !hidden[1]
                                    this.setState({ hidden })
                                }}>更新</Button>
                        </ThemeProvider>
                        <ThemeProvider theme={TYPE_THEME[2]}>
                            <Button disableElevation size="small" variant={this.state.hidden[2] ? "outlined" : "contained"}
                                color="primary" className={classes.btn}
                                onClick={evt => {
                                    const hidden = this.state.hidden.slice()
                                    hidden[2] = !hidden[2]
                                    this.setState({ hidden })
                                }}>錯誤</Button>
                        </ThemeProvider>
                        <ThemeProvider theme={TYPE_THEME[3]}>
                            <Button disableElevation size="small" variant={this.state.hidden[3] ? "outlined" : "contained"}
                                color="primary" className={classes.btn}
                                onClick={evt => {
                                    const hidden = this.state.hidden.slice()
                                    hidden[3] = !hidden[3]
                                    this.setState({ hidden })
                                }}>已修復</Button>
                        </ThemeProvider>
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(style)(Board);