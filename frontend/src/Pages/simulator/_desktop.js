import React from 'react'
import axios from 'axios'
import { Button, Collapse, Divider, FormControlLabel, IconButton, Menu, MenuItem, Paper, Switch, Typography, withStyles } from '@material-ui/core';
import { Cancel, Clear, DragHandle, Edit, Info, KeyboardArrowDown, Link, MoreVert, Warning } from '@material-ui/icons';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Category from './_Components/Category'
import Course from './_Components/Course'
import { DialogAdjustCopy, DialogConfirm, DialogRemoveCategory, DialogRenameCategory, DialogStatisticsSetting, DialogTutor } from './_Components/Dialogs';
import Statistics from './_Components/Statistics';

axios.defaults.withCredentials = true

const style = theme => ({
  root: {
    margin: '0 auto',
    width: '100%',
    maxWidth: '1920px'
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    columnGap: `${theme.spacing(2)}px`,
    width: '100%',
    padding: `0px ${theme.spacing(3)}px`,
    marginBottom: '10px',
    maxHeight: 'calc(100vh - 140px)'
  },
  controls: {
    flexDirection: 'column',
    width: '360px',
    flexShrink: '0',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    userSelect: 'none',
    overflowY: 'auto'
  },
  main: {
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'space-around',
    columnGap: `${theme.spacing(1)}px`,
    flexGrow: 1,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    overflowY: 'auto'
  },
  ctxColumn: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    alignItems: 'center',
    width: '320px',
    rowGap: `${theme.spacing(2)}px`
  },
  infocard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: `${theme.spacing(1.5)}px`,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    fontWeight: 'bold',
    fontSize: '16px'
  },
  collapseControl: {
    display: 'flex',
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer'
  },
  spanClick: {
    color: 'rgba(0, 0, 0, 0.5)',
    cursor: 'pointer',
    '&:hover': {
      color: 'rgba(0, 0, 0, 0.75)'
    }
  }
})

const SaveButton = withStyles(theme => ({
  root: {
    color: '#8A6D3B',
    padding: '2px',
    fontWeight: '500',
    minWidth: '40px'
  }
}))(Button)

class Desktop extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mainColumn: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      subColumns: [],
      loading: true
      ,
      controlFlag: 6,
      categories: ['必修', '選修', '通識 ─ 核心人文', '通識 ─ 核心社會', '通識 ─ 核心自然', '通識 ─ 跨院', '通識 ─ 校基本', '外語', '體育', '服務學習', '藝文賞析'],
      data: { 'unused': [], '必修': [], '選修': [], '通識 ─ 核心人文': [], '通識 ─ 核心社會': [], '通識 ─ 核心自然': [], '通識 ─ 跨院': [], '通識 ─ 校基本': [], '外語': [], '體育': [], '服務學習': [], '藝文賞析': [] },
      targets: { '通識_core': '6;0', '通識_total': '18;0', '通識 ─ 跨院': '2;0', '通識 ─ 校基本': '6;0', '體育': '0;6', '服務學習': '0;2', '藝文賞析': '0;2' },
      courses: {}
      ,
      dialogDisclaimer: false,
      dialogRemoveCategory: false,
      dialogRenameCategory: false,
      dialogStatisticsSetting: false,
      dialogAdjustCopy: false,
      dialogCategoryTarget: -1,
      collapseImportSuccess: false,
      collapseUnsavedChange: false,
      collapseStatistics: false,
      collapseSettings: false,
      collapseCategories: false
      ,
      tutorIdx: 0,
      menuAnchor: null,
      menuAnchorCategory: null,
      menuAnchorIdx: null,
      menuAnchorItemId: null
    }

    this.getCourse = this.getCourse.bind(this)
    this.getStatisticCompound = this.getStatisticCompound.bind(this)
  }

  balanceColumns() {
    return new Promise((resolv, reject) => {
      const colCnt = Math.max(Math.floor((document.getElementById('mainCtx').getBoundingClientRect().width - 32) / 353), 1)
      const catHeights = this.state.categories.map((cat, idx) => {
        return (document.getElementById('cat_' + idx).getBoundingClientRect().height)
      })
      const cols = new Array(colCnt).fill(0).map(_ => [])
      const colHeight = new Array(colCnt).fill(0)
      for (let cat = 0; cat < this.state.categories.length; cat++) {
        let min_height = colHeight[0] + catHeights[cat]
        let best = 0
        for (let col = 1; col < colCnt; col++) {
          if (colHeight[col] + catHeights[cat] < min_height) {
            min_height = colHeight[col] + catHeights[cat]
            best = col
          }
        }
        cols[best].push(cat)
        colHeight[best] += catHeights[cat]
      }
      this.setState({
        mainColumn: cols[0],
        subColumns: cols.slice(1)
      }, resolv)
    })
  }

  componentDidMount() {
    this.balanceColumns()
    window.addEventListener('resize', evt => {
      this.balanceColumns()
    })
    window.addEventListener('beforeunload', evt => {
      if (this.state.collapseUnsavedChange) {
        const msg = '變更尚未保存！'
        evt.returnValue = msg
        return msg
      }
    })

    axios.post(`${process.env.REACT_APP_HOST}/api/accounts/sim_data`).then(res => res.data)
      .then(json => {
        if (!json.success || json.data === '') {
          // requestConfirm
          this.setState({ dialogDisclaimer: true })
        }
        else {
          const { data, last_updated_time } = json
          this.setUserData(JSON.parse(data), last_updated_time)
        }
      })
  }

  setUserData(data, last_updated_time) {
    const mainColumn = this.state.mainColumn.slice()
    for (let extraCat = 11; extraCat < data.categories.length; extraCat++)
      mainColumn.push(extraCat)
    this.setState({ mainColumn, ...data }, () => {
      this.checkShouldUpdate(last_updated_time)
    })
  }

  checkShouldUpdate(last_import_time = '') {
    axios.get(`${process.env.REACT_APP_HOST}/api/accounts/courses_history`).then(res => res.data).then(json => {
      const { data, last_updated_time } = json
      const course_list = JSON.parse(data)
      const course_map = {}
      course_list.forEach(item => {
        course_map[item.sem + '_' + item.id] = item
      })

      this.setState({
        courses: course_map
      })

      if (last_import_time !== last_updated_time) {
        this.updateImport(course_list, last_updated_time)
      }
      else {
        this.setState({
          loading: false,
          dialogDisclaimer: false
        }, this.balanceColumns)
      }
    })
  }

  copyData() {
    const data = {}
    for (let cat in this.state.data)
      data[cat] = this.state.data[cat].slice()
    return data
  }

  updateImport(course_list, last_updated_time) {
    axios.post(`${process.env.REACT_APP_HOST}/api/accounts/sim_imported`).then(res => res.data)
      .then(async json => {
        const { imported_courses } = json
        let imported = imported_courses === '' ? [] : JSON.parse(imported_courses)
        const history = course_list.filter(item => (
          item.scoreType === '通過不通過'
            ? item.score === '通過'
            : item.scoreType === '抵免' || (item.state === ' ' || (item.score !== 'W' && item.score >= 60))
        ))
        if (this.state.categories.indexOf('軍訓') === -1 && history.filter(item => (item.type === '軍訓')).length > 0)
          await this.addCategory('軍訓')
        const data = this.copyData()

        const historyIds = history.map(item => { return item.sem + '_' + item.id })
        const shouldRemove = imported.filter(id => historyIds.indexOf(id) === -1)
        for (let cat in data) {
          data[cat] = data[cat].filter(itemId => shouldRemove.indexOf(this.getRowCourseId(itemId)) === -1)
        }
        imported = imported.filter(id => historyIds.indexOf(id) !== -1)

        for (let i = 0; i < history.length; i++) {
          const item = history[i]
          const itemId = item.sem + '_' + item.id
          if (imported.indexOf(itemId) !== -1)
            continue
          imported.push(itemId)
          if (item.type === '外語' && data.hasOwnProperty('外語')) {
            data['外語'].push(itemId)
          }
          else if (item.type === '選修' && data.hasOwnProperty('選修')) {
            data['選修'].push(itemId)
          }
          else if (item.type === '軍訓' && data.hasOwnProperty('軍訓')) {
            data['軍訓'].push(itemId)
          }
          else if (item.cos_cname.startsWith('服務學習')) {
            data['服務學習'].push(itemId)
          }
          else if (item.dimension === '藝文賞析') {
            data['藝文賞析'].push(itemId)
          }
          else if (item.type === '體育') {
            data['體育'].push(itemId)
          }
          else if (item.type === '必修') {
            data['必修'].push(itemId)
          }
          else if (item.type === '通識') {
            switch (item.dimension) {
              case '核心-人文':
                data['通識 ─ 核心人文'].push(itemId)
                break
              case '核心-社會':
                data['通識 ─ 核心社會'].push(itemId)
                break
              case '核心-自然':
                data['通識 ─ 核心自然'].push(itemId)
                break
              case '跨院基本素養':
                data['通識 ─ 跨院'].push(itemId)
                break
              case '校基本素養':
              default:
                data['通識 ─ 校基本'].push(itemId)
                break
            }
          }
          else {
            data['unused'].push(itemId)
          }
        }

        this.setState({ data, collapseImportSuccess: true }, () => {
          Promise.all([this.sync2Server(imported, last_updated_time), this.balanceColumns()]).then(_ => {
            if (this.state.tutorIdx === -1)
              this.tutorNext()
          })
        })
      })
  }

  sync2Server(imported_courses = undefined, last_updated_time = undefined) {
    return new Promise((resolv, reject) => {
      const data = {}
      data['data'] = JSON.stringify({
        controlFlag: this.state.controlFlag,
        data: this.state.data,
        targets: this.state.targets,
        categories: this.state.categories
      })
      if (imported_courses)
        data['imported_courses'] = JSON.stringify(imported_courses)
      if (last_updated_time)
        data['last_updated_time'] = last_updated_time
      axios.post(`${process.env.REACT_APP_HOST}/api/accounts/sim_update`, data).then(res => {
        this.setState({
          loading: false,
          dialogDisclaimer: false,
          collapseUnsavedChange: false
        }, resolv)
      })
    })
  }

  addCategory(name) {
    const mainColumn = this.state.mainColumn.slice()
    const categories = this.state.categories.slice()
    const data = this.copyData()
    const newCatId = categories.length
    mainColumn.push(newCatId)
    categories.push(name)
    data[name] = []
    return new Promise(resolv => {
      this.setState({ mainColumn, categories, data, collapseUnsavedChange: true }, () => {
        this.balanceColumns()
        resolv()
      })
    })
  }

  removeCategory(idx) {
    const cname = this.state.categories[idx]
    const mainColumn = []
    for (let i = 0; i < this.state.mainColumn.length; i++)
      if (this.state.mainColumn[i] !== idx)
        mainColumn.push(this.state.mainColumn[i] > idx ? this.state.mainColumn[i] - 1 : this.state.mainColumn[i])
    const subColumns = []
    for (let j = 0; j < this.state.subColumns.length; j++) {
      const subColumn = this.state.subColumns[j]
      const newSubColumn = []
      for (let i = 0; i < subColumn.length; i++)
        if (subColumn[i] !== idx)
          newSubColumn.push(subColumn[i] > idx ? subColumn[i] - 1 : subColumn[i])
      subColumns.push(newSubColumn)
    }
    const categories = this.state.categories.slice()
    categories.splice(idx, 1)
    const data = this.copyData()
    data['unused'].splice(data['unused'].length, 0, ...data[cname])
    delete data[cname]
    this.setState({ mainColumn, subColumns, categories, data, collapseUnsavedChange: true, dialogRemoveCategory: false, dialogCategoryTarget: -1 }, this.balanceColumns)
  }

  controlFilter(item) {
    if (item.state === ' ')
      return (this.state.controlFlag & 0b1) > 0
    if (item.cos_credit === 0 && ((item.type === '必修' && !item.cos_cname.startsWith('服務學習') && item.dimension !== '藝文賞析') || item.type === '選修'))
      return (this.state.controlFlag & 0b10) > 0
    return true
  }

  onDragEnd(result) {
    if (result.destination) {
      const from = result.source.droppableId
      const to = result.destination.droppableId
      const fromIdx = result.source.index
      const toIdx = result.destination.index
      if ((from === 'categories') && (to === 'categories')) {
        const categories = this.state.categories.slice()
        const [item] = categories.splice(fromIdx, 1)
        categories.splice(toIdx, 0, item)
        this.setState({ categories }, this.balanceColumns)
      }
      else if ((from !== 'categories') && (to !== 'categories')) {
        let fromCat = from.slice(4)
        let toCat = to.slice(4)
        const data = this.copyData()

        const [item] = data[fromCat === 'unused' ? 'unused' : this.state.categories[parseInt(fromCat)]].splice(fromIdx, 1)

        if (!(item.startsWith('@') && (toCat === 'unused')))
          data[toCat === 'unused' ? 'unused' : this.state.categories[parseInt(toCat)]].splice(toIdx, 0, item)

        this.setState({ data, collapseUnsavedChange: true }, () => {
          if ((this.state.controlFlag & 0b100) > 0)
            this.balanceColumns()
        })
      }
    }
  }

  getTutorText() {
    const tutorIdx = this.state.tutorIdx
    if (tutorIdx === 1) {
      return (
        <>
          <Typography style={{ marginBottom: '12px', fontSize: '1.15rem' }}><strong>主操作區域</strong></Typography>
          <Typography style={{ marginBottom: '6px' }}>主操作區域包含左下方的<strong>未分類課程</strong>以及整個右側區域</Typography>
          <Typography style={{ marginBottom: '20px' }}>在課程資料載入完成後你可以拖曳來將一門課程移動至其他分類</Typography>
          <Typography style={{ marginBottom: '6px', fontSize: '1.08rem' }}><strong>複製課程</strong></Typography>
          <Typography style={{ marginBottom: '12px' }}>某些情況下，你可能會希望一門課程出現在兩個分類中</Typography>
          <Typography style={{ marginBottom: '3px' }}><strong>情況(一)</strong> ─ 某門軍訓同時能算做軍訓和服務學習</Typography>
          <Typography style={{ marginBottom: '3px' }}>點擊課程右方的<MoreVert style={{ display: 'inline-block', verticalAlign: 'bottom' }} />可以複製課程</Typography>
          <Typography style={{ marginBottom: '12px' }}>複製的課程會用<Link style={{ display: 'inline-block', verticalAlign: 'bottom' }} />來標記，拖曳至未分類課程即可移除</Typography>
          <Typography style={{ marginBottom: '3px' }}><strong>情況(二)</strong> ─ 某科系的4學分物理算做3學分的必修和1學分的選修</Typography>
          <Typography style={{ marginBottom: '6px' }}>點擊已複製課程右方的<MoreVert style={{ display: 'inline-block', verticalAlign: 'bottom' }} />可以調整這份複製所要顯示的學分</Typography>
        </>
      )
    }
    else if (tutorIdx === 2) {
      return (
        <>
          <Typography style={{ marginBottom: '12px', fontSize: '1.15rem' }}><strong>設定</strong> 選單</Typography>
          <Typography style={{ marginBottom: '8px' }}>這裡有一些較為進階的選項讓你自訂</Typography>
          <Typography style={{ marginBottom: '3px' }}>你可以選擇隱藏0學分的必選修</Typography>
          <Typography style={{ marginBottom: '6px' }}>如果你覺得自動平衡很惱人的話也可以在這關掉它</Typography>
        </>
      )
    }
    else if (tutorIdx === 3) {
      return (
        <>
          <Typography style={{ marginBottom: '12px', fontSize: '1.15rem' }}><strong>學分分類</strong> 選單</Typography>
          <Typography style={{ marginBottom: '6px' }}>在這裡可以編輯你的學分分類</Typography>
          <Typography style={{ marginBottom: '6px' }}>點擊下方的<strong>新增類別</strong>文字來增加一個分類</Typography>
          <Typography style={{ marginBottom: '6px' }}>點選分類右方的<Edit style={{ display: 'inline-block', verticalAlign: 'bottom' }} /><Clear style={{ display: 'inline-block', verticalAlign: 'bottom' }} />圖示來修改/移除分類</Typography>
          <Typography style={{ marginBottom: '6px' }}>按住分類左方的<DragHandle style={{ display: 'inline-block', verticalAlign: 'bottom' }} />圖示可以拖曳來變更順序</Typography>
        </>
      )
    }
    else if (tutorIdx === 4) {
      return (
        <>
          <Typography style={{ marginBottom: '12px', fontSize: '1.15rem' }}><strong>統計資料</strong> 選單</Typography>
          <Typography style={{ marginBottom: '6px' }}>在這裡你可以輕鬆的察看自己各類別的學分/門數</Typography>
          <Typography style={{ marginBottom: '6px' }}>點擊選單中右上角的齒輪可以開啟<strong>目標設定對話框</strong>，設定各個類別的目標學分/門數</Typography>
          <Typography style={{ marginBottom: '6px' }}>有設定目標的類別將會在選單中顯示目標以及進度條</Typography>
          <Typography style={{ marginBottom: '6px' }}>軍訓學分不會被計算在總學分中</Typography>
        </>
      )
    }
  }

  tutorNext() {
    const tutorIdx = this.state.tutorIdx
    if (tutorIdx <= 0) {
      this.setState({
        tutorIdx: 4,
        collapseStatistics: true,
        collapseCategories: false,
        collapseSettings: false
      })
    }
    else if (tutorIdx === 1) {
      this.setState({
        tutorIdx: 0
      })
    }
    else if (tutorIdx === 2) {
      this.setState({
        tutorIdx: 1,
        collapseStatistics: false,
        collapseCategories: false,
        collapseSettings: false
      })
    }
    else if (tutorIdx === 3) {
      this.setState({
        tutorIdx: 2,
        collapseStatistics: false,
        collapseCategories: false,
        collapseSettings: true
      })
    }
    else if (tutorIdx === 4) {
      this.setState({
        tutorIdx: 3,
        collapseStatistics: false,
        collapseCategories: true,
        collapseSettings: false
      })
    }
  }

  getCourse(itemId) {
    return this.state.courses[this.getRowCourseId(itemId)]
  }

  getRowCourseId(itemId) {
    if (itemId.startsWith('@')) {
      if (itemId.indexOf('$') !== -1) {
        return itemId.substr(1, itemId.indexOf('$') - 1)
      }
      return itemId.substr(1)
    }
    return itemId
  }

  getStatisticCompound(itemId) {
    const course = this.getCourse(itemId)
    const credit = itemId.indexOf('$') !== -1 ? parseInt(itemId.substr(itemId.indexOf('$') + 1)) : course.cos_credit
    return {
      credit: credit,
      type: course.type,
      state: course.state,
      cos_credit: course.cos_credit,
      cos_cname: course.cos_cname,
      dimension: course.dimension
    }
  }

  toggleFlag(checked, flagPos, shouldBalance) {
    const mask = 1 << flagPos
    this.setState({ controlFlag: (this.state.controlFlag & (~mask)) | (checked ? mask : 0), collapseUnsavedChange: true },
      () => {
        if (shouldBalance && (this.state.controlFlag & 0b100))
          this.balanceColumns()
      })
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <DialogTutor next={() => this.tutorNext()} tutorIdx={this.state.tutorIdx}>{this.getTutorText()}</DialogTutor>
        <DialogConfirm open={this.state.dialogDisclaimer} onClose={() => {
          axios.post(`${process.env.REACT_APP_HOST}/api/accounts/sim_confirm`, {}).then(res => {
            this.setState({ tutorIdx: -1 }, this.checkShouldUpdate)
          })
        }} />
        <DialogRenameCategory open={this.state.dialogRenameCategory} cname={this.state.categories[this.state.dialogCategoryTarget]}
          onClose={() => this.setState({ dialogRenameCategory: false, dialogCategoryTarget: -1 })}
          check={newName => (this.state.categories.some(cname => cname === newName))}
          rename={newName => {
            const oldName = this.state.categories[this.state.dialogCategoryTarget]
            const categories = this.state.categories.slice()
            categories.splice(this.state.dialogCategoryTarget, 1, newName)
            const data = this.copyData()
            data[newName] = data[oldName].slice()
            delete data[oldName]
            if (this.state.targets[oldName]) {
              const targets = { ...this.state.targets }
              targets[newName] = this.state.targets[oldName]
              delete targets[oldName]
              this.setState({
                dialogRenameCategory: false,
                dialogCategoryTarget: -1,
                categories, data, targets,
                collapseUnsavedChange: true
              })
            }
            else
              this.setState({
                dialogRenameCategory: false,
                dialogCategoryTarget: -1,
                categories, data,
                collapseUnsavedChange: true
              })
          }} />
        <DialogRemoveCategory open={this.state.dialogRemoveCategory} cname={this.state.categories[this.state.dialogCategoryTarget]}
          onClose={() => this.setState({ dialogRemoveCategory: false, dialogCategoryTarget: -1 })}
          remove={() => this.removeCategory(this.state.dialogCategoryTarget)} />
        <DialogStatisticsSetting open={this.state.dialogStatisticsSetting} onClose={() => this.setState({ dialogStatisticsSetting: false })}
          categories={this.state.categories} targets={this.state.targets} setTargets={targets => this.setState({ targets, collapseUnsavedChange: true })} />
        <DialogAdjustCopy open={this.state.dialogAdjustCopy}
          defaultCredit={
            this.state.menuAnchorIdx
              ? this.state.menuAnchorItemId.indexOf('$') !== -1
                ? parseInt(this.state.menuAnchorItemId.substr(this.state.menuAnchorItemId.indexOf('$') + 1))
                : this.getCourse(this.state.menuAnchorItemId).cos_credit
              : 0
          }
          onClose={() => this.setState({ dialogAdjustCopy: false, menuAnchor: null, menuAnchorCategory: null, menuAnchorIdx: null })}
          setCredit={credit => {
            const contentKey = this.state.data[this.state.menuAnchorCategory].slice()
            const originalCredit = this.getCourse(this.state.menuAnchorItemId).cos_credit
            let itemId = this.state.menuAnchorItemId
            if (!itemId.startsWith('@'))
              itemId = '@' + itemId
            if (itemId.indexOf('$') !== -1)
              itemId = itemId.substr(0, itemId.indexOf('$'))
            contentKey.splice(this.state.menuAnchorIdx, 1, credit === originalCredit ? itemId : `${itemId}$${credit}`)
            const data = this.copyData()
            data[this.state.menuAnchorCategory] = contentKey
            this.setState({ data, collapseUnsavedChange: true, dialogAdjustCopy: false, menuAnchor: null, menuAnchorCategory: null, menuAnchorIdx: null })
            console.log(contentKey)
          }} />

        <Menu anchorEl={this.state.menuAnchor} open={Boolean(this.state.menuAnchor)}
          onClose={() => this.setState({ menuAnchor: null, menuAnchorCategory: null, menuAnchorIdx: null })} keepMounted>
          {
            this.state.menuAnchorItemId &&
            <div>
              {
                navigator.clipboard &&
                <MenuItem onClick={() => {
                  navigator.clipboard.writeText(this.getCourse(this.state.menuAnchorItemId).cos_cname)
                  this.setState({ menuAnchor: null, menuAnchorCategory: null, menuAnchorIdx: null })
                }}>複製課程名稱</MenuItem>
              }
              {
                this.state.menuAnchorItemId.startsWith('@')
                  ?
                  <>
                    <MenuItem onClick={() => {
                      const contentKey = this.state.data[this.state.menuAnchorCategory].slice()
                      contentKey.splice(this.state.menuAnchorIdx, 1)
                      const data = this.copyData()
                      data[this.state.menuAnchorCategory] = contentKey
                      this.setState({ data, collapseUnsavedChange: true, menuAnchor: null, menuAnchorCategory: null, menuAnchorIdx: null })
                    }}>移除這份複製</MenuItem>
                    <MenuItem onClick={() => {
                      this.setState({ dialogAdjustCopy: true })
                    }}>調整這份複製顯示的學分</MenuItem>
                  </>
                  :
                  <MenuItem onClick={() => {
                    const contentKey = this.state.data[this.state.menuAnchorCategory].slice()
                    const itemId = this.state.menuAnchorItemId
                    contentKey.splice(this.state.menuAnchorIdx + 1, 0, itemId.startsWith('@') ? itemId : ('@' + itemId))
                    const data = this.copyData()
                    data[this.state.menuAnchorCategory] = contentKey
                    this.setState({ data, collapseUnsavedChange: true, menuAnchor: null, menuAnchorCategory: null, menuAnchorIdx: null })
                  }}>在這裡複製一份</MenuItem>
              }
            </div>
          }
        </Menu>

        <div className={classes.content}>
          <DragDropContext onDragEnd={res => this.onDragEnd(res)}>
            <Paper className={classes.controls}>   {/* Control Panel */}

              <div style={{
                border: (this.state.tutorIdx === 4 ? '2px solid red' : '0px solid white'), transition: 'border-color 2s', borderRadius: '.5rem'
              }}>
                <Typography variant='h5' style={{ width: 'fit-content', display: 'inline' }}>學分模擬器 (Beta)</Typography>
              </div>
              <Divider style={{ margin: '8px 0px' }} />

              <Collapse in={this.state.collapseImportSuccess}>
                <Paper variant='outlined' style={{ background: '#D9EDF7', color: '#31708F' }} className={classes.infocard}>
                  <Info /><span style={{ marginLeft: '12px', flexGrow: 1 }}>成功匯入新資料！</span>
                  <IconButton color="primary" style={{ padding: '2px' }} onClick={evt => this.setState({ collapseImportSuccess: false })}>
                    <Cancel />
                  </IconButton>
                </Paper>
              </Collapse>
              <Collapse in={this.state.collapseUnsavedChange}>
                <Paper variant='outlined' style={{ background: '#FCF8E3', color: '#8A6D3B' }} className={classes.infocard}>
                  <Warning /><span style={{ marginLeft: '12px', flexGrow: 1 }}>有未儲存的變更</span>
                  <SaveButton onClick={evt => {
                    this.sync2Server()
                  }}>儲存</SaveButton>
                </Paper>
              </Collapse>

              <div style={{ border: (this.state.tutorIdx === 4 ? '2px solid red' : '0px solid white'), transition: 'border-color 2s', borderRadius: '.5rem' }}>
                <div className={classes.collapseControl} onClick={evt => this.setState({ collapseStatistics: !this.state.collapseStatistics })}>
                  <Typography variant='h6'>統計資料</Typography>
                  <KeyboardArrowDown style={{ transform: `rotate(${this.state.collapseStatistics ? -180 : 0}deg)`, transition: 'transform 0.3s' }} />
                </div>
                <Collapse in={this.state.collapseStatistics} style={{ padding: '0px 16px' }}>
                  <Statistics openDialog={evt => this.setState({ dialogStatisticsSetting: true })}
                    loading={this.state.loading}
                    categories={this.state.categories} targets={this.state.targets}
                    contents={
                      this.state.loading ? {} :
                        this.state.categories.reduce((cont, cat) => {
                          cont[cat] = this.state.data[cat].map(this.getStatisticCompound)
                          return cont
                        }, {})
                    }
                    showAllState={(this.state.controlFlag & 0b1) > 0} />
                </Collapse>
              </div>
              <Divider style={{ margin: '8px 0px' }} />

              <Button variant='contained' color='primary' href="/gpa/import?redir=simulator" fullWidth>匯入歷史成績</Button>
              <Divider style={{ margin: '8px 0px' }} />

              {/* Category Settings */}
              <div style={{ border: (this.state.tutorIdx === 3 ? '2px solid red' : '0px solid white'), transition: 'border-color 2s', borderRadius: '.5rem' }}>
                <div className={classes.collapseControl} onClick={evt => this.setState({ collapseCategories: !this.state.collapseCategories })}>
                  <Typography variant='h6'>學分分類</Typography>
                  <KeyboardArrowDown style={{ transform: `rotate(${this.state.collapseCategories ? -180 : 0}deg)`, transition: 'transform 0.3s' }} />
                </div>
                <Collapse in={this.state.collapseCategories} style={{ padding: '0px 16px' }}>
                  <Droppable droppableId='categories' type='CATEGORY'>
                    {
                      (provided, snapshot) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {
                            this.state.categories.map((cat, idx) => (
                              <Draggable key={idx} index={idx} draggableId={'cat_' + idx} type='CATEGORY'>
                                {(provided, snapshot) => (
                                  <>
                                    <div ref={provided.innerRef} {...provided.draggableProps} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ...provided.draggableProps.style }}>
                                      <div {...provided.dragHandleProps} style={{ height: '22px' }}><DragHandle /></div>
                                      <Typography variant='subtitle1' style={{ paddingLeft: '8px', flexGrow: 1 }}>{cat}</Typography>
                                      {
                                        (['必修', '體育', '服務學習', '藝文賞析'].indexOf(cat) === -1 && !cat.startsWith('通識')) &&
                                        <>
                                          <Edit className={classes.spanClick} onClick={evt => this.setState({ dialogRenameCategory: true, dialogCategoryTarget: idx })} />
                                          <Clear className={classes.spanClick} onClick={evt => this.setState({ dialogRemoveCategory: true, dialogCategoryTarget: idx })} />
                                        </>
                                      }
                                    </div>
                                    <Divider />
                                  </>
                                )}
                              </Draggable>
                            ))
                          }
                          {provided.placeholder}
                        </div>
                      )
                    }
                  </Droppable>
                  <div style={{ height: '24px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', columnGap: '6px' }}>
                    <span className={classes.spanClick} onClick={evt => this.addCategory('類別 ' + (this.state.categories.length + 1))}>新增一個類別</span>
                  </div>
                </Collapse>
              </div>
              <Divider style={{ margin: '4px 0px' }} />

              {/* General Settings */}
              <div style={{ border: (this.state.tutorIdx === 2 ? '2px solid red' : '0px solid white'), transition: 'border-color 2s', borderRadius: '.5rem' }}>
                <div className={classes.collapseControl} onClick={evt => this.setState({ collapseSettings: !this.state.collapseSettings })}>
                  <Typography variant='h6'>設定</Typography>
                  <KeyboardArrowDown style={{ transform: `rotate(${this.state.collapseSettings ? -180 : 0}deg)`, transition: 'transform 0.3s' }} />
                </div>
                <Collapse in={this.state.collapseSettings} style={{ padding: '0px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <div style={{ width: '240px' }}>
                      <FormControlLabel label="顯示當學期未送註冊組課程"
                        control={<Switch size="small" checked={(this.state.controlFlag & 0b0001) > 0} onChange={evt => this.toggleFlag(evt.target.checked, 0, true)} />}
                      />
                      <FormControlLabel label="顯示0學分必選修"
                        control={<Switch size="small" checked={(this.state.controlFlag & 0b0010) > 0} onChange={evt => this.toggleFlag(evt.target.checked, 1, true)} />}
                      />
                      <FormControlLabel label="自動平衡每欄高度"
                        control={<Switch size="small" checked={(this.state.controlFlag & 0b0100) > 0} onChange={evt => this.toggleFlag(evt.target.checked, 2, true)} />}
                      />
                      <FormControlLabel label="顯示課程詳細資訊"
                        control={<Switch size="small" checked={(this.state.controlFlag & 0b1000) > 0} onChange={evt => this.toggleFlag(evt.target.checked, 3, true)} />}
                      />
                    </div>
                    <Button variant='outlined' style={{ margin: '8px' }} onClick={evt => this.tutorNext()}>播放導覽</Button>
                  </div>
                </Collapse>
              </div>
              <Divider style={{ margin: '4px 0px' }} />

              <div style={{ border: (this.state.tutorIdx === 1 ? '2px solid red' : '0px solid white'), transition: 'border-color 2s', borderRadius: '.2rem' }}>
                <Typography variant='h6'>未分類課程</Typography>
                <Paper variant="outlined" style={{ minHeight: '120px', background: '#fafafa' }}>
                  <Droppable droppableId='cat_unused' type='COURSE'>
                    {
                      (provided, snapshot) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: '80px' }}>
                          {
                            !this.state.loading &&
                            this.state.data.unused.map(itemId => this.state.courses[itemId]).map((item, idx) => (
                              this.controlFilter(item) &&
                              <Draggable key={idx} index={idx} draggableId={'cat_unused_' + idx} type='COURSE'>
                                {(provided, snapshot) => (
                                  <div style={provided.draggableProps.style} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                                    <Course item={item} detailed={(this.state.controlFlag & 0b1000) > 0} altCredit={null} />
                                  </div>
                                )}
                              </Draggable>
                            ))
                          }
                          {provided.placeholder}
                        </div>
                      )
                    }
                  </Droppable>
                </Paper>
              </div>
            </Paper>
            <Paper id='mainCtx' className={classes.main}
              style={{ border: (this.state.tutorIdx === 1 ? '2px solid red' : '0px solid white'), transition: 'border-color 2s', borderRadius: '.2rem' }}>   {/* Main Panel */}
              <div className={classes.ctxColumn}>
                {
                  this.state.mainColumn.map(cat => (
                    <Category className={classes.category} loading={this.state.loading} catIdx={cat} id={'cat_' + cat} key={'cat_' + cat}
                      cname={this.state.categories[cat]}
                      contentKey={this.state.data[this.state.categories[cat]]}
                      content={this.state.data[this.state.categories[cat]].map(this.getCourse)}
                      controlFlag={this.state.controlFlag}
                      setAnchor={(anchor, idx, itemId) => this.setState({ menuAnchor: anchor, menuAnchorCategory: this.state.categories[cat], menuAnchorIdx: idx, menuAnchorItemId: itemId })} />
                  ))
                }
              </div>
              {
                this.state.subColumns.map((col, idx) => (
                  <div key={'subCol_' + idx} className={classes.ctxColumn}>
                    {
                      col.map(cat => (
                        <Category className={classes.category} loading={this.state.loading} catIdx={cat} id={'cat_' + cat} key={'cat_' + cat}
                          cname={this.state.categories[cat]}
                          contentKey={this.state.data[this.state.categories[cat]]}
                          content={this.state.data[this.state.categories[cat]].map(this.getCourse)}
                          controlFlag={this.state.controlFlag}
                          setAnchor={(anchor, idx, itemId) => this.setState({ menuAnchor: anchor, menuAnchorCategory: this.state.categories[cat], menuAnchorIdx: idx, menuAnchorItemId: itemId })} />
                      ))
                    }
                  </div>
                ))
              }
            </Paper>
          </DragDropContext>
        </div>
      </div>
    )
  }
}

export default withStyles(style)(Desktop)
