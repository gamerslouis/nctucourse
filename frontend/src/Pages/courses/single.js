import React, { useState, useEffect } from 'react'
import useAxios from 'axios-hooks'
import { Container, Paper, Table, TableContainer, TableRow, TableCell, TableHead, TableBody, TablePagination, InputBase, Typography, Link } from '@material-ui/core'

const CoursePage = (props) => {
    let url = `/api/courses/${props.match.params.cid}`
    const [{ data, loading, error }, refetch] = useAxios(url)

    if (data == undefined)
        return <div />

    return (
        <Container>
            <Typography variant="h4" gutterBottom >{data.cname}</Typography>

        </Container>
    )


}

export default CoursePage