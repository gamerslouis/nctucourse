import { Accordion as MuiAccordion, AccordionDetails as MuiAccordionDetails, AccordionSummary as MuiAccordionSummary, Paper as MuiPaper, withStyles } from "@material-ui/core"

export const Accordion = withStyles({
    root: {
        margin: "0px 12px 8px",
        boxShadow: "none",
        "&:not(:last-child)": {
            borderBottom: 0
        },
        "&:before": {
            display: "none"
        },
        "&$expanded": {
            margin: "0px 12px 8px"
        }
    },
    expanded: {}
})(MuiAccordion)

export const AccordionSummary = withStyles({
    root: {
        minHeight: 44,
        marginBottom: -1,
        padding: 0,
        borderBottom: "2px solid rgba(0, 0, 0, .25)",
        transition: "border-bottom .15s cubic-bezier(0.4, 0, 0.2, 1)",
        "&$expanded": {
            minHeight: 48,
            borderBottom: "1px solid rgba(0, 0, 0, .125)"
        }
    },
    content: {
        display: "inline-flex",
        justifyContent: "start",
        alignItems: "center",
        margin: 0,
        padding: 6,
        fontSize: "1rem",
        "&$expanded": {
            margin: 0
        },
        "& > div": {
            height: 36,
            padding: 6
        },
        "& > p": { flexGrow: 1 },
        "& > button": {
            padding: 6,
            opacity: 0,
            visibility: "hidden",
            transition: "visibility 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
        },
        "&$expanded > button": {
            opacity: 1,
            visibility: "visible"
        }
    },
    expanded: {},
    expandIcon: { padding: 6 }
})(MuiAccordionSummary)

export const AccordionDetails = withStyles((theme) => ({
    root: { padding: `${theme.spacing(1)}px 0px` }
}))(MuiAccordionDetails)

export const Paper = withStyles(theme => ({
    root: {
        width: "100%",
        padding: theme.spacing(1),
        background: "#fafafa"
    }
}))(MuiPaper)