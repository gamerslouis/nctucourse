import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from "@material-ui/core"
import React, { useContext, useEffect, useState } from "react"
import { SimulatorContext, SimulatorPropsContext } from "../../Context"

const DialogGroupEdit = ({ catid, onClose }) => {
    const context = useContext(SimulatorContext)
    const { setContext } = useContext(SimulatorPropsContext)
    const [value, setValue] = useState([])

    useEffect(() => {
        if (catid !== null) {
            setValue(context.groups[catid])
        }
    }, [catid, context.groups])

    const handleValueChange = evt => setValue(evt.target.value)
    const handleSubmit = () => {
        setContext(ctx => {
            const groups = { ...ctx.groups }
            groups[catid] = value.slice()
            return { ...ctx, groups }
        })
        onClose()
    }

    const checkDependency = checking => {
        if (checking.startsWith("g")) {
            let cats = context.groups[checking].slice()
            const record = [checking]
            while (true) {
                let cats_new = []
                for (const cat of cats) {
                    record.push(cat)
                    if (cat.startsWith("g"))
                        cats_new = cats_new.concat(context.groups[cat])
                }
                if (cats_new.length === 0)
                    break
                cats = cats_new
            }
            return !(new Set(record).has(catid))
        }
        return true
    }

    return (
        <Dialog open={catid !== null} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>編輯群組</DialogTitle>
            <DialogContent style={{ display: "flex", flexDirection: "column", alignItems: "center", overflowY: "clip" }}>
                <FormControl style={{ width: "100%", maxWidth: 240 }}>
                    <InputLabel>欲群組類別</InputLabel>
                    <Select multiple value={value} onChange={handleValueChange}>
                        {
                            context.layout.filter(checkDependency).map(
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

export default React.memo(DialogGroupEdit)