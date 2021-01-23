import { Typography, withStyles, LinearProgress } from '@material-ui/core';
import React from 'react'
import { Post } from '.'

const style = theme => ({
    board: {
        width: '95%',
        margin: `${theme.spacing(3)}px 0px`,
        border: '1px solid #bbbbbb',
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    postArea: {
        flexGrow: 1
    },
    loader: {
        margin: '10px auto',
        paddingBottom: '10px',
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
            </div>
        )
    }
}

export default withStyles(style)(Board);