import Desktop from './Desktop'
import Mobile from './Mobile'
import { Typography, withStyles, Collapse } from '@material-ui/core';
import { KeyboardArrowDown, LabelImportant } from '@material-ui/icons';
import ReactMarkdown from 'react-markdown';
import React from 'react'
import axios from 'axios'

const BOARD_TYPES = ['通知', '更新', '錯誤', '修復']
// const BOARD_CONTENT = [
//     {
//         timestamp: '21/01/17',
//         type: 0,
//         title: '第三次選課時間 (開學加退選)',
//         content: '第三次選課時間為02/22上午11點至03/08上午9點，請同學不要忘記選課！',
//         priority: 2
//     },
//     {
//         timestamp: '21/01/15',
//         type: 1,
//         title: '更改首頁配置，加入公告欄',
//         priority: 0
//     },
//     {
//         timestamp: '21/01/05',
//         type: 1,
//         title: '增加若選修可做為跨院通識時的提示',
//         priority: 0
//     },
//     {
//         timestamp: '20/12/28',
//         type: 0,
//         title: '第二次選課至12/31上午9點',
//         priority: 0
//     },
//     {
//         timestamp: '20/12/14',
//         type: 3,
//         title: '某些情況會導致同學無法正常使用',
//         content: '若教授從課程時間表上刪除課程，在課程助理內已排入該課程的同學會無法正常顯示頁面\n\n12/17 已修復',
//         priority: 0
//     },
//     {
//         timestamp: '20/12/14',
//         type: 0,
//         title: '第一次選課時間',
//         content: '12/21上午11點至12/24上午9點，同學記得要填教學反映問卷喔',
//         priority: 0
//     },
//     {
//         timestamp: '20/12/14',
//         type: 0,
//         title: '新學期課程時間表上線！',
//         priority: 0
//     },
//     {
//         timestamp: '20/12/08',
//         type: 1,
//         title: '課程助理支援使用舊制時間格式！',
//         priority: 1
//     },
//     {
//         timestamp: '20/09/09',
//         type: 1,
//         title: '加入數項功能優化',
//         content: ' - 縮寫搜尋功能\n\n - 優化課表(顯示課堂教室位置)',
//         priority: 0
//     },
//     {
//         timestamp: '20/09/09',
//         type: 3,
//         title: '匯出課表跑版以及iOS系統下無法正常匯出',
//         priority: 0
//     },
//     {
//         timestamp: '20/09/05',
//         type: 1,
//         title: '儲存模擬排課的設定',
//         priority: 0
//     },
//     {
//         timestamp: '20/09/05',
//         type: 3,
//         title: '新用戶無法登入',
//         priority: 0
//     }
// ]

export const Post = withStyles((theme) => ({
    post: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        minHeight: '40px',
        padding: '3px 8px'
    },
    priorityPost: {
        width: '100%',
        borderBottom: '1px solid #333333',
        marginBottom: '0px !important',
        background: 'white',
    },
    normalPost: {
        width: '100%',
        marginBottom: '0px !important',
        background: '#fcfcfc',
        '&:not(:last-child)': {
            borderBottom: '1px solid #aaaaaa'
        }
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
    },
    content: {
        padding: '6px 8px 6px 45px',
        '& *': {
            margin: `${theme.spacing(0.5)}px 0px`
        }
    }
}))((props) => {
    const { classes, priority, type, title, content, expanded, timestamp, expandToggle } = props
    return (
        <div className={priority > 0 ? classes.priorityPost : classes.normalPost}>
            <div className={classes.post} onClick={evt => expandToggle()} style={{ cursor: content ? 'pointer' : 'default' }}>
                <div style={{ width: '24px', height: '24px', flexShrink: '0' }}>
                    {priority > 0 && <LabelImportant color="primary" />}
                </div>
                <div className={classes.badge} style={{ background: ['#2196F3', '#FF9800', '#F44336', '#4CAF50'][type] }}>
                    {BOARD_TYPES[type]}
                </div>
                <Typography variant='subtitle2' style={{ overflow: 'hidden', display: 'flex', flexGrow: 1, margin: '2px 0px' }}>{title}</Typography>
                {
                    content && <div style={{ width: '24px', height: '24px', flexShrink: '0' }}>
                        <KeyboardArrowDown style={{
                            transform: `rotate(${expanded ? -180 : 0}deg)`,
                            transition: 'transform 0.3s'
                        }} />
                    </div>
                }
                <div>{timestamp}</div>
            </div>
            {
                content &&
                <Collapse in={expanded}>
                    <div className={classes.content} style={
                        props.hasOwnProperty('mobile') ? { borderTop: '1px solid #bbbbbb' } :
                            { transition: 'border-top-width 0.3s', borderTop: expanded ? '1px solid #bbbbbb' : '0px solid #bbbbbb' }
                    }>
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                </Collapse>
            }
        </div>
    )
})


class Board extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            content: [],
            loading: true
        }
    }

    componentDidMount() {
        const CMP = (p1, p2) => {
            if (p1.cont.priority < p2.cont.priority)
                return 1
            else if (p1.cont.priority === p2.cont.priority) {
                if (p1.cont.timestamp < p2.cont.timestamp)
                    return 1
                else if (p1.cont.timestamp === p2.cont.timestamp && p1.idx > p2.idx)
                    return 1
            }
            return -1
        }
        
        axios.get("/api/bulletins/").then(r => r.data['bulletins']).then(bulletins =>
            this.setState({ loading: false, content: bulletins.map((cont, idx) => ({ idx, cont })).sort(CMP) }))
    }

    render() {
        return (
            <>
                {
                    this.props.hasOwnProperty('mobile') ?
                        <Mobile posts={this.state.content} loading={this.state.loading} /> :
                        <Desktop posts={this.state.content} loading={this.state.loading} />
                }
            </>
        )
    }
}

export default Board;