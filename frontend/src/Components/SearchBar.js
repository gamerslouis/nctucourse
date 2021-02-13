import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

const style = (theme) => ({
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    }
})

const SearchBar = ({ className, style, onChange, onSearch, classes, value }) =>
    <Paper className={className} style={{ display: 'flex', ...style }}>
        <InputBase
            className={classes.input}
            placeholder="課名/課號/老師"
            onKeyDown={(e) => { if (e.keyCode == 13) onSearch(e) }}
            onChange={onChange}
            value={value}
        />
        <div>
            <IconButton type="submit" aria-label="search" color="secondary"
                onClick={onSearch}>
                <SearchIcon />
            </IconButton>
        </div>
    </Paper>

export default withStyles(style)(SearchBar)