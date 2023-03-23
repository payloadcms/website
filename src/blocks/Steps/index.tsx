import React from 'react'

import { Page } from '@root/payload-types'
import { Step } from './Step'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'steps' }>

export const Steps: React.FC<Props> = ({ stepsFields }) => {
  const { steps } = stepsFields

  return (
    <ul className={classes.steps}>
      {steps.map((step, i) => {
        return <Step key={i} i={i} {...step} />
      })}
    </ul>
  )
}
