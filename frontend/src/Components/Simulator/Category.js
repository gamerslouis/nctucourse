import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import Course from './Course'
import { Divider, Paper, Typography, withStyles } from '@material-ui/core'

const styles = theme => ({
  root: {
    width: '100%',
    margin: `${theme.spacing(1)}px 0px`
  },
  content: {
    minHeight: '80px',
    marginTop: `${theme.spacing(1)}px`,
    background: '#fafafa'
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  }
})

const propCmp = (prev, next) => {
  if (prev.loading !== next.loading)
    return false
  if (prev.catIdx !== next.catIdx)
    return false
  if (prev.cname !== next.cname)
    return false
  if (prev.controlFlag !== next.controlFlag)
    return false
  if (prev.contentKey.length !== next.contentKey.length || !prev.contentKey.every((val, idx) => (val === next.contentKey[idx])))
    return false
  return true
}

const filter = (item, controlFlag) => {
  if (item.state === ' ')
    return (controlFlag & 0b1) > 0
  if (item.cos_credit === 0 && ((item.type === '必修' && !item.cos_cname.startsWith('服務學習') && item.dimension !== '藝文賞析') || item.type === '選修'))
    return (controlFlag & 0b10) > 0
  return true
}

const getAltCredit = (itemId) => {
  if (itemId.indexOf('$') !== -1)
    return parseInt(itemId.substr(itemId.indexOf('$') + 1))
  return null
}

const Category = ({ catIdx, classes, cname, content, contentKey, controlFlag, id, loading, setAnchor }) => {
  const content_filtered = loading ? [] : content.filter(item => filter(item, controlFlag))
  const credits = content_filtered.reduce((accu, cur) => (accu + cur.cos_credit), 0)
  return (
    <div className={classes.root} id={id}>
      <div className={classes.title}>
        <Typography variant='h6'>{cname}</Typography>
        <Typography variant='subtitle1'>{loading ? 0 : content.filter(item => (item.state !== ' ' || (controlFlag & 0b1) > 0)).length}門 - {credits}學分</Typography>
      </div>
      <Divider />
      {
        <Paper className={classes.content} variant="outlined">
          <Droppable droppableId={'cat_' + catIdx} type='COURSE'>
            {
              (provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: '80px' }}>
                  {
                    !loading &&
                    content.map((item, idx) => (
                      filter(item, controlFlag) &&
                      <Draggable key={idx} index={idx} draggableId={`cat_${catIdx}_` + idx} type='COURSE'>
                        {
                          (provided, snapshot) => (
                            <div style={provided.draggableProps.style} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                              <Course item={item} altCredit={getAltCredit(contentKey[idx])}
                                detailed={(controlFlag & 0b1000) > 0} isClone={contentKey[idx].startsWith('@')}
                                setAnchor={anchor => setAnchor(anchor, idx, contentKey[idx])} />
                            </div>
                          )
                        }
                      </Draggable>
                    ))
                  }
                  {provided.placeholder}
                </div>
              )
            }
          </Droppable>
        </Paper>
      }
    </div>
  )
}

export default withStyles(styles)(React.memo(Category, propCmp))
