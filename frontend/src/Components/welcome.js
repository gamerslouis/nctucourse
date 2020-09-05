import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControlLabel, Checkbox, Button, Typography } from '@material-ui/core';

export default (props) => {
    let defaultShow
    //Check localStorage suppert
    if (window.localStorage) {
        //HACK 暫時先直接把更新時間寫死在檔案內
        const last_update_time = 1599307893019
        if (Number(window.localStorage.getItem('hideWelcomeTime')) < last_update_time) {
            window.localStorage.setItem('hideWelcome', "")
        }
        defaultShow = !Boolean(window.localStorage.getItem('hideWelcome'))
    }
    else {
        defaultShow = true
    }
    const [show, setShow] = useState(defaultShow)

    const handleClose = () => setShow(false)

    return <div>
        <Dialog open={show} onClose={handleClose}>
            <DialogTitle>交大課程助理!</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    歡迎使用交大學生製作的課程助理，本系統提供以下功能:<br />
                    <ul>
                        <li>模擬排課</li>
                        <li>雲端保存排課紀錄</li>
                        <li>匯出課表圖片</li>
                        <li>GPA 計算機</li>
                    </ul>
                    感謝您的使用，也歡迎推廣給更多需要的朋友們。<br />
                    若使用有任何問題或建議，請點選右下角"意見回饋"按鈕回報。<br /><br />
                    <b>更新(2020/09/05):</b>
                    <ul>
                        <li>儲存模擬排課的設定</li>
                        <li>修復新用戶無法登入的漏洞</li>
                    </ul>
                </DialogContentText>
                <DialogActions>
                    {window.localStorage &&
                        <FormControlLabel label="我知道了，不要再顯示。"
                            control={<Checkbox onChange
                                onChange={(e) => {
                                    window.localStorage.setItem('hideWelcome', e.target.checked ? "true" : "")
                                    window.localStorage.setItem('hideWelcomeTime', Date.now())
                                }}
                            />} />
                    }
                    <Button onClick={handleClose} color="primary">
                        關閉
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    </div>
}