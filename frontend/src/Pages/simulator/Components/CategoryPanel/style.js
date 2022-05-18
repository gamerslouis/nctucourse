import { Accordion as MuiAccordion, AccordionDetails as MuiAccordionDetails, AccordionSummary as MuiAccordionSummary, Button as MuiButton, TableCell as MuiTableCell, withStyles } from "@material-ui/core"
import styled from "styled-components"

export const Base = styled.div`
    width: 100%;
`

export const TableCell = withStyles(() => ({
    sizeSmall: {
        padding: "6px 4px",
        "&:last-child": {
            paddingRight: 4
        }
    }
}))(MuiTableCell)

export const ButtonGroup = styled.div`
    width: 100%;
    
    display: inline-flex;
    
    margin-bottom: 8px;
    border-bottom: 2px solid rgba(224, 224, 224, 1);
`

export const Button = withStyles(() => ({
    root: {
        flexGrow: 1
    }
}))(MuiButton)

export const IconButton = styled.div`
    width: fit-content;

    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 0;
    flex-basis: 0;
    flex-shrink: 0;

    cursor: pointer;

    & > svg {
        width: 18px;
        height: 18px;

        color: rgba(0, 0, 0, 0.6);
        transition: color 0.3s;
        visibility: hidden;
    }
    &:hover > svg {
        color: rgba(0, 0, 0, 0.85);
    }
`

export const Accordion = withStyles({
    root: {
        border: "1px solid rgba(0, 0, 0, .125)",
        boxShadow: "none",
        "&:not(:last-child)": {
            borderBottom: 0
        },
        "&:before": {
            display: "none"
        },
        "&$expanded": {
            margin: "auto"
        }
    },
    expanded: {}
})(MuiAccordion)

export const AccordionSummary = withStyles({
    root: {
        marginBottom: -1,
        borderBottom: "1px solid rgba(0, 0, 0, .125)",
        backgroundColor: "rgba(0, 0, 0, .03)",
        "&$expanded": {
            minHeight: 56
        }
    },
    content: {
        margin: 0,
        fontSize: "1rem",
        "&$expanded": {
            margin: 0
        }
    },
    expanded: {}
})(MuiAccordionSummary)

export const AccordionDetails = withStyles((theme) => ({
    root: { padding: theme.spacing(1) }
}))(MuiAccordionDetails)
