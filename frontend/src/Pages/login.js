import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
        width: '120px',
        height: '2.5rem',
        marginTop: theme.spacing(2)
    }
})

const Login = (props) => (
    <div className={props.classes.root}>
        <Typography variant="h4">
            交大課程助理
        </Typography>
        <Button
            variant="contained"
            color="primary"
            className={props.classes.button}
            href="/api/accounts/login">
            Login
        </Button>
    </div>
)

export default withStyles(styles)(Login)