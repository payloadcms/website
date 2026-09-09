'use client'

import { AnimateHeight } from '@payloadcms/ui/elements/AnimateHeight'
import { Button } from '@payloadcms/ui/elements/Button'
import React, { useState } from 'react'

import type { PreviewExamples } from './types.js'

const InteractiveAnimateHeight = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="payload-v4-preview__demo-panel">
      <Button
        buttonStyle="secondary"
        extraButtonProps={{ 'aria-controls': 'v4-details-panel', 'aria-expanded': isOpen }}
        margin={false}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Hide details' : 'Show details'}
      </Button>
      <AnimateHeight height={isOpen ? 'auto' : 0} id="v4-details-panel">
        <div className="payload-v4-preview__animated-content">
          This content smoothly expands and collapses without being removed immediately.
        </div>
      </AnimateHeight>
    </div>
  )
}

export const animateHeightExamples: PreviewExamples = {
  interactive: <InteractiveAnimateHeight />,
}
