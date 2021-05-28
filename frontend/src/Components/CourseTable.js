import React from 'react';
import { Table, TableContainer, TableRow, TableCell, TableHead, TableBody } from '@material-ui/core';


const CourseTable = (props) => {
    const { courses, ...others } = props
    return <TableContainer className="table-responsive" {...others}>
        <Table size="small" aria-label="simple table" style={{ minWidth: 800 }}>
            <TableHead>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell>學期</TableCell>
                    <TableCell>課號</TableCell>
                    <TableCell>課名</TableCell>
                    <TableCell>學分</TableCell>
                    <TableCell>選別</TableCell>
                    <TableCell>百分成績</TableCell>
                    <TableCell>等級成績</TableCell>
                    <TableCell>任課老師</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {courses.map((row, idx) => (
                    <TableRow hover>
                        <TableCell style={{ fontSize: 12 }} component="th" scope="row">{idx + 1}</TableCell>
                        <TableCell style={{ fontSize: 12 }}>{row.sem}</TableCell>
                        <TableCell style={{ fontSize: 12 }}>{row.id}</TableCell>
                        <TableCell style={{ fontSize: 12 }}>{row.cos_cname}</TableCell>
                        <TableCell style={{ fontSize: 12 }}>{row.cos_credit}</TableCell>
                        <TableCell style={{ fontSize: 12 }}>{row.type}</TableCell>
                        <TableCell style={{ fontSize: 12 }}>{row.score}</TableCell>
                        <TableCell style={{ fontSize: 12 }}>{row.levelScore}</TableCell>
                        <TableCell style={{ fontSize: 12 }}>{row.teacher}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
}

export default CourseTable