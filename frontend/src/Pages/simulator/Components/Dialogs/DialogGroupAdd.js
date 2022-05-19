import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@material-ui/core"
import React, { useContext, useEffect, useState } from "react"
import { SimulatorContext, SimulatorPropsContext } from "../../Context"

const DialogGroupAdd = ({ open, onClose }) => {
    const context = useContext(SimulatorContext)
    const { setContext } = useContext(SimulatorPropsContext)
    const [name, setName] = useState("")
    const [value, setValue] = useState([])
    const [error, setError] = useState(false)

    useEffect(() => {
        if (open) {
            const new_catname = "群組 " + (Object.keys(context.groups).length + 1)
            setName(new_catname)
            setValue([])
        }
    }, [open, context.groups])

    const handleNameChange = evt => {
        setName(evt.target.value)
        setError(Object.values(context.cat_names).indexOf(evt.target.value) !== -1)
    }
    const handleValueChange = evt => setValue(evt.target.value)
    const handleSubmit = () => {
        const catid = "gcat_" + ((Object.keys(context.groups)
            .map(catid => parseInt(catid.match(/^gcat_(\d+)$/)[1]))
            .sort((a, b) => (b - a))[0] ?? 0) + 1)
        setContext(ctx => {
            const groups = { ...ctx.groups }
            groups[catid] = value.slice()

            const cat_names = { ...ctx.cat_names }
            cat_names[catid] = name

            const layout = ctx.layout.slice()
            layout.push(catid)

            const targets = { ...ctx.targets }
            targets[catid] = [null, null]

            return { ...ctx, groups, cat_names, layout, targets }
        })
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>新增群組</DialogTitle>
            <DialogContent style={{ display: "flex", flexDirection: "column", alignItems: "center", overflowY: "clip" }}>
                <TextField variant="outlined" label="群組名稱" size="small"
                    value={name} onChange={handleNameChange}
                    error={error} helperText={error ? "已有重複名稱的類別/群組存在" : null} />

                <FormControl style={{ width: "100%", maxWidth: 240 }}>
                    <InputLabel>欲群組類別</InputLabel>
                    <Select multiple value={value} onChange={handleValueChange}>
                        {
                            context.layout.map(
                                catid => <MenuItem key={`dialog-group-add-${catid}`} value={catid}
                                    style={{ fontWeight: value.indexOf(catid) === -1 ? 500 : 700 }}>{context.cat_names[catid]}</MenuItem>
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

export default React.memo(DialogGroupAdd)