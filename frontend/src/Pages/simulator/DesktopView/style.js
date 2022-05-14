import { Button, Grid as MuiGrid, IconButton, Paper, Tab as MuiTab, withStyles } from "@material-ui/core"
import styled from "styled-components"

export const ContainerGrid = withStyles(() => ({
    root: { height: "100%" }
}))(MuiGrid)
export const ContainerPaper = withStyles(() => ({
    root: {
        height: "100%",
        position: "relative"
    }
}))(Paper)

export const CollapsePaper = withStyles(theme => ({
    root: {
        width: `calc(100% - ${theme.spacing(4)}px)`,
        display: "inline-flex",
        alignItems: "center",
        margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        fontWeight: "bold",
        fontSize: "16px"
    }
}))(Paper)
export const CollapseText = styled.span`
    margin-left: 12px;
    margin-right: auto;
`
export const CollapseButton = withStyles(() => ({
    root: { padding: 2 }
}))(IconButton)
export const CollapseSave = withStyles(() => ({
    root: {
        minWidth: 40,
        padding: 2,
        color: '#8A6D3B',
        fontWeight: 500
    }
}))(Button)

export const Tab = withStyles(() => ({
    root: { minWidth: 0 }
}))(MuiTab)
export const TabPanel = styled.div`
    overflow-y: auto;
`