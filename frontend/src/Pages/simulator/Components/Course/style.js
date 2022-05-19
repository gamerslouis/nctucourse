import { Paper as MuiPaper, Typography as MuiTypography, withStyles } from "@material-ui/core"
import { MoreVert } from "@material-ui/icons"
import styled from "styled-components"

export const Base = withStyles(theme => ({
    root: {
        marginBottom: theme.spacing(0.5),
        padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
        userSelect: "none"
    }
}))(MuiPaper)

export const Content = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    padding: 4px 0px;
`

export const Title = withStyles(() => ({
    root: {
        flexGrow: 1,
        flexBasis: 0,
        flexShrink: 1
    }
}))(MuiTypography)

export const Credit = styled.div`
    min-width: 45px;
    flex-basis: 0;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
`

export const MoreButton = withStyles(() => ({
    root: {
        color: "rgba(0, 0, 0, 0.5)",
        cursor: "pointer",
        alignSelf: "center",
        flexShrink: 0,
        "&:hover": {
            color: "rgba(0, 0, 0, 0.75)"
        }
    }
}))(MoreVert)

export const Details = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-start;

    border-top: 1px solid rgba(0, 0, 0, 0.12);

    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
`

export const SemId = styled.span`
    flex-grow: 1;
    flex-basis: 0;
    flex-shrink: 0;
    margin-right: 4;
`

export const DepTeacher = styled.span`
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: flex-end;
`