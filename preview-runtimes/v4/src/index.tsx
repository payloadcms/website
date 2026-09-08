'use client'

import React from 'react'

import { animateHeightExamples } from './examples/AnimateHeight.js'
import { bannerExamples } from './examples/Banner.js'
import { buttonExamples } from './examples/Button.js'
import { cardExamples } from './examples/Card.js'
import { collapsibleExamples } from './examples/Collapsible.js'
import { copyToClipboardExamples } from './examples/CopyToClipboard.js'
import { datePickerExamples } from './examples/DatePicker.js'
import { errorPillExamples } from './examples/ErrorPill.js'
import { gutterExamples } from './examples/Gutter.js'
import { linkExamples } from './examples/Link.js'
import { listAndPaginationExamples } from './examples/ListAndPagination.js'
import { motionAndLoadingExamples } from './examples/MotionAndLoading.js'
import { pillExamples } from './examples/Pill.js'
import { pillSelectorExamples } from './examples/PillSelector.js'
import { reactSelectExamples } from './examples/ReactSelect.js'
import { shimmerEffectExamples } from './examples/ShimmerEffect.js'
import { PreviewProviders } from './PreviewProviders.js'

type PreviewTheme = 'dark' | 'light'

type Props = {
  component: string
  example: string
  theme: PreviewTheme
}

const examples: Record<string, Record<string, React.ReactNode>> = {
  AnimateHeight: animateHeightExamples,
  Banner: bannerExamples,
  Button: buttonExamples,
  Card: cardExamples,
  Collapsible: collapsibleExamples,
  CopyToClipboard: copyToClipboardExamples,
  DatePicker: datePickerExamples,
  ErrorPill: errorPillExamples,
  Gutter: gutterExamples,
  Link: linkExamples,
  ListAndPagination: listAndPaginationExamples,
  MotionAndLoading: motionAndLoadingExamples,
  Pill: pillExamples,
  PillSelector: pillSelectorExamples,
  ReactSelect: reactSelectExamples,
  ShimmerEffect: shimmerEffectExamples,
}

export function PayloadV4Preview({ component, example, theme }: Props) {
  const preview = examples[component]?.[example]

  if (!preview) {
    return <p>Preview unavailable.</p>
  }

  return (
    <PreviewProviders>
      <div className="payload-v4-preview" data-theme={theme}>
        {preview}
      </div>
    </PreviewProviders>
  )
}
