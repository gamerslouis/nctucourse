import { LinearProgress, withStyles } from '@material-ui/core'
import { lightBlue } from '@material-ui/core/colors'
import { Settings } from '@material-ui/icons'
import React from 'react'

const style = theme => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '4px 16px'
    },
    setting: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    spanClick: {
        color: 'rgba(0, 0, 0, 0.5)',
        cursor: 'pointer',
        '&:hover': {
            color: 'rgba(0, 0, 0, 0.75)'
        }
    },
    content: {
        width: '100%',
        padding: `0px ${theme.spacing(1)}px`,
        color: 'rgba(0, 0, 0, 0.8)'
    }
})

const LinearProgressPrim = withStyles(theme => ({
    colorPrimary: {
        backgroundColor: lightBlue['A100']
    },
    barColorPrimary: {
        backgroundColor: lightBlue['A700']
    }
}))(LinearProgress)

class StatItem extends React.PureComponent {
    progress(value, target) {
        return 100 * (value >= target ? 1 : (value / target))
    }
    render() {
        const { cat, credit, t_credit, amount, t_amount } = this.props
        const sm = this.props.hasOwnProperty('sm')
        const xs = this.props.hasOwnProperty('xs')
        return (
            <div style={{ marginBottom: '4px', marginLeft: `${sm ? 9 : xs ? 18 : 0}px` }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: `${(sm || xs) ? 16 : 18}px` }}>{cat}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexGrow: 1 }}>
                        <div style={{ fontSize: `${(sm || xs) ? 14 : 16}px`, display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                            <div style={{ display: 'flex', flexGrow: 1 }}>&nbsp;</div>
                            {
                                cat !== '體育' && cat !== '服務學習' && cat !== '藝文賞析' &&
                                <span style={{ textAlign: 'end' }}>{credit}{t_credit > 0 && <span style={{ fontSize: '14px' }}>/{t_credit}</span>}學分</span>
                            }
                            {
                                cat !== '總學分' &&
                                <span style={{ marginLeft: '4px', width: '60px', textAlign: 'end' }}>{amount}{t_amount > 0 && <span style={{ fontSize: '14px' }}>/{t_amount}</span>}門</span>
                            }
                        </div>
                    </div>
                </div>
                <div style={{ marginLeft: '9px' }}>
                    {t_credit > 0 && <LinearProgressPrim variant="determinate" value={this.progress(credit, t_credit)} />}
                    {t_amount > 0 && <LinearProgress variant="determinate" value={this.progress(amount, t_amount)} color="secondary" />}
                </div>
            </div>
        )
    }
}

class Statistics extends React.Component {
    parse() {
        const { categories, targets } = this.props
        const _targets = {}
        for (let cat in targets) {
            const [credit, amount] = targets[cat].split(';')
            _targets[cat] = { credit, amount }
        }
        for (let cid in categories) {
            const cat = categories[cid]
            if (!(cat in _targets)) {
                _targets[cat] = { credit: 0, amount: 0 }
            }
        }
        if (!('total' in _targets)) {
            _targets['total'] = {
                credit: 0, amount: 0
            }
        }
        if (!('通識_total' in _targets)) {
            _targets['通識_total'] = {
                credit: 0, amount: 0
            }
        }
        if (!('通識_core' in _targets)) {
            _targets['通識_core'] = {
                credit: 0, amount: 0
            }
        }
        return _targets
    }

    render() {
        const { classes, openDialog, categories, contents, showAllState, loading } = this.props
        const targets = this.parse()
        let ge = -1
        for (let cid in categories)
            if (categories[cid].startsWith('通識 ─ ')) {
                ge = cid
                break
            }
        const ges = categories.slice(ge).filter(cat => cat.startsWith('通識 ─ ')).reduce((accu, cat) => (accu.concat(contents[cat])), [])
        const ges_core = categories.slice(ge).filter(cat => cat.startsWith('通識 ─ 核心')).reduce((accu, cat) => (accu.concat(contents[cat])), [])
        return (
            <div className={classes.root}>
                {
                    !loading &&
                    <div className={classes.content}>
                        <div className={classes.setting}>
                            <Settings style={{ width: '20px', height: '20px', cursor: 'pointer' }} className={classes.spanClick} onClick={openDialog} />
                        </div>
                        <StatItem cat={'總學分'} t_credit={targets['total'].credit} t_amount={0}
                            credit={categories.map(cat => (
                                contents[cat].filter(item => (item.type !== '軍訓') && (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + item.cos_credit), 0)
                            )).reduce((accu, item) => (accu + item), 0)}
                            amount={0} />
                        {
                            categories.slice(0, ge).map(cat =>
                                <StatItem cat={cat} t_credit={targets[cat].credit} t_amount={targets[cat].amount}
                                    credit={contents[cat].filter(item => (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + item.cos_credit), 0)}
                                    amount={contents[cat].filter(item => (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + 1), 0)} />
                            )
                        }
                        {
                            <>
                                <StatItem cat={'通識'} t_credit={targets['通識_total'].credit} t_amount={targets['通識_total'].amount}
                                    credit={ges.filter(item => (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + item.cos_credit), 0)}
                                    amount={ges.filter(item => (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + 1), 0)} />
                                <StatItem sm cat={'核心'} t_credit={targets['通識_core'].credit} t_amount={targets['通識_core'].amount}
                                    credit={ges_core.filter(item => (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + item.cos_credit), 0)}
                                    amount={ges_core.filter(item => (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + 1), 0)} />
                                <StatItem xs cat={'人文'} t_credit={targets['通識 ─ 核心人文'].credit} t_amount={targets['通識 ─ 核心人文'].amount}
                                    credit={contents['通識 ─ 核心人文'].filter(item => (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + item.cos_credit), 0)}
                                    amount={contents['通識 ─ 核心人文'].filter(item => (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + 1), 0)} />
                                <StatItem xs cat={'社會'} t_credit={targets['通識 ─ 核心社會'].credit} t_amount={targets['通識 ─ 核心社會'].amount}
                                    credit={contents['通識 ─ 核心社會'].filter(item => (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + item.cos_credit), 0)}
                                    amount={contents['通識 ─ 核心社會'].filter(item => (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + 1), 0)} />
                                <StatItem xs cat={'自然'} t_credit={targets['通識 ─ 核心自然'].credit} t_amount={targets['通識 ─ 核心自然'].amount}
                                    credit={contents['通識 ─ 核心自然'].filter(item => (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + item.cos_credit), 0)}
                                    amount={contents['通識 ─ 核心自然'].filter(item => (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + 1), 0)} />
                                <StatItem sm cat={'跨院'} t_credit={targets['通識 ─ 跨院'].credit} t_amount={targets['通識 ─ 跨院'].amount}
                                    credit={contents['通識 ─ 跨院'].filter(item => (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + item.cos_credit), 0)}
                                    amount={contents['通識 ─ 跨院'].filter(item => (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + 1), 0)} />
                                <StatItem sm cat={'校基本'} t_credit={targets['通識 ─ 校基本'].credit} t_amount={targets['通識 ─ 校基本'].amount}
                                    credit={contents['通識 ─ 校基本'].filter(item => (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + item.cos_credit), 0)}
                                    amount={contents['通識 ─ 校基本'].filter(item => (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + 1), 0)} />
                            </>
                        }
                        {
                            categories.slice(ge).filter(cat => !cat.startsWith('通識 ─ ')).map(cat =>
                                <StatItem cat={cat} t_credit={targets[cat].credit} t_amount={targets[cat].amount}
                                    credit={contents[cat].filter(item => (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + item.cos_credit), 0)}
                                    amount={contents[cat].filter(item => (showAllState || (item.state !== ' '))).reduce((accu, item) => (accu + 1), 0)} />
                            )
                        }
                    </div>
                }
            </div>
        )
    }
}

export default withStyles(style)(Statistics)