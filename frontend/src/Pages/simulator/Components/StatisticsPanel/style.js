import { Button as MuiButton, LinearProgress, TableCell as MuiTableCell, withStyles } from "@material-ui/core"
import { lightBlue } from "@material-ui/core/colors"
import styled from "styled-components"

export const Base = styled.div`
    width: 100%;

    overflow-y: auto;
`

export const ButtonGroup = styled.div`
    width: 100%;
    
    display: inline-flex;
    
    margin-bottom: 8px;
    border-bottom: 2px solid rgba(224, 224, 224, 1);
`

export const Button = withStyles({
    root: {
        flexGrow: 1
    }
})(MuiButton)

export const TableCell = withStyles({
    sizeSmall: {
        padding: "6px 4px",
        "&:last-child": {
            paddingRight: 4
        }
    }
})(MuiTableCell)

export const ProgressCell = withStyles({
    sizeSmall: {
        padding: "0px 0px 1px 12px"
    }
})(TableCell)

export const LinearProgressBlue = withStyles(theme => ({
    colorPrimary: {
        backgroundColor: lightBlue['A100']
    },
    barColorPrimary: {
        backgroundColor: lightBlue['A700']
    }
}))(LinearProgress)