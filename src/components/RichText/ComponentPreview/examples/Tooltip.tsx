'use client'

import { Button } from '@payloadcms/ui/elements/Button'
import { Tooltip } from '@payloadcms/ui/elements/Tooltip'
import { useState } from 'react'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

const Demo = () => {
  const [show, setShow] = useState(false)
  return (
    <div className={classes.tooltipTarget}>
      <Button
        buttonStyle="secondary"
        extraButtonProps={{
          onBlur: () => setShow(false),
          onFocus: () => setShow(true),
          onMouseEnter: () => setShow(true),
          onMouseLeave: () => setShow(false),
        }}
        margin={false}
      >
        Hover or focus
      </Button>
      <Tooltip delay={0} position="top" show={show} staticPositioning>
        Helpful context
      </Tooltip>
    </div>
  )
}

export const tooltipExamples: ComponentExamples = {
  interactive: {
    code: `const [show, setShow] = useState(false)

<div style={{ position: 'relative' }}>
  <Button
    buttonStyle="secondary"
    extraButtonProps={{
      onBlur: () => setShow(false),
      onFocus: () => setShow(true),
      onMouseEnter: () => setShow(true),
      onMouseLeave: () => setShow(false),
    }}
    margin={false}
  >
    Hover or focus
  </Button>
  <Tooltip delay={0} position="top" show={show} staticPositioning>
    Helpful context
  </Tooltip>
</div>`,
    render: () => <Demo />,
  },
}
