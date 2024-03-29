import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core"
import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { SimulatorContext, SimulatorPropsContext } from "../../Context"

const TextFields = styled.div`
    width: 100%;
    
    display: inline-flex;
    justify-content: space-around;
`

const DialogCategoryRename = ({ catid, onClose }) => {
    const context = useContext(SimulatorContext)
    const { setContext } = useContext(SimulatorPropsContext)
    const [name, setName] = useState("")
    const [error, setError] = useState(false)

    useEffect(() => {
        if (catid !== null) {
            setName(context.cat_names[catid])
        }
    }, [catid, context.cat_names])

    const handleChange = evt => {
        setName(evt.target.value.slice(0, 20))
        setError(Object.keys(context.cat_names).filter(_catid => _catid !== catid).map(catid => context.cat_names[catid]).indexOf(evt.target.value) !== -1)
    }
    const handleKeyPress = evt => {
        if (evt.key === "Enter")
            handleSubmit()
    }
    const handleSubmit = () => {
        setContext(ctx => {
            const cat_names = { ...ctx.cat_names }
            cat_names[catid] = name
            return { ...ctx, cat_names }
        })
        onClose()
    }

    return (
        <Dialog open={catid !== null} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>重新命名</DialogTitle>
            <DialogContent style={{ overflowY: "clip" }}>
                <TextFields>
                    <TextField variant="outlined" label="類別名稱" size="small"
                        value={name} onChange={handleChange} onKeyPress={handleKeyPress}
                        error={error} helperText={error ? "已有重複名稱的類別/群組存在" : null} />
                </TextFields>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
                <Button onClick={handleSubmit} color="primary">確認</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(DialogCategoryRename)