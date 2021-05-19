import { Divider, Paper, Typography, withStyles } from '@material-ui/core'
import { Link, MoreVert } from '@material-ui/icons'
import React from 'react'

const styles = theme => ({
  root: {
    margin: '4px 6px',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    userSelect: 'none'
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
const color_other = '#fab9f8'

const getSemester = (sem) => {
  switch (sem) {
    case '1':
      return '上'
    case '2':
      return '下'
    default:
      return '暑'
  }
}

const Course = ({ altCredit, classes, detailed, isClone, item, setAnchor, ...others }) => {
  return (
    <Paper className={classes.root} {...others} style={{ background: item.sem === '' ? color_other : colors[parseInt(item.sem.substr(0, 3)) % 6] }}>
      <div className={classes.content}>
        <Typography variant='subtitle2' style={{ overflowX: 'wrap', flexGrow: 1 }}>
          {item.cos_cname}&nbsp;
        </Typography>
        <div style={{ display: 'flex', flexShrink: 0, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
          {isClone && <Link />}
          <Typography variant='subtitle2'>{altCredit !== null ? altCredit : item.cos_credit}學分</Typography>
        </div>
        {
          setAnchor &&
          <>
            <Divider className={classes.vertHR} orientation="vertical" flexItem />
            <MoreVert className={classes.spanClick} onClick={evt => setAnchor(evt.currentTarget)} />
          </>
        }
      </div>
      {
        detailed &&
        <>
          <Divider />
          <div className={classes.detail}>
            <span>{item.sem !== '' && item.sem.substr(0, 3) + getSemester(item.sem.slice(3)) + ' - '}{item.id}</span>
            <span>{item.sem === '' ? '學分抵免' : item.teacher.replaceAll(';', '、') + ' - ' + item.dep}</span>
          </div>
        </>
      }
    </Paper>
  )
}

export default withStyles(styles)(React.memo(Course, (prev, next) => (
  prev.detailed === next.detailed
  && prev.item.sem === next.item.sem
  && prev.item.id === next.item.id
  && prev.isClone === next.isClone
  && prev.altCredit === next.altCredit
)))