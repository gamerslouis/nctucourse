import { Hidden } from '@material-ui/core'
import React from 'react'
import Desktop from './desktop'
import Mobile from './mobile'

export default () => (
  window.innerWidth >= 800 ?
    <Desktop /> :
    <Mobile />
)
