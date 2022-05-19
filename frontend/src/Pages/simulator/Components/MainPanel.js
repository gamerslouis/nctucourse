import { Grid, useMediaQuery } from "@material-ui/core"
import React, { useContext } from "react"
import styled from "styled-components"
import { SimulatorContext } from "../Context"
import Category from "./Category"

const PanelBase = styled.div`
    padding: 8px 6px;
`

const PanelColumn = ({ index, size }) => {
    const context = useContext(SimulatorContext)
    return (
        <PanelBase>
            {
                context.layout.filter(catid => context.categories[catid])
                    .filter((_, idx) => ((idx % size) === index))
                    .map(catid => <Category key={`main-${catid}`} catid={catid} />)
            }
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
        <div>
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