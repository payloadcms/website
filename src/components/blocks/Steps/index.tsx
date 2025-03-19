import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { Gutter } from '@components/Gutter'
import React from 'react'

import classes from './index.module.scss'
import { Step } from './Step/index'

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
        <BackgroundGrid
          gridLineStyles={{
            0: {
              background:
                'linear-gradient(to bottom, var(--theme-border-color) 0px, transparent 20rem, transparent calc(100% - 20rem), var(--theme-border-color) 100%);',
              backgroundColor: 'none',
            },
            1: {
              background:
                'linear-gradient(to bottom, var(--theme-border-color) 0px, transparent 10rem, transparent calc(100% - 10rem), var(--theme-border-color) 100%);',
              backgroundColor: 'none',
            },
            2: {
              background:
                'linear-gradient(to bottom, var(--theme-border-color) 0px, transparent 5rem, transparent calc(100% - 5rem), var(--theme-border-color) 100%);',
              backgroundColor: 'none',
            },
            3: {
              background:
                'linear-gradient(to bottom, var(--theme-border-color) 0px, transparent 10rem, transparent calc(100% - 10rem), var(--theme-border-color) 100%);',
              backgroundColor: 'none',
            },
            4: {
              background:
                'linear-gradient(to bottom, var(--theme-border-color) 0px, transparent 20rem, transparent calc(100% - 20rem), var(--theme-border-color) 100%);',
              backgroundColor: 'none',
            },
          }}
          zIndex={0}
        />
      </Gutter>
    </BlockWrapper>
  )
}
