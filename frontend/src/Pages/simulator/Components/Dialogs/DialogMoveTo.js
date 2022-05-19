import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from "@material-ui/core"
import React, { useContext, useEffect, useState } from "react"
import { SimulatorContext, SimulatorPropsContext } from "../../Context"

const DialogMoveTo = ({ catid, catidx, open, onClose }) => {
    const context = useContext(SimulatorContext)
    const { setContext } = useContext(SimulatorPropsContext)
    const [value, setValue] = useState("")

    useEffect(() => {
        if (open) {
            setValue(catid)
        }
    }, [catid, open])

    const handleValueChange = evt => setValue(evt.target.value)
    const handleSubmit = () => {
        if (value !== catid) {
            setContext(ctx => {
                const from_content = ctx.content[catid].slice()
                const [item] = from_content.splice(catidx, 1)

                const to_content = ctx.content[value].slice()
                to_content.push(item)

                const content = { ...ctx.content }
                content[catid] = from_content
                content[value] = to_content
                return { ...ctx, content }
            })
        }
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>移動課程</DialogTitle>
            <DialogContent style={{ display: "flex", flexDirection: "column", alignItems: "center", overflowY: "clip" }}>
                <FormControl style={{ width: "100%", maxWidth: 240 }}>
                    <InputLabel>移動目標</InputLabel>
                    <Select value={value} onChange={handleValueChange}>
                        {
                            open && context.content[catid][catidx].indexOf("@") === -1 &&
                            <MenuItem value="unused"
                                style={{ fontWeight: value === "unused" ? 700 : 500 }}>未分類課程</MenuItem>
                        }
                        {
                            context.layout.filter(catid => context.categories[catid]).map(
                                catid => <MenuItem key={`dialog-move-to-${catid}`} value={catid}
                                    style={{ fontWeight: value === catid ? 700 : 500 }}>{context.cat_names[catid]}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
                <Button onClick={handleSubmit} color="primary">確認</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(DialogMoveTo)