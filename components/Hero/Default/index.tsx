import React from 'react'
import { Page } from '../../../payload-types'

import classes from './index.module.scss'

export const DefaultHero: React.FC<Page['hero']> = props => {
  return <div>Default hero</div>
}
