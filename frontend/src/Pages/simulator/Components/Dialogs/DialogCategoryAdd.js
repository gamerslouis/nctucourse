import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core"
import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { SimulatorContext, SimulatorPropsContext } from "../../Context"

const TextFields = styled.div`
    width: 100%;
    
    display: inline-flex;
    justify-content: space-around;
`

const DialogCategoryAdd = ({ open, onClose }) => {
    const context = useContext(SimulatorContext)
    const { setContext } = useContext(SimulatorPropsContext)
    const [name, setName] = useState("")
    const [error, setError] = useState(false)

    useEffect(() => {
        if (open) {
            const new_catname = "類別 " + (context.layout.filter(catid => !catid.startsWith("g")).length + 1)
            setName(new_catname)
            setError(false)
        }
    }, [open, context.layout])

    const handleChange = evt => {
        setName(evt.target.value.slice(0, 20))
        setError(Object.values(context.cat_names).indexOf(evt.target.value) !== -1)
    }
    const handleKeyPress = evt => {
        if (evt.key === "Enter")
            handleSubmit()
    }
    const handleSubmit = () => {
        const catid = "cat_" + ((context.layout
            .filter(catid => !catid.startsWith("g"))
            .map(catid => parseInt(catid.match(/^cat_(\d+)$/)[1]))
            .sort((a, b) => (b - a))[0] ?? 0) + 1)
        setContext(ctx => {
            const cat_names = { ...ctx.cat_names }
            cat_names[catid] = name

            const layout = ctx.layout.slice()
            layout.push(catid)

            const content = { ...ctx.content }
            content[catid] = []

            const targets = { ...ctx.targets }
            targets[catid] = [null, null]

            return { ...ctx, cat_names, layout, content, targets }
        })
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>新增類別</DialogTitle>
            <DialogContent style={{ overflowY: "clip" }}>
                <TextFields>
                    <TextField variant="outlined" label="類別名稱" size="small"
                        value={name} onChange={handleChange} onKeyPress={handleKeyPress}
                        error={error} helperText={error ? "已有重複名稱的類別/群組存在" : null} />
                </TextFields>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
                <Button onClick={handleSubmit} color="primary" disabled={error}>確認</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(DialogCategoryAdd)