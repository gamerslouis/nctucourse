import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import React from "react"

const DialogContextReset = ({ open, onClose, updateImport }) => {
    const handleSubmit = () => {
        onClose()
        updateImport(true)
    }
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>確定要初始化資料？</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    模擬器恢復預設值後會自動重新匯入課程歷史
                </DialogContentText>
                <DialogContentText style={{ color: "#f44336" }}>
                    此操作不可逆！
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
                <Button onClick={handleSubmit} color="secondary">確認</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(DialogContextReset)