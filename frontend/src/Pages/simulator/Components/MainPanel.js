import { Grid, useMediaQuery } from "@material-ui/core"
import React, { useContext } from "react"
import { Droppable } from "react-beautiful-dnd"
import styled from "styled-components"
import { SimulatorContext } from "../Context"
import Category from "./Category"

const PanelBase = styled.div`
    height: 100%;

    padding: 8px 6px;
`

const PanelColumn = ({ index, size }) => {
    const context = useContext(SimulatorContext)
    const sizes = [null, "md", "lg", "xl"]
    const plSize = sizes[size]
    return (
        <PanelBase>
            <Droppable droppableId={`${plSize}-${index}`} type="CATEGORY">
                {
                    provided =>
                        <div {...provided.droppableProps} ref={provided.innerRef} style={{ height: "100%" }}>
                            {
                                context.panel_layouts[plSize][index]
                                    .map((catid, idx) => <Category key={`main-${catid}`} catid={catid} index={idx} />)
                            }
                            {provided.placeholder}
                        </div>
                }
            </Droppable>
        </PanelBase>
    )
}

const MainPanel = () => {
    const mdUp = useMediaQuery(theme => theme.breakpoints.up("md"))
    const lgUp = useMediaQuery(theme => theme.breakpoints.up("lg"))
    const xlUp = useMediaQuery(theme => theme.breakpoints.up("xl"))

    const xl = xlUp
    const lg = !xlUp && lgUp
    const md = !xlUp && !lgUp && mdUp

    return (
        <div id="simulator-main-panel">
            <Grid container direction="row" style={{ overflow: "hidden" }}>
                {
                    xl &&
                    <>
                        <Grid item xl={4}><PanelColumn index={0} size={3} /></Grid>
                        <Grid item xl={4}><PanelColumn index={1} size={3} /></Grid>
                        <Grid item xl={4}><PanelColumn index={2} size={3} /></Grid>
                    </>
                }
                {
                    lg &&
                    <>
                        <Grid item lg={6}><PanelColumn index={0} size={2} /></Grid>
                        <Grid item lg={6}><PanelColumn index={1} size={2} /></Grid>
                    </>
                }
                {
                    md &&
                    <Grid item md={12}><PanelColumn index={0} size={1} /></Grid>
                }
            </Grid>
        </div>
    )
}

export default React.memo(MainPanel)