import { Button, Checkbox, CircularProgress as MuiCircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel as MuiFormControlLabel, FormGroup, withStyles } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import styled from "styled-components"

const Strong = styled.strong`
    color: black;
`
const Submit = styled.div`
    width: 64px;
    height: 36px;

    display: flex;
    flex-direction: row;
    justify-content: center;
`

const FormControlLabel = withStyles({
    root: { userSelect: "none" }
})(MuiFormControlLabel)
const CircularProgress = withStyles({
    root: {
        width: "36px !important",
        height: "36px !important"
    }
})(MuiCircularProgress)

const defaultState = {
    checked: false,
    pending: false
}
const DialogDisclaimer = ({ open, onClose }) => {
    const [state, setState] = useState({ ...defaultState })
    useEffect(() => {
        if (open)
            setState({ ...defaultState })
    }, [open])

    const handleCheck = evt => setState(prevState => ({ ...prevState, checked: evt.target.checked }))
    const handleClick = () => {
        setState(prevState => ({ ...prevState, pending: true }))
        onClose()
    }

    return (
        <Dialog open={open}>
            <DialogTitle>交大課程助理學分模擬器 免責聲明</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    本系統目前處於<Strong>Beta測試階段</Strong>，如使用過程中有任何異常或建議，歡迎透過頁面右下方<Strong>意見回饋</Strong>表單回應。
                </DialogContentText>
                <DialogContentText>
                    本系統只提供同學模擬自己已修過的學分狀況，<br />
                    系統<Strong>並不會檢查</Strong>同學們分配學分的方式是否正確，<br />
                    僅是做為一個工具，方便同學檢視自己的學分狀況。
                </DialogContentText>
                <DialogContentText>
                    若不確定某門課程是否能被移動到其他類別或研究所課程能否抵免大學部學分，請洽系辦或該課開課單位。<br />
                    畢業預審請向校方行政單位書面提出申請，請勿直接使用此系統之模擬結果！<br />
                    本系統<Strong>只是一個第三方模擬工具</Strong>，任何模擬結果都沒有經過校方驗證，<br />
                    <Strong>若有同學誤用本系統而有任何損失，本系統與開發團隊一概不負任何責任！</Strong>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox checked={state.checked} onChange={handleCheck} />}
                        label="我已詳細閱讀理解以上免責聲明，並接受其內容"
                        disabled={state.pending} />
                </FormGroup>
                <Submit>
                    {
                        state.pending ?
                            <CircularProgress /> :
                            <Button onClick={handleClick} color="primary" disabled={!state.checked || state.pending}>
                                關閉
                            </Button>
                    }
                </Submit>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(DialogDisclaimer)