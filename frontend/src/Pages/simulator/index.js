import { Hidden } from '@material-ui/core'
import React from 'react'
import Desktop from './desktop'
import Mobile from './mobile'

export default () => (
  // <>
  //   <Hidden mdDown><Desktop /></Hidden>
  //   <Hidden lgUp><Mobile /></Hidden>
  // </>
  <Desktop />
)
