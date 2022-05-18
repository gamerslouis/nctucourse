import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, InputAdornment, OutlinedInput as MuiOutlinedInput, withStyles } from "@material-ui/core"
import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { SimulatorContext, SimulatorPropsContext } from "../../Context"

const TextFields = styled.div`
    width: 100%;
    
    display: inline-flex;
    justify-content: space-around;
`
const OutlinedInput = withStyles(() => ({
    root: {
        width: "45%"
    }
}))(MuiOutlinedInput)

const DialogTargetEdit = ({ editingTarget, onClose }) => {
    const context = useContext(SimulatorContext)
    const { setContext } = useContext(SimulatorPropsContext)
    const [credits, setCredits] = useState(0)
    const [amount, setAmount] = useState(0)

    useEffect(() => {
        if (editingTarget !== null) {
            const [c, a] = context.targets[editingTarget]
            setCredits(c ?? 0)
            setAmount(a ?? 0)
        }
        else {
            setCredits(0)
            setAmount(0)
        }
    }, [editingTarget, context])

    const handleCreditsChange = evt => setCredits(evt.target.value)
    const handleAmountChange = evt => setAmount(evt.target.value)
    const handleKeyPress = evt => {
        if (evt.key === "Enter")
            handleSubmit()
    }
    const handleSubmit = () => {
        setContext(ctx => {
            const targets = { ...ctx.targets }
            targets[editingTarget] = [credits ? credits : null, amount ? amount : null]
            return { ...ctx, targets }
        })
        onClose()
    }

    return (
        <Dialog open={editingTarget !== null} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>設定 {editingTarget === "total" ? "總學分" : context.cat_names[editingTarget]} 目標</DialogTitle>
            <DialogContent>
                <TextFields>
                    <OutlinedInput type="number" value={credits}
                        onChange={handleCreditsChange}
                        onKeyPress={handleKeyPress}
                        endAdornment={<InputAdornment position="end">學分</InputAdornment>} />
                    {
                        editingTarget !== "total" &&
                        <OutlinedInput type="number" value={amount}
                            onChange={handleAmountChange}
                            onKeyPress={handleKeyPress}
                            endAdornment={<InputAdornment position="end">門</InputAdornment>} />
                    }
                </TextFields>
                <FormHelperText>設定為0以移除目標</FormHelperText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
                <Button onClick={handleSubmit} color="primary">確認</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(DialogTargetEdit)