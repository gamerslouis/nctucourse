import React from 'react'
import IconButton from '@material-ui/core/IconButton';
import GitHubIcon from '@material-ui/icons/GitHub';


const Footer = (props) => {
    const year = new Date().getFullYear()
    return (
        <footer style={{ padding: "10px 30px" }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                Copyright &copy; {year} nctucourse.louisif.me &nbsp;&nbsp;
                <IconButton href="https://github.com/gamerslouis/nctucourse"
                    size="small" style={{ marginRight: 'auto' }} color="primary"
                >
                    <GitHubIcon />
                </IconButton>
                <span>
                    <a style={{ textDecoration: 'none' }}
                        href="https://forms.gle/Jp6f3rxkjZe7X5Pt5">意見回饋</a>
                </span>
            </div>
        </footer >
    )
}

export default Footer