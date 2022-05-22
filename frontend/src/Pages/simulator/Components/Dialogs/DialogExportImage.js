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
            const exportCanvas = canvas => {
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
            }
            const statistics_table = document.getElementById('simulator-statistics-table')
            if (statistics_table) {
                html2canvas(statistics_table).then(canvas2 => {
                    const merged_canvas = document.createElement("canvas")
                    merged_canvas.width = canvas.width + canvas2.width
                    merged_canvas.height = Math.max(canvas.height, canvas2.height)
                    const ctx = merged_canvas.getContext("2d")
                    ctx.fillStyle = "white"
                    ctx.fillRect(0, 0, merged_canvas.width, merged_canvas.height)
                    ctx.drawImage(canvas2, 0, 0)
                    ctx.drawImage(canvas, canvas2.width, 0)
                    exportCanvas(merged_canvas)
                })
            }
            else
                exportCanvas(canvas)
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