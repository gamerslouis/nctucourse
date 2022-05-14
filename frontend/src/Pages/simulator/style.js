import { Paper, withStyles } from "@material-ui/core"
import styled from "styled-components"

export const Base = styled.div`
    height: calc(100vh - 140px);
    max-height: calc(100vh - 140px);

    margin-bottom: 60px;
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