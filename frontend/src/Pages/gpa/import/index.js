import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { parse } from '../../../Util/dataUtil/gpa';
import { Container, Paper, Typography, useTheme, Link } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import gpa_teach1 from '../../../Resources/gpa_teach1.png'
import gpa_teach2 from '../../../Resources/gpa_teach2.png'
import FullLoading from '../../../Components/FullLoading'
import axios from 'axios';

export default (props) => {
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme()
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    return <Container>
        {loading && <FullLoading />}
        <Paper style={{ padding: theme.spacing(5) }}>
            <div style={{ marginBottom: theme.spacing(3) }}>
                <Typography variant="h5" gutterBottom>匯入歷年課程</Typography>
                <Typography>
                    1. 登入交大註冊組 <Link href="https://regist.nctu.edu.tw/" target="_blank">學籍成績系統</Link><br />
                    2. 點選「歷年成績查詢」按鈕 (<Link href={gpa_teach1} target="_blank">範例</Link>)<br />
                    3. 全選 (ctrl+a) 成績內容，並複製貼至下方表單 (<Link href={gpa_teach2} target="_blank">範例</Link>)<br />
                </Typography>
                <Typography variant="caption">註:建議使用 Chrome 或 FireFox，如用 IE 會複製到其他字元造成匯入失敗。</Typography>
            </div>
            <div style={{ marginBottom: theme.spacing(1) }}>
                <FormControl fullWidth>
                    <TextField multiline variant="outlined" rows={12}
                        value={text} onChange={(e) => setText(e.target.value)}
                    />
                </FormControl>
            </div>
            <div>
                <Button variant="contained" color="primary" onClick={
                    () => {
                        if (!window.confirm('本平台提供之結果僅供參考，不保證其正確性。')) return
                        let data
                        try {
                            if (text === '') throw Error
                            data = parse(text)
                        }
                        catch (e) {
                            enqueueSnackbar("無效的成績紀錄!", { variant: 'error' })
                            return
                        }
                        setLoading(true)
                        axios.post('/api/accounts/courses_history/', {
                            data: JSON.stringify(data)
                        }).then(res => {
                            enqueueSnackbar("上傳成功", { variant: 'success' })
                            window.location.href += "/.."
                        }
                        ).catch(err => {
                            setLoading(false)
                            enqueueSnackbar("上傳失敗", { variant: 'error' })
                        })
                    }}>送出</Button>
            </div>
        </Paper>
    </Container>
}