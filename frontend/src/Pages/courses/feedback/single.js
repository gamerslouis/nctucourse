import React from 'react'
import {
    Container, Paper, Table, TableContainer, TableRow, TableCell, Chip, TableHead,
    TableBody, Button, TablePagination, InputBase, Typography, Link, Box, Divider
} from '@material-ui/core'
import axios from 'axios'

const makeCourseName = (course) => {
    return `${course.cos_id} ${course.cname}（${course.teacher_name}）`
}

const makeFeedbackContent = (feedback) => {
    let content = feedback.content
    let paragraphs = []
    let p = { title: '', content: [] }
    for (let line of content.split('\n')) {
        if (line[0] == '+') {
            if (!(p.title === '' && p.content.length === 0)) {
                paragraphs.push(p)
            }
            p = { title: line.substr(1), content: [] }
        }
        else {
            if (p.content.length === 0 && line === '') continue
            p.content.push(<>{line}<br /></>)
        }
    }
    if (!(p.title === '' && p.content.length === 0)) {
        paragraphs.push(p)
    }
    return paragraphs
}

export const FeedbackBody = (props) => {
    const { feedback } = props
    return (
        <Box>
            {makeFeedbackContent(feedback).map(p => <>
                {p.title !== '' && <Typography style={{ marginBottom: 5 }} variant="h6">{p.title}</Typography>}
                <Typography paragraph>{p.content}</Typography>
            </>)}
        </Box>
    )
}

export const Feedback = (props) => {
    const { feedback, subtitle, buttons } = props
    return (
        <Box component={Paper} paddingY={3} paddingX={5}>
            <Box>
                <Typography variant="h5">{feedback.title}</Typography>
                <Typography variant="subtitle1">{`${feedback.owner} ${feedback.updated_at}  `}<Link>{makeCourseName(feedback.course)}</Link></Typography>
            </Box>
            <Box marginY={2}>
                <Divider />
            </Box>
            <FeedbackBody feedback={feedback} />
        </Box>
    )
}

