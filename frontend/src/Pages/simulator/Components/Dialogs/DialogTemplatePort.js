import { Button, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormHelperText, InputBase, makeStyles, Paper, Tooltip } from "@material-ui/core"
import React, { useContext, useEffect, useState } from "react"
import { SimulatorContext } from "../../Context"
import { dumpTemplate, templateSanityCheck } from "../../utilities"

const useStyles = makeStyles({
    subtitle: {
        paddingTop: 6,
        marginTop: 16,
        borderTop: "1px solid #c2c2c2",
        fontSize: 16,
        color: "rgba(0, 0, 0, 0.87)"
    },
    paper: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderRight: 0
    },
    input: {
        flexGrow: 1,
        padding: "2px 12px"
    },
    warning: {
        color: "#f44336",
        margin: "4px 14px 0px"
    }
})

const DialogTemplatePort = ({ open, onClose, updateImport }) => {
    const classes = useStyles()
    const context = useContext(SimulatorContext)
    const [_export, setExport] = useState("")
    const [_import, setImport] = useState("")
    const [error, setError] = useState(false)
    const [tooltip, setTooltip] = useState(false)

    useEffect(() => {
        if (open) {
            setExport(JSON.stringify(dumpTemplate(context)))
            setImport("")
            setError(true)
            setTooltip(false)
        }
    }, [context, open])

    const handleCopy = () => {
        navigator.clipboard.writeText(_export)
        setTooltip(true)
    }
    const handleTooltipClose = () => setTooltip(false)
    const handleChange = evt => {
        setImport(evt.target.value)
        setError(!templateSanityCheck(evt.target.value))
    }
    const handleSubmit = () => {
        onClose()
        updateImport(true, JSON.parse(_import))
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>匯入/匯出模板</DialogTitle>
            <DialogContent style={{ overflowY: "clip" }}>
                <DialogContentText>
                    匯出後的模板可以分享給其他人，讓他們直接套用你的設定！
                </DialogContentText>

                <DialogContentText className={classes.subtitle}>
                    匯出我的模板
                </DialogContentText>
                <ClickAwayListener onClickAway={handleTooltipClose}>
                    <Tooltip open={tooltip} onClose={handleTooltipClose} PopperProps={{ disablePortal: true }}
                        disableFocusListener disableHoverListener disableTouchListener
                        title="已複製！" arrow placement="top">
                        <Paper elevation={0} variant="outlined" className={classes.paper}>
                            <InputBase className={classes.input} value={_export} readOnly />
                            <Button onClick={handleCopy} variant="contained" color="primary" disableElevation>複製</Button>
                        </Paper>
                    </Tooltip>
                </ClickAwayListener>

                <DialogContentText className={classes.subtitle}>
                    匯入他人模板
                </DialogContentText>
                <Paper elevation={0} variant="outlined" className={classes.paper}>
                    <InputBase className={classes.input} value={_import} onChange={handleChange} />
                    <Tooltip title={error ? "無效的模板" : ""} arrow placement="bottom">
                        <span>
                            <Button onClick={handleSubmit} variant="contained" color="secondary" disableElevation disabled={error}>套用</Button>
                        </span>
                    </Tooltip>
                </Paper>
                {
                    !error && <FormHelperText className={classes.warning}>套用後會恢復預設值並使用此模板重新載入資料，此操作不可逆！</FormHelperText>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">關閉</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(DialogTemplatePort)