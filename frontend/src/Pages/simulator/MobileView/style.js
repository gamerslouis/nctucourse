import { BottomNavigation as MuiBottomNavigation, withStyles } from "@material-ui/core"
import styled from "styled-components"

export const Base = styled.div`
    width: 100%;
    height: 100%;
`

export const BottomNavigation = withStyles({
    root: {
        width: "100vw",
        position: "fixed",
        bottom: 0,
        marginBottom: 50,
        borderTop: "2px solid rgba(224, 224, 224, 1)"
    }
})(MuiBottomNavigation)

export const PanelContainer = styled.div`
    width: 100%;
    max-height: calc(100vh - 170px);

    padding-top: 8px;
    padding-bottom: 4px;

    overflow-y: auto;
`