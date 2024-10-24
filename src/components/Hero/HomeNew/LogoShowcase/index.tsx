import React, { useEffect, useState } from 'react'

import { Media } from '@components/Media/index.js'
import { CrosshairIcon } from '@root/icons/CrosshairIcon/index.js'
import { Media as MediaType } from '@root/payload-types.js'

import classes from './index.module.scss'

type LogoItem = {
  logoMedia: string | MediaType
  id?: string | null
}

type PositionedLogo = {
  logo: LogoItem
  position: number
  isVisible: boolean
}

type Props = {
  logos: LogoItem[] | null | undefined
}

export const LogoShowcase: React.FC<Props> = ({ logos }) => {
  return <div className={classes.logoShowcase}></div>
}

export default LogoShowcase
