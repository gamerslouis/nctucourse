import { Typography, withStyles, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { KeyboardArrowDown, LabelImportant } from '@material-ui/icons';
import ReactMarkdown from 'react-markdown';
import React from 'react'

const BOARD_TYPES = ['通知', '更新', '錯誤', '修復']
const style = (theme) => ({
    post: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        minHeight: '40px',
        padding: '3px 8px',
        cursor: 'default'
    },
    pinnedPost: {
        width: '100%',
        borderBottom: '1px solid #333333',
        marginBottom: '0px !important',
        background: 'white',
    },
    normalPost: {
        width: '100%',
        borderBottom: '1px solid #aaaaaa',
        marginBottom: '0px !important',
        background: '#fcfcfc'
    },
    badge: {
        margin: `0px ${theme.spacing(1)}px`,
        padding: '3px 6px',
        color: 'white',
        borderRadius: '.75rem',
        fontSize: '12px',
        fontWeight: '250',
        userSelect: 'none',
        flexShrink: '0'
    }
})

const PlainAccordion = withStyles({
    root: {
        boxShadow: 'none',
        margin: '0px !important'
    }
})(Accordion);
const PlainAccordionSummary = withStyles({
    root: {
        minHeight: '40px',
        '&$expanded': {
            minHeight: '40px'
        }
    },
    content: {
        margin: '0px',
        alignItems: 'center',
        '&$expanded': {
            margin: '0'
        }
    },
    expanded: {}
})(AccordionSummary)
const PlainAccordionDetails = withStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        background: '#f6f6f6',
        '& *': {
            margin: `${theme.spacing(0.5)}px 0px`
        }
    }
}))(AccordionDetails)

const Post = ({ classes, pinned, type, title, content, expanded, timestamp, expandToggle }) => (
    <>
        {
            content ?
                <PlainAccordion className={pinned ? classes.pinnedPost : classes.normalPost}>
                    <PlainAccordionSummary className={classes.post} onClick={evt => expandToggle()}>
                        <div style={{ width: '24px', height: '24px', flexShrink: '0' }}>
                            {pinned && <LabelImportant color="primary" />}
                        </div>
                        <div className={classes.badge} style={{ background: ['#2196F3', '#FF9800', '#F44336', '#4CAF50'][type] }}>
                            {BOARD_TYPES[type]}
                        </div>
                        <Typography variant='subtitle2' style={{ overflow: 'hidden', display: 'flex', flexGrow: 1, margin: '2px 0px' }}>{title}</Typography>
                        <div style={{ width: '24px', height: '24px', flexShrink: '0' }}>
                            <KeyboardArrowDown style={{
                                transform: `rotate(${expanded ? -180 : 0}deg)`,
                                transition: 'transform 0.3s'
                            }} />
                        </div>
                        <div>{timestamp}</div>
                    </PlainAccordionSummary>
                    <PlainAccordionDetails style={{
                        padding: '6px 8px 6px 45px',
                        borderTop: expanded ? '1px solid #bbbbbb' : '0px solid #bbbbbb',
                        transition: 'border-top-width 0.3s'
                    }}>
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </PlainAccordionDetails>
                </PlainAccordion> :
                <div className={pinned ? classes.pinnedPost : classes.normalPost}>
                    <div className={classes.post}>
                        <div style={{ width: '24px', height: '24px', flexShrink: '0' }}>
                            {pinned && <LabelImportant color="primary" />}
                        </div>
                        <div className={classes.badge} style={{ background: ['#2196F3', '#FF9800', '#F44336', '#4CAF50'][type] }}>
                            {BOARD_TYPES[type]}
                        </div>
                        <Typography variant='subtitle2' style={{ overflow: 'hidden', display: 'flex', flexGrow: 1, margin: '2px 0px' }}>{title}</Typography>
                        <div>{timestamp}</div>
                    </div>
                </div>
        }
    </>
)

export default withStyles(style)(Post)