import { LinearProgress, makeStyles, Table, TableBody, TableRow } from "@material-ui/core"
import { Edit } from "@material-ui/icons"
import clsx from "clsx"
import React, { useContext } from "react"
import { SimulatorContext, SimulatorPropsContext } from "../../Context"
import { getRawCourseId } from "../../utilities"
import { Base, LinearProgressBlue, ProgressCell, TableCell } from "./style"

const useStyles = makeStyles(() => ({
    category: {
        "&:hover .td-svg-button": {
            visibility: "visible"
        }
    },
    tdButton: {
        cursor: "pointer",
        "&:hover .td-svg-button": {
            color: "rgba(0, 0, 0, 0.85)"
        }
    },
    svg: {
        width: 18,
        height: 18,
        color: "rgba(0, 0, 0, 0.6)",
        visibility: "hidden",
        transition: "color 0.3s"
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
    }
}))

const StatisticItem = React.memo(
    ({ amount, cat_name, credits, target, ...otherProps }) => {
        const classes = useStyles()
        const total = otherProps.hasOwnProperty("total")
        const getPortion = (num, den) => Math.min(100, 100 * num / Math.max(1, den))
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
                    <TableCell rowSpan={rows} className={classes.tdButton}>
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

const Statistics = () => {
    const { courses } = useContext(SimulatorPropsContext)
    const populateGroupedCategories = (cats, groups) => {
        let flag = true
        while (flag) {
            flag = false
            let cats_poped = []
            for (let cat of cats) {
                console.log(cat)
                if (cat.startsWith("g")) {
                    flag = true
                    cats_poped = cats_poped.concat(groups[cat])
                }
                else
                    cats_poped.push(cat)
            }
            cats = cats_poped
        }
        return cats
    }
    const getCourseAmount = (catids, content, groups, show_pending) => {
        const cats = populateGroupedCategories(catids, groups)
        const amounts = cats.map(catid => content[catid].filter(itemId => show_pending || courses[getRawCourseId(itemId)].state !== " "))
        return amounts.reduce((prev, cur) => prev + cur.length, 0)
    }
    const getCourseCredits = (catids, content, groups, show_pending) => {
        const cats = populateGroupedCategories(catids, groups)
        const credits = cats.map(
            catid => content[catid]
                .filter(itemId => show_pending || courses[getRawCourseId(itemId)].state !== " ")
                .map(itemId => parseInt(itemId.match(/\$(\d+)/)?.[1] ?? courses[getRawCourseId(itemId)].cos_credit))
        )
        return credits.reduce((prev, cur) => prev + cur.reduce((p, c) => (p + c), 0), 0)
    }

    return (
        <Base>
            <Table size="small">
                <TableBody>
                    <SimulatorContext.Consumer>
                        {
                            context => (
                                <>
                                    <StatisticItem total cat_name="總學分" target={context.targets.total}
                                        credits={getCourseCredits(Object.keys(context.categories), context.content, context.groups, context.options.show_pending)} />
                                    {
                                        context.layout.map(catid => (
                                            <StatisticItem key={`statistics_${catid}`}
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

export default React.memo(Statistics)