import { Divider, Paper, Tooltip, Typography, withStyles } from '@material-ui/core'
import { Link, MoreVert } from '@material-ui/icons'
import React from 'react'

const styles = theme => ({
  root: {
    margin: '4px 6px',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    columnGap: `${theme.spacing(2)}px`,
    padding: `${theme.spacing(0.5)}px 0px`
  },
  detail: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: '12px'
  },
  vertHR: {
    flexShrink: 0,
    margin: '0px -8px'
  },
  spanClick: {
    color: 'rgba(0, 0, 0, 0.5)',
    cursor: 'pointer',
    alignSelf: 'center',
    flexShrink: 0,
    '&:hover': {
      color: 'rgba(0, 0, 0, 0.75)'
    }
  }
})

const colors = ['#ef9a9a', '#a5d6a7', '#b39ddb', '#fff59d', '#ffab91', '#9fa8da']

const Course = ({ classes, clone, detailed, isClone, item, setAnchor, ...others }) => {
  return (
    <Paper className={classes.root} {...others} style={{ background: colors[parseInt(item.sem.substr(0, 3)) % 6] }}>
      <div className={classes.content}>
        <Typography variant='subtitle2' style={{ overflowX: 'wrap', flexGrow: 1 }}>{item.cos_cname}</Typography>
        <Typography variant='subtitle2' style={{ flexShrink: 0, alignSelf: 'flex-end' }}>{item.cos_credit}學分</Typography>
        {
          !isClone && setAnchor &&
          <>
            <Divider className={classes.vertHR} orientation="vertical" flexItem />
            <MoreVert className={classes.spanClick} onClick={evt => setAnchor(evt.currentTarget)} />
          </>
        }
        {
          isClone &&
          <>
            <Divider className={classes.vertHR} orientation="vertical" flexItem />
            <Tooltip title='將這份複製拖曳至未分類課程即可移除！'>
              <Link style={{ flexShrink: 0, alignSelf: 'center' }} />
            </Tooltip>
          </>
        }
      </div>
      {
        detailed &&
        <>
          <Divider />
          <div className={classes.detail}>
            <span>{item.sem.substr(0, 3)}{item.sem.slice(3) === '1' ? '上' : '下'} - {item.id}</span>
            <span>{item.teacher.replaceAll(';', '、')} - {item.dep}</span>
          </div>
        </>
      }
    </Paper>
  )
}

export default withStyles(styles)(React.memo(Course, (prev, next) => (prev.detailed === next.detailed && prev.item.sem === next.item.sem && prev.item.id === next.item.id)))