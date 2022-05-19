import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import html2canvas from "html2canvas"
import React from "react"

const DialogExportImage = ({ open, onClose }) => {
    const handleSubmit = () => {
        onClose()
        const element = document.getElementById('simulator-main-panel')
        if (element == null) {
            window.alert("請先切至主操作畫面再重試")
            return
        }
        window.scrollTo(0, 0)
        setTimeout(() => html2canvas(element).then(canvas => {
            function iOS() {
                return [
                    'iPad Simulator',
                    'iPhone Simulator',
                    'iPod Simulator',
                    'iPad',
                    'iPhone',
                    'iPod'
                ].includes(navigator.platform)
                    // iPad on iOS 13 detection
                    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
            }
            if (iOS()) {
                const image = new Image()
                image.src = canvas.toDataURL()
                const w = window.open("")
                w.document.write(image.outerHTML)
            }
            else {
                const a = document.createElement('a')
                a.href = canvas.toDataURL("image/png")
                a.download = 'image.png'
                a.click()
            }
        }), 500)
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>另存為圖片</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    將另存主操作畫面為圖片，請先確認類別是展開的狀態！
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
                <Button onClick={handleSubmit} color="primary">確認</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(DialogExportImage)