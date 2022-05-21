import { Button } from "@material-ui/core"
import { ErrorOutline } from "@material-ui/icons"
import React from "react"

class SimulatorErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            integrityError: null,
            integrityErrorInfo: null
        }
    }

    static getDerivedStateFromError(err) {
        if (err instanceof Error) {
            const error = err.stack ? `${err.name}: ${err.message}` : err.name
            const errorInfo = err.stack ?? err.message
            return {
                integrityError: error,
                integrityErrorInfo: errorInfo
            }
        }
        else {
            return {
                integrityError: err,
                integrityErrorInfo: err
            }
        }
    }

    createErrorMessage(type, error, errorInfo, extra = null) {
        const msg = `\nType: ${type}\n\nError:\n${error}\n\nInfo:\n${errorInfo}`
        if (extra !== null) {
            if (type === "HISTORY_IMPORT")
                return msg + `\n\nTemplate:\n${JSON.stringify(extra, null, 2)}`
            if (type === "DATA_INTEGRITY")
                return msg + `\n\nContext:\n${JSON.stringify(extra, null, 2)}`
        }
        return msg
    }

    copyError(type, error, errorInfo, extra) {
        navigator.clipboard.writeText(this.createErrorMessage(type, error, errorInfo, extra))
    }

    renderError(type, error, errorInfo, extra) {
        const handleClick = () => this.copyError(type, error, errorInfo, extra)
        return (
            <div style={{
                width: "100%", height: "100%",
                display: "flex", flexDirection: "column",
                justifyContent: "center", alignItems: "center"
            }}>
                <ErrorOutline style={{
                    width: 80, height: "auto",
                    color: "rgba(0, 0, 0, .6)"
                }} />
                <span>發生意外的錯誤</span>
                <p style={{ textAlign: "center" }}>
                    如果您不是第一次使用模擬器或剛匯入過新的課程資料，<br />
                    重新整理通常能解決問題，還原至您上次儲存的狀態。
                </p>
                <span>
                    <Button variant="contained" color="secondary"
                        onClick={handleClick} style={{ marginRight: "1rem" }}>複製錯誤</Button>
                    <Button variant="contained" color="primary"
                        component="a" href="https://forms.gle/Jp6f3rxkjZe7X5Pt5"
                        target="_blank" rel="noreferrer noopener">回報錯誤</Button>
                </span>
                <p style={{ textAlign: "center" }}>
                    您可以按下「複製錯誤」的按鈕後，將複製的錯誤訊息<br />
                    附在「回報錯誤」按鈕的表單中，並說明發生錯誤前的操作，<br />
                    來協助我們改善，謝謝！
                </p>
            </div>
        )
    }

    render() {
        if (this.props.importError) {
            const { importError: error, importErrorInfo: errorInfo, importTemplate } = this.props
            return this.renderError("HISTORY_IMPORT", error, errorInfo, importTemplate)
        }
        if (this.state.integrityError) {
            const { context } = this.props
            const { integrityError: error, integrityErrorInfo: errorInfo } = this.state
            return this.renderError("DATA_INTEGRITY", error, errorInfo, context)
        }
        return this.props.children
    }
}

export default SimulatorErrorBoundary