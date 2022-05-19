import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import React, { useContext } from "react"
import { SimulatorContext, SimulatorPropsContext } from "../../Context"

const DialogCategoryDelete = ({ catid, onClose }) => {
    const context = useContext(SimulatorContext)
    const { setContext } = useContext(SimulatorPropsContext)

    const canDelete = (() => {
        if (catid !== null) {
            let cats = []
            for (const gcat in context.groups)
                cats = cats.concat(context.groups[gcat])
            const record = []
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
    })()
    const handleSubmit = () => {
        setContext(ctx => {
            if (catid.startsWith("g")) {
                const groups = { ...ctx.groups }
                delete groups[catid]

                const cat_names = { ...ctx.cat_names }
                delete cat_names[catid]

                const layout = ctx.layout.slice()
                if (layout.indexOf(catid) !== -1)
                    layout.splice(layout.indexOf(catid), 1)

                const targets = { ...ctx.targets }
                delete targets[catid]

                return { ...ctx, groups, cat_names, layout, targets }
            }
            else {
                const categories = { ...ctx.categories }
                delete categories[catid]

                const cat_names = { ...ctx.cat_names }
                delete cat_names[catid]

                const layout = ctx.layout.slice()
                if (layout.indexOf(catid) !== -1)
                    layout.splice(layout.indexOf(catid), 1)

                const content = { ...ctx.content }
                content.unused = content.unused.slice().concat(content[catid])
                delete content[catid]

                const targets = { ...ctx.targets }
                delete targets[catid]

                return { ...ctx, categories, cat_names, layout, content, targets }
            }
        })
        onClose()
    }

    return (
        <Dialog open={catid !== null} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                {
                    catid === null ? "" :
                        canDelete ? `確定刪除 ${context.cat_names[catid] ?? ""}？` : `無法刪除 ${context.cat_names[catid] ?? ""}`
                }
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {
                        catid === null ? "" :
                            canDelete ? (catid.startsWith("g") ? "" : "刪除後原先類別內的資料會移動至未分類課程中") :
                                "此類別被群組依賴，請先調整對應群組再重試"
                    }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
                <Button disabled={!canDelete} onClick={handleSubmit} color="secondary">確認</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(DialogCategoryDelete)