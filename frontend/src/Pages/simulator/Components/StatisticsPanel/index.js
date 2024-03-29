import { LinearProgress, makeStyles, Table, TableBody, TableRow } from "@material-ui/core"
import { Edit, LowPriority } from "@material-ui/icons"
import clsx from "clsx"
import React, { useContext } from "react"
import { SimulatorContext, SimulatorPropsContext } from "../../Context"
import { getRawCourseId } from "../../utilities"
import { Base, Button, ButtonGroup, LinearProgressBlue, ProgressCell, TableCell } from "./style"

const useStyles = makeStyles(theme => ({
    category: {
        "&:hover .td-svg-button": {
            visibility: "visible"
        }
    },
    tdButton: {
        cursor: "pointer",
        "&:hover .td-svg-button": {
            color: "rgba(0, 0, 0, 0.7)"
        },
        [theme.breakpoints.down("sm")]: { paddingLeft: 10 }
    },
    svg: {
        width: 18,
        height: 18,
        color: "rgba(0, 0, 0, 0.4)",
        visibility: "hidden",
        transition: "color 0.3s",
        [theme.breakpoints.down("sm")]: {
            width: 24,
            height: 24,
            visibility: "visible"
        }
    },
    nullBorder: {
        borderBottom: 0
    },
    lastProgress: {
        paddingBottom: 5,
        borderBottom: "1px solid rgba(224, 224, 224, 1)"
    },
    lgTitle: {
        fontSize: 16
    },
    button: {
        [theme.breakpoints.down("sm")]: {
            paddingTop: 12,
            paddingBottom: 12
        }
    }
}))

const StatisticItem = React.memo(
    ({ amount, catid, cat_name, credits, target, ...otherProps }) => {
        const classes = useStyles()
        const { handleTargetEdit } = useContext(SimulatorPropsContext)

        const getPortion = (num, den) => Math.min(100, 100 * num / Math.max(1, den))
        const handleClick = () => handleTargetEdit(catid)

        const total = otherProps.hasOwnProperty("total")
        const rows = 1 + (target[0] !== null && 1) + (target[1] !== null && 1)

        return (
            <>
                <TableRow className={classes.category}>
                    <TableCell component="th" scope="row"
                        className={
                            clsx((rows === 1) ? null : classes.nullBorder,
                                total ? classes.lgTitle : null)
                        }>
                        {cat_name}
                    </TableCell>
                    <TableCell align="right" colSpan={total ? 2 : 1}
                        className={(rows === 1) ? null : classes.nullBorder}>
                        {target[0] ? `${credits}/${target[0]}` : credits}學分
                    </TableCell>
                    {
                        !total &&
                        <TableCell align="right"
                            className={(rows === 1) ? null : classes.nullBorder}>
                            {target[1] ? `${amount}/${target[1]}` : amount}門
                        </TableCell>
                    }
                    <TableCell rowSpan={rows} className={clsx(classes.tdButton)} onClick={handleClick}>
                        <Edit className={clsx("td-svg-button", classes.svg)} />
                    </TableCell>
                </TableRow>

                {
                    target[0] &&
                    <TableRow>
                        <ProgressCell colSpan="3" className={target[1] ? null : classes.lastProgress}>
                            <LinearProgressBlue variant="determinate" value={getPortion(credits, target[0])} />
                        </ProgressCell>
                    </TableRow>
                }
                {
                    target[1] &&
                    <TableRow>
                        <ProgressCell colSpan="3" className={classes.lastProgress}>
                            <LinearProgress color="secondary" variant="determinate" value={getPortion(amount, target[1])} />
                        </ProgressCell>
                    </TableRow>
                }
            </>
        )
    })

const StatisticsPanel = () => {
    const classes = useStyles()
    const { courses, handleLayoutArrangeOpen } = useContext(SimulatorPropsContext)
    const populateGroupedCategories = (cats, groups) => {
        let flag = true
        while (flag) {
            flag = false
            let cats_poped = []
            for (let cat of cats) {
                if (cat.startsWith("g")) {
                    flag = true
                    cats_poped = cats_poped.concat(groups[cat])
                }
                else
                    cats_poped.push(cat)
            }
            cats = cats_poped
        }
        return [...(new Set(cats))]
    }
    const getCourseAmount = (catids, content, groups, show_pending) => {
        const cats = populateGroupedCategories(catids, groups)
        const amounts = cats.map(catid => content[catid].filter(itemId => show_pending || courses[getRawCourseId(itemId)].levelScore !== ""))
        return amounts.reduce((prev, cur) => prev + cur.length, 0)
    }
    const getCourseCredits = (catids, content, groups, show_pending) => {
        const cats = populateGroupedCategories(catids, groups)
        const credits = cats.map(
            catid => content[catid]
                .filter(itemId => courses[getRawCourseId(itemId)].type !== "軍訓" && (show_pending || courses[getRawCourseId(itemId)].levelScore !== ""))
                .map(itemId => parseInt(itemId.match(/\$(\d+)/)?.[1] ?? courses[getRawCourseId(itemId)].cos_credit))
        )
        return credits.reduce((prev, cur) => prev + cur.reduce((p, c) => (p + c), 0), 0)
    }

    return (
        <Base>
            <ButtonGroup>
                <Button startIcon={<LowPriority />} className={classes.button}
                    onClick={handleLayoutArrangeOpen}>
                    調整類別顯示順序
                </Button>
            </ButtonGroup>

            <Table size="small" id="simulator-statistics-table">
                <TableBody>
                    <SimulatorContext.Consumer>
                        {
                            context => (
                                <>
                                    <StatisticItem total catid="total" cat_name="總學分" target={context.targets.total}
                                        credits={getCourseCredits(context.layout.filter(catid => !catid.startsWith("g")), context.content, context.groups, context.options.show_pending)} />
                                    {
                                        context.layout.map(catid => (
                                            <StatisticItem key={`statistics-panel-${catid}`} catid={catid}
                                                cat_name={context.cat_names[catid]} target={context.targets[catid]}
                                                amount={getCourseAmount([catid], context.content, context.groups, context.options.show_pending)}
                                                credits={getCourseCredits([catid], context.content, context.groups, context.options.show_pending)} />
                                        ))
                                    }
                                </>
                            )
                        }
                    </SimulatorContext.Consumer>
                </TableBody>
            </Table>
        </Base>
    )
}

export default React.memo(StatisticsPanel)