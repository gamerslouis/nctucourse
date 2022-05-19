import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core"
import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { SimulatorPropsContext } from "../../Context"
import { generateItemId, getRawCourseId } from "../../utilities"

const TextFields = styled.div`
    width: 100%;
    
    display: inline-flex;
    justify-content: space-around;
`

const DialogCloneAdjust = ({ catid, catidx, itemId, open, onClose }) => {
    const { courses, setContext } = useContext(SimulatorPropsContext)
    const [credits, setCredits] = useState(0)

    useEffect(() => {
        if (open) {
            setCredits(parseInt(itemId.match(/\$(\d+)/)?.[1] ?? courses[getRawCourseId(itemId)].cos_credit))
        }
    }, [courses, itemId, open])

    const handleChange = evt => setCredits(evt.target.value)
    const handleKeyPress = evt => {
        if (evt.key === "Enter")
            handleSubmit()
    }
    const handleSubmit = () => {
        setContext(ctx => {
            const cat_content = ctx.content[catid].slice()
            cat_content[catidx] = generateItemId(itemId, true, credits)

            const content = { ...ctx.content }
            content[catid] = cat_content
            return { ...ctx, content }
        })
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>調整這份複製用於計算和顯示的學分</DialogTitle>
            <DialogContent style={{ overflowY: "clip" }}>
                <TextFields>
                    <TextField variant="outlined" label="類別名稱" size="small"
                        value={credits} onChange={handleChange} onKeyPress={handleKeyPress} />
                </TextFields>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
                <Button onClick={handleSubmit} color="primary">確認</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(DialogCloneAdjust)