import { Collapse, Typography } from "@material-ui/core"
import { KeyboardArrowDown } from "@material-ui/icons"
import React, { useState } from "react"
import { Background, Base, CollapseBase, ContainerPaper, Title } from "./style"

const UnusedItems = () => {
    const [open, setOpen] = useState(false)
    const toggleOpen = () => setOpen(p => !p)
    const handleClose = () => setOpen(false)

    return (
        <Base>
            <Background open={open} onClick={handleClose} />
            <Title open={open} onClick={toggleOpen}>
                <Typography variant="h6">未分類課程</Typography>
                <KeyboardArrowDown style={{ transform: `scaleY(${open ? 1 : -1})`, transition: "transform .3s" }} />
            </Title>
            <Collapse in={open}>
                <CollapseBase>
                    <ContainerPaper variant="outlined">

                    </ContainerPaper>
                </CollapseBase>
            </Collapse>
        </Base>
    )
}

export default React.memo(UnusedItems)