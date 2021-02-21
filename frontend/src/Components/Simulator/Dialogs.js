import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, FormGroup, InputAdornment, TextField, Typography, withStyles } from '@material-ui/core'
import { Check, Edit } from '@material-ui/icons'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export const DialogConfirm = ({ open, onClose }) => {
    const [checked, setCheck] = useState(false)
    const [closing, setClosing] = useState(false)
    return (
        <Dialog open={open}>
            <DialogTitle>交大課程助理學分模擬器 免責聲明</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <p>
                        本系統只提供同學模擬自己已修過的學分狀況，<br />
                        系統<strong style={{ color: 'black' }}>並不會檢查</strong>同學們分配學分的方式是否正確，<br />
                        僅是做為一個工具，方便同學檢視自己的學分狀況。
                    </p>
                    <p>
                        若不確定某門課程是否能被移動到其他類別或研究所課程能否抵免大學部學分，請洽系辦或該課開課單位。<br />
                        畢業預審請向校方行政單位書面提出申請，請勿使用此系統之模擬結果！<br />
                        本系統<strong style={{ color: 'black' }}>只是一個第三方模擬工具</strong>，任何模擬結果都沒有經過校方驗證，<br />
                        <strong style={{ color: 'black' }}>若有同學誤用本系統而有任何損失，本系統與開發團隊一概不負任何責任！</strong>
                    </p>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <FormGroup>
                    <FormControlLabel control={<Checkbox checked={checked} onChange={evt => setCheck(evt.target.checked)} />} label="我已詳細閱讀理解以上免責聲明，並接受其內容" disabled={closing} />
                </FormGroup>
                <div style={{ width: '64px', height: '36px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    {
                        closing
                            ?
                            <CircularProgress style={{ width: '36px', height: '36px' }} />
                            :
                            <Button onClick={evt => {
                                setClosing(true)
                                onClose()
                            }} color="primary" disabled={!checked || closing}>
                                關閉
                        </Button>
                    }
                </div>
            </DialogActions>
        </Dialog>
    )
}

export const DialogRenameCategory = ({ open, onClose, check, rename, cname }) => {
    const [name, setName] = useState(cname)
    const [fail, setFail] = useState(0)
    useEffect(() => setName(cname), [cname])
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>重新命名 {cname}</DialogTitle>
            <DialogContent>
                <TextField value={name} onChange={evt => setName(evt.target.value)}
                    error={fail > 0} helperText={(fail > 0) && (fail === 1 ? '已有重複名稱的類別存在' : '無效名稱')} />
            </DialogContent>
            <DialogActions>
                <Button onClick={evt => onClose()}>取消</Button>
                <Button onClick={evt => {
                    if (check(name))
                        setFail(1)
                    else if (name === 'unused' || name === 'total' || name === '通識_total' || name === '通識_core')
                        setFail(2)
                    else
                        rename(name)
                }} color="primary">確認</Button>
            </DialogActions>
        </Dialog>
    )
}

export const DialogRemoveCategory = ({ open, onClose, remove, cname }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>確定移除類別 {cname}？</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    原先在此類別中的課程將會被移動至未分類課程中！
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={evt => onClose()}>取消</Button>
                <Button onClick={evt => remove()} color="primary">確認</Button>
            </DialogActions>
        </Dialog>
    )
}

class _DialogLoadTemplate extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            templates: []
        }
    }

    componentDidMount() {
        // axios.get('http://localhost:8000/template').then(res => res.data).then(templates => this.setState(templates))
    }

    render() {
        const { open, cancel, load } = this.props
        return (
            <Dialog open={open} onClose={cancel}>
                <DialogTitle>載入範本</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        原先在此類別中的課程將會被移動至未分類課程中！
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={evt => cancel()}>取消</Button>
                    <Button onClick={evt => load([])} color="primary">確認</Button>
                </DialogActions>
            </Dialog>
        )
    }
}
export const DialogLoadTemplate = _DialogLoadTemplate

class _DialogStatisticsSetting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            targets: null,
            editing: '',
            edit_credit: 0,
            edit_amount: 0
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            const { targets, categories } = this.props
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
            this.setState({ targets: _targets })
        }
    }

    handleSave() {
        const { setTargets } = this.props
        const new_targets = {}
        for (let cat in this.state.targets) {
            if (this.state.targets[cat].credit || this.state.targets[cat].amount) {
                new_targets[cat] = `${this.state.targets[cat].credit};${this.state.targets[cat].amount}`
            }
        }
        setTargets(new_targets)
        this.handleClose()
    }

    handleClose() {
        this.setState({
            targets: null,
            editing: '',
            edit_credit: 0,
            edit_amount: 0
        })
        this.props.onClose()
    }

    check(value) {
        const chk = parseInt(value)
        if (chk >= 0)
            return `${chk}`
        else if (value === '')
            return 0
        return NaN
    }

    saveInner(cat) {
        const targets = { ...this.state.targets }
        targets[cat].credit = this.state.edit_credit
        targets[cat].amount = this.state.edit_amount
        this.setState({ targets, editing: '', edit_credit: 0, edit_amount: 0 })
    }

    render() {
        const { classes, open, categories } = this.props
        return (
            <Dialog open={open} onClose={evt => this.handleClose()} maxWidth='sm' fullWidth>
                <DialogTitle>設定統計資料目標</DialogTitle>
                <DialogContent>
                    {
                        this.state.targets &&
                        <>
                            <div className={classes.row}>
                                <Typography variant='subtitle1' style={{ marginRight: '4px' }}>總學分</Typography>
                                {
                                    this.state.editing === '' &&
                                    <>
                                        <Typography variant='subtitle2' style={{ color: 'rgba(0, 0, 0, 0.7)', marginLeft: '4px' }}>
                                            {
                                                this.state.targets['total'].credit > 0
                                                    ?
                                                    `${this.state.targets['total'].credit}學分`
                                                    :
                                                    '無設定'
                                            }
                                        </Typography>
                                        <div style={{ display: 'flex', flexGrow: 1 }}>&nbsp;</div>
                                        <Edit className={classes.spanClick} onClick={evt => this.setState({
                                            editing: 'total',
                                            edit_credit: this.state.targets['total'].credit,
                                            edit_amount: 0
                                        })} />
                                    </>
                                }
                                {
                                    this.state.editing === 'total' &&
                                    <>
                                        <TextField variant="outlined" size="small" type="number"
                                            className={classes.input} value={this.state.edit_credit}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">學分</InputAdornment>,
                                            }}
                                            onChange={evt => {
                                                const chk = this.check(evt.target.value)
                                                if (!isNaN(chk))
                                                    this.setState({ edit_credit: chk })
                                            }} onKeyDown={evt => { if (evt.key === 'Enter') this.saveInner('total') }} />
                                        <div style={{ display: 'flex', flexGrow: 1 }}>&nbsp;</div>
                                        <div>
                                            <Check className={classes.spanClick} onClick={evt => this.saveInner('total')} />
                                        </div>
                                    </>
                                }
                            </div>
                            <div className={classes.row}>
                                <Typography variant='subtitle1' style={{ marginRight: '4px' }}>總通識學分</Typography>
                                {
                                    this.state.editing === '' &&
                                    <>
                                        <Typography variant='subtitle2' style={{ color: 'rgba(0, 0, 0, 0.7)', marginLeft: '4px' }}>
                                            {
                                                this.state.targets['通識_total'].credit > 0
                                                    ?
                                                    `${this.state.targets['通識_total'].credit}學分`
                                                    :
                                                    '無設定'
                                            }
                                        </Typography>
                                        <div style={{ display: 'flex', flexGrow: 1 }}>&nbsp;</div>
                                        <Edit className={classes.spanClick} onClick={evt => this.setState({
                                            editing: '通識_total',
                                            edit_credit: this.state.targets['通識_total'].credit,
                                            edit_amount: 0
                                        })} />
                                    </>
                                }
                                {
                                    this.state.editing === '通識_total' &&
                                    <>
                                        <TextField variant="outlined" size="small" type="number"
                                            className={classes.input} value={this.state.edit_credit}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">學分</InputAdornment>,
                                            }}
                                            onChange={evt => {
                                                const chk = this.check(evt.target.value)
                                                if (!isNaN(chk))
                                                    this.setState({ edit_credit: chk })
                                            }} onKeyDown={evt => { if (evt.key === 'Enter') this.saveInner('通識_total') }} />
                                        <div style={{ display: 'flex', flexGrow: 1 }}>&nbsp;</div>
                                        <div>
                                            <Check className={classes.spanClick} onClick={evt => this.saveInner('通識_total')} />
                                        </div>
                                    </>
                                }
                            </div>
                            <div className={classes.row}>
                                <Typography variant='subtitle1' style={{ marginRight: '4px' }}>總核心通識學分</Typography>
                                {
                                    this.state.editing === '' &&
                                    <>
                                        <Typography variant='subtitle2' style={{ color: 'rgba(0, 0, 0, 0.7)', marginLeft: '4px' }}>
                                            {
                                                this.state.targets['通識_core'].credit > 0
                                                    ?
                                                    `${this.state.targets['通識_core'].credit}學分`
                                                    :
                                                    '無設定'
                                            }
                                        </Typography>
                                        <div style={{ display: 'flex', flexGrow: 1 }}>&nbsp;</div>
                                        <Edit className={classes.spanClick} onClick={evt => this.setState({
                                            editing: '通識_core',
                                            edit_credit: this.state.targets['通識_core'].credit,
                                            edit_amount: 0
                                        })} />
                                    </>
                                }
                                {
                                    this.state.editing === '通識_core' &&
                                    <>
                                        <TextField variant="outlined" size="small" type="number"
                                            className={classes.input} value={this.state.edit_credit}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">學分</InputAdornment>,
                                            }}
                                            onChange={evt => {
                                                const chk = this.check(evt.target.value)
                                                if (!isNaN(chk))
                                                    this.setState({ edit_credit: chk })
                                            }} onKeyDown={evt => { if (evt.key === 'Enter') this.saveInner('通識_core') }} />
                                        <div style={{ display: 'flex', flexGrow: 1 }}>&nbsp;</div>
                                        <div>
                                            <Check className={classes.spanClick} onClick={evt => this.saveInner('通識_core')} />
                                        </div>
                                    </>
                                }
                            </div>
                            <Divider style={{ margin: '4px 0px' }} />
                            {
                                categories.map(cat =>
                                    <div className={classes.row}>
                                        <Typography variant='subtitle1' style={{ marginRight: '4px' }}>{cat}</Typography>
                                        {
                                            this.state.editing === '' &&
                                            <>
                                                <Typography variant='subtitle2' style={{ color: 'rgba(0, 0, 0, 0.7)', marginLeft: '4px' }}>
                                                    {
                                                        this.state.targets[cat].credit > 0
                                                            ?
                                                            this.state.targets[cat].amount > 0
                                                                ? `${this.state.targets[cat].credit} 學分 / ${this.state.targets[cat].amount} 門`
                                                                : `${this.state.targets[cat].credit} 學分`
                                                            :
                                                            this.state.targets[cat].amount > 0
                                                                ? `${this.state.targets[cat].amount} 門`
                                                                : '無設定'
                                                    }
                                                </Typography>
                                                <div style={{ display: 'flex', flexGrow: 1 }}>&nbsp;</div>
                                                <Edit className={classes.spanClick} onClick={evt => this.setState({
                                                    editing: cat,
                                                    edit_credit: this.state.targets[cat].credit,
                                                    edit_amount: this.state.targets[cat].amount
                                                })} />
                                            </>
                                        }
                                        {
                                            this.state.editing === cat &&
                                            <>
                                                <TextField variant="outlined" size="small" type="number"
                                                    className={classes.input} value={this.state.edit_credit}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">學分</InputAdornment>,
                                                    }}
                                                    onChange={evt => {
                                                        const chk = this.check(evt.target.value)
                                                        if (!isNaN(chk))
                                                            this.setState({ edit_credit: chk })
                                                    }} onKeyDown={evt => { if (evt.key === 'Enter') this.saveInner(cat) }} />
                                                <TextField variant="outlined" size="small" type="number"
                                                    className={classes.input} value={this.state.edit_amount}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">門</InputAdornment>,
                                                    }}
                                                    onChange={evt => {
                                                        const chk = this.check(evt.target.value)
                                                        if (!isNaN(chk))
                                                            this.setState({ edit_amount: chk })
                                                    }} onKeyDown={evt => { if (evt.key === 'Enter') this.saveInner(cat) }} />
                                                <div style={{ display: 'flex', flexGrow: 1 }}>&nbsp;</div>
                                                <div>
                                                    <Check className={classes.spanClick} onClick={evt => this.saveInner(cat)} />
                                                </div>
                                            </>
                                        }
                                    </div>
                                )
                            }
                        </>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={evt => this.handleClose()}>取消</Button>
                    <Button onClick={evt => this.handleSave()} color="primary">確認</Button>
                </DialogActions>
            </Dialog>
        )
    }
}
export const DialogStatisticsSetting = withStyles(theme => ({
    row: {
        width: '100%',
        height: '40px',
        padding: '2px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        '&:not(:hover) > svg': {
            display: 'none'
        }
    },
    spanClick: {
        color: 'rgba(0, 0, 0, 0.6)',
        cursor: 'pointer',
        transform: 'scale(0.85)',
        flexShrink: 0,
        '&:hover': {
            color: 'rgba(0, 0, 0, 0.85)'
        }
    },
    input: {
        width: '120px',
        margin: '4px'
    }
}))(_DialogStatisticsSetting)

export const DialogTutor = ({ next, tutorIdx, children }) => {
    return (
        <Dialog open={tutorIdx > 0} maxWidth='xs' fullWidth BackdropProps={{ style: { background: 'rgba(1, 1, 1, 0.2)' } }}>
            <DialogTitle>功能導覽</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {children}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={evt => next()} color="primary" disabled={tutorIdx > 1}>完成</Button>
                <Button onClick={evt => next()} color="primary" disabled={tutorIdx <= 1}>下一步</Button>
            </DialogActions>
        </Dialog>
    )
}
