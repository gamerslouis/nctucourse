import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Card, Container, Divider, FormControl, FormGroup, Hidden, Input, InputLabel, TextField, withTheme } from '@material-ui/core';
import Board from '../Components/BulletinBoard'
import GoogleLogo from '../Components/GoogleLogo'
import { useState } from 'react';
import { connect } from 'react-redux'
import { FETCH_STATUS } from '../Redux/Actions'
import { withSnackbar } from 'notistack';


const styles = (theme) => ({
    row: {
        margin: "0 20px",
        display: 'flex',
        alignItems: 'center'
    },
    rowText: {
        flexGrow: 1,
        marginLeft: 20
    }
})

class Profile extends React.Component {
    render() {
        const { theme, user, classes } = this.props
        return (
            <Container>
                <Card style={{ padding: 20 }}>
                    <Typography variant="h3" align="center">用戶資料</Typography>
                    <div style={{ margin: "10px 20px" }}>
                        <div className={classes.row}>
                            <Typography>學號:</Typography>
                            <TextField className={classes.rowText} variant="outlined" margin="dense" value={this.props.user.username}></TextField>
                        </div>
                        {
                            user.social.map(social => <div>id:{social.id} email:{social.uid}</div>)
                        }
                    </div>
                </Card>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user
})


export default connect(mapStateToProps)(withStyles(styles)(withTheme(Profile)))