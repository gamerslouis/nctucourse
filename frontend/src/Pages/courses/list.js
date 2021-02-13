import React from 'react'
import { Container, Paper, Table, TableContainer, TableRow, TableCell, TableHead, TableBody, TablePagination, InputBase, Typography, Link } from '@material-ui/core'
import SearchBar from '../../Components/SearchBar'
import axios from 'axios'
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';

class CourseList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            page: 0,
            rows: [],
            count: []
        }
        this.updateContent = this.updateContent.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
    }

    componentDidMount() {
        this.updateContent()
    }

    async updateContent() {
        const query = new URLSearchParams(window.location.search);
        const search = query.get('search') || ''
        const page = parseInt(query.get('page')) || 1
        let res = await axios.get(`/api/courses/?limit=${10}&offset=${10 * (page - 1)}&search=${search}`)
        this.setState({
            search: search,
            page: page,
            rows: res.data.results,
            count: res.data.count,
        })
    }

    async handleSearch() {
        window.location.href = this.makePageUrl(1)
    }

    makePageUrl(i) {
        return `/courses?page=${i}&search=${this.state.search}`
    }

    render() {
        const { page, count, rows, search } = this.state
        return (
            <Container>
                <Typography variant="h4" gutterBottom >課程列表</Typography>
                <SearchBar style={{ marginBottom: 20 }} value={search} onChange={e => this.setState({ 'search': e.target.value })} onSearch={this.handleSearch} />
                <Paper>
                    <TableContainer className="table-responsive" >
                        <Table aria-label="simple table" style={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>學期</TableCell>
                                    <TableCell>課號</TableCell>
                                    <TableCell>課名</TableCell>
                                    <TableCell align="right">老師</TableCell>
                                    <TableCell align="right">時間</TableCell>
                                    <TableCell align="right">學分</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.id} hover style={{ cursor: "pointer" }}
                                        onClick={() => window.location.href = `/courses/${row.id}`}>
                                        <TableCell component="th" scope="row">
                                            {row.sem_name}
                                        </TableCell>
                                        <TableCell>{row.cos_id}</TableCell>
                                        <TableCell>
                                            <Link href={`/courses/${row.id}`} underline="none" color="textPrimary">
                                                {row.cname}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="right">{row.teacher_name}</TableCell>
                                        <TableCell align="right">{row.time}</TableCell>
                                        <TableCell align="right">{row.credit}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div style={{ width: 'fit-content', margin: '0 auto', padding: '10px 0' }}>
                        <Pagination
                            page={page}
                            count={Math.ceil(count / 10)}
                            renderItem={(item) => (
                                <PaginationItem
                                    component={Link}
                                    href={this.makePageUrl(item.page)}
                                    {...item}
                                />
                            )}
                        />
                    </div>
                </Paper>
            </Container >
        )
    }
}

export default CourseList