import type { Page } from '@root/payload-types.js'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BlockWrapper } from '@components/BlockWrapper/index.js'
import { Gutter } from '@components/Gutter'
import React from 'react'

import classes from './index.module.scss'
import { Step } from './Step/index.js'

type Props = Extract<Page['layout'][0], { blockType: 'steps' }>

export const Steps: React.FC<Props> = ({ stepsFields }) => {
  const { settings, steps } = stepsFields

  return (
    <BlockWrapper settings={settings}>
      <Gutter>
        <ul className={classes.steps}>
          {steps.map((step, i) => {
            return <Step i={i} key={step.id} step={step} />
          })}
        </ul>
        <BackgroundGrid />
      </Gutter>
    </BlockWrapper>
  )
}
