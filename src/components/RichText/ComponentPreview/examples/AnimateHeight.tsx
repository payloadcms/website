'use client'

import { AnimateHeight } from '@payloadcms/ui/elements/AnimateHeight'
import { Button } from '@payloadcms/ui/elements/Button'
import React, { useState } from 'react'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

const Demo = () => {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className={classes.demoPanel}>
      <Button
        buttonStyle="secondary"
        extraButtonProps={{ 'aria-controls': 'details-panel', 'aria-expanded': isOpen }}
        margin={false}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Hide details' : 'Show details'}
      </Button>
      <AnimateHeight height={isOpen ? 'auto' : 0} id="details-panel">
        <div className={classes.animatedContent}>
          This content smoothly expands and collapses without being removed immediately.
        </div>
      </AnimateHeight>
    </div>
  )
}

export const animateHeightExamples: ComponentExamples = {
  interactive: {
    code: `const [isOpen, setIsOpen] = useState(true)

<Button
  buttonStyle="secondary"
  extraButtonProps={{ 'aria-controls': 'details-panel', 'aria-expanded': isOpen }}
  margin={false}
  onClick={() => setIsOpen(!isOpen)}
>
  {isOpen ? 'Hide details' : 'Show details'}
</Button>
<AnimateHeight height={isOpen ? 'auto' : 0} id="details-panel">
  <div>Expandable content</div>
</AnimateHeight>`,
    render: () => <Demo />,
  },
}
