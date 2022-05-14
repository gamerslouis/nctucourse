import { Fab, Paper, withStyles } from "@material-ui/core"
import styled from "styled-components"

export const Base = styled.div`
    height: calc(100vh - 130px);
    max-height: calc(100vh - 140px);

    padding: 0px 24px;
`

export const LoadingContext = withStyles(() => ({
    root: {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
}))(Paper)

export const OptionFab = withStyles(theme => ({
    root: {
        position: 'absolute',
        bottom: 70,
        right: theme.spacing(2)
    }
}))(Fab)