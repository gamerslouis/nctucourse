import React from 'react'
import {
    Paper, Typography, Box, Divider, Hidden
} from '@material-ui/core'
import { RatingDisplay } from '../../../Components/StarRating'

const makeFeedbackContent = (feedback) => {
    let content = feedback.content
    let paragraphs = []
    let p = { title: '', content: [] }
    for (let line of content.split('\n')) {
        if (line[0] === '+') {
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

const Paragraph = (props) => {
    const { title, children } = props
    return (
        <>
            {(title !== undefined && title !== '') && <Typography style={{ marginBottom: 5 }} variant="h6">{title}</Typography>}
            <Typography paragraph>{children}</Typography>
        </>
    )
}

export const FeedbackBody = (props) => {
    const { feedback } = props

    return (
        <Box>
            <Paragraph title="⊕課名⊕" >{feedback.course.cname}</Paragraph>
            <Paragraph title="▲教授▲" >{feedback.course.teacher_name}</Paragraph>
            <Paragraph title="★修課年度★" >{feedback.course.sem_name}</Paragraph>
            {makeFeedbackContent(feedback).map(p => <Paragraph title={p.title}>{p.content}</Paragraph>)}
        </Box>
    )
}

export const Feedback = (props) => {
    const { feedback, renderActions, ...others } = props
    const getRatingText = (rating) => {
        return rating === 0 ? 'NA' : rating.toFixed(1)
    }
    const rating1 = feedback.rating1
    const rating2 = feedback.rating2
    const rating3 = feedback.rating3
    return (
        <Box component={Paper} paddingY={3} paddingX={5} {...others}>
            <div style={{ display: 'flex' }}>
                <div style={{ width: 'fit-content' }}>
                    <Typography variant="subtitle1">
                        <span style={{ marginRight: 20 }}>{`作者： ${feedback.owner}`}</span>
                        <span style={{ display: "inline-block", marginRight: 20 }}>{`更新時間：${feedback.updated_at}`}</span>
                    </Typography>
                </div>
                <div style={{ flex: "1 1 auto" }}></div>
                <Hidden smDown>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {renderActions && renderActions(feedback)}
                    </div>
                </Hidden>
            </div>
            <Hidden mdUp>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {renderActions && renderActions(feedback)}
                </div>
            </Hidden>
            <Box marginY={2}>
                <Divider />
            </Box>
            <FeedbackBody feedback={feedback} />
            <Box marginY={2}>
                <Divider />
            </Box>
            <Hidden mdDown>
                <div style={{ display: "flex", alignItems: 'center', width: '100%', justifyContent: 'space-around', padding: '0rem 2.4rem' }}>
                    <Box>
                        <Typography align='center' gutterBottom>
                            深度 {getRatingText(rating1)}
                        </Typography>
                        <RatingDisplay size={5} value={rating1} />
                    </Box>
                    <Divider flexItem orientation='vertical' />
                    <Box>
                        <Typography align='center' gutterBottom>
                            涼度 {getRatingText(rating2)}
                        </Typography>
                        <RatingDisplay size={5} value={rating2} />
                    </Box>
                    <Divider flexItem orientation='vertical' />
                    <Box>
                        <Typography align='center' gutterBottom>
                            甜度 {getRatingText(rating3)}
                        </Typography>
                        <RatingDisplay size={5} value={rating3} />
                    </Box>
                </div>
            </Hidden>
            <Hidden lgUp>
                <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', padding: '0.5rem 0px' }}>
                        <Box paddingY={1}>
                            <Typography align='center' gutterBottom>
                                深度 {getRatingText(rating1)}
                            </Typography>
                            <RatingDisplay size={5} value={rating1} />
                        </Box>
                        <Divider flexItem orientation='vertical' />
                        <Box paddingY={1}>
                            <Typography align='center' gutterBottom>
                                涼度 {getRatingText(rating2)}
                            </Typography>
                            <RatingDisplay size={5} value={rating2} />
                        </Box>
                    </div>
                    <Divider style={{ width: '80%' }} />
                    <Box paddingY={1}>
                        <Typography align='center' gutterBottom>
                            甜度 {getRatingText(rating3)}
                        </Typography>
                        <RatingDisplay size={5} value={rating3} />
                    </Box>
                </div>
            </Hidden>
        </Box>
    )
}

