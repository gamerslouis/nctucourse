import { Accordion as MuiAccordion, AccordionDetails as MuiAccordionDetails, AccordionSummary as MuiAccordionSummary, withStyles } from "@material-ui/core"
import styled from "styled-components"

export const Base = styled.div`
    width: 100%;
`

export const ButtonGroup = styled.div`
    width: 100%;
    
    display: inline-flex;
    
    margin-bottom: 8px;
    border-bottom: 2px solid rgba(224, 224, 224, 1);
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
