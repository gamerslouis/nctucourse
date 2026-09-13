import React, { useEffect, useState } from 'react'
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography
} from '@material-ui/core'
import { ConvertToNewCodeStr, ConvertToOldCodeStr, newSecs, newTimeCode } from '../Util/style'

const PRESET_COLORS = [
    '#aebed1', '#ff7675', '#ffeaa7', '#74b9ff',
    '#55efc4', '#a29bfe', '#81ecec', '#fab1a0',
]

const EMPTY = { name: '', teacher: '', time: '', room: '', credit: '', color: PRESET_COLORS[0] }

// Accepts the new-style codes the export page already documents, e.g. "W1256,R8y".
const isValidTime = (text) => {
    if (text.trim() === '') return true
    return text.split(',').every(block => {
        const b = block.trim()
        if (b === '') return false
        return newTimeCode.includes(b[0]) && b.length > 1 &&
            [...b.slice(1)].every(c => newSecs.includes(c))
    })
}

const CustomCourseDialog = ({ open, initial, onClose, onSubmit }) => {
    const [form, setForm] = useState(EMPTY)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!open) return
        setSubmitting(false)
        setError(null)
        setForm(initial
            ? {
                name: initial.name,
                teacher: initial.teacher || '',
                room: initial.room || '',
                credit: initial.credit ? String(initial.credit) : '',
                color: initial.color || PRESET_COLORS[0],
                time: ConvertToNewCodeStr(initial.time || ''),
            }
            : EMPTY)
    }, [open, initial])

    const timeOk = isValidTime(form.time)
    // "-" and "," are separators inside a course's time string
    const roomOk = !/[-,]/.test(form.room)
    const canSubmit = form.name.trim() !== '' && timeOk && roomOk && !submitting

    const set = (key) => (evt) => setForm({ ...form, [key]: evt.target.value })

    const handleSubmit = () => {
        if (!canSubmit) return
        setSubmitting(true)
        setError(null)
        Promise.resolve(onSubmit({
            name: form.name.trim(),
            teacher: form.teacher.trim(),
            room: form.room.trim(),
            time: ConvertToOldCodeStr(form.time.replace(/\s/g, '')),
            credit: Number(form.credit) || 0,
            color: form.color,
        })).catch((err) => {
            console.log(err)
            setError('儲存失敗，請稍後再試')
        }).finally(() => setSubmitting(false))
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>{initial ? '編輯自訂課程' : '新增自訂課程'}</DialogTitle>
            <DialogContent>
                <TextField autoFocus fullWidth margin="dense" label="名稱"
                    placeholder="例如：清大 演算法" value={form.name} onChange={set('name')} />
                <TextField fullWidth margin="dense" label="授課教師（選填）"
                    value={form.teacher} onChange={set('teacher')} />
                <TextField fullWidth margin="dense" label="時間"
                    placeholder="例如：W1256,R8y"
                    value={form.time} onChange={set('time')}
                    error={!timeOk}
                    helperText={timeOk
                        ? `星期 ${newTimeCode.join('')}，節次 ${newSecs.join(',')}`
                        : '格式不對，每段要是「星期 + 節次」，多段用逗號分隔'} />
                <TextField fullWidth margin="dense" label="地點（選填）"
                    placeholder="例如：清大資電館" value={form.room} onChange={set('room')}
                    error={!roomOk}
                    helperText={roomOk ? null : '地點不能包含「-」或「,」'} />
                <TextField fullWidth margin="dense" label="學分（選填）" type="number"
                    value={form.credit} onChange={set('credit')} />

                <Typography variant="caption" color="textSecondary"
                    style={{ display: 'block', marginTop: 12 }}>顏色</Typography>
                <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 4 }}>
                    {PRESET_COLORS.map(c => (
                        <div
                            key={c}
                            role="button"
                            aria-label={`顏色 ${c}`}
                            onClick={() => setForm({ ...form, color: c })}
                            style={{
                                width: 30, height: 30, marginRight: 8, marginBottom: 8,
                                borderRadius: 4, cursor: 'pointer', backgroundColor: c,
                                border: form.color === c ? '3px solid #3f51b5' : '1px solid #ccc',
                            }}
                        />
                    ))}
                </div>
            </DialogContent>
            <DialogActions>
                {error && <Typography variant="caption" color="error" style={{ flex: 1, paddingLeft: 8 }}>{error}</Typography>}
                <Button onClick={onClose}>取消</Button>
                <Button color="primary" disabled={!canSubmit} onClick={handleSubmit}>確定</Button>
            </DialogActions>
        </Dialog>
    )
}

export default CustomCourseDialog
