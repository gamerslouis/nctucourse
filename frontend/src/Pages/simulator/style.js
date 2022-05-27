import { Fab, withStyles } from "@material-ui/core"
import styled from "styled-components"

export const Base = styled.div`
    height: calc(100vh - 130px);
    max-height: calc(100vh - 130px);
`

export const LoadingContext = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const OptionFab = withStyles(theme => ({
    root: {
        position: 'absolute',
        bottom: 70,
        right: theme.spacing(2)
    }
}))(Fab)