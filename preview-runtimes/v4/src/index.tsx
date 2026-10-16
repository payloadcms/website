'use client'

import React from 'react'

import type { ComponentRender } from './examples/types.js'

import { animateHeightExamples } from './examples/AnimateHeight.js'
import { bannerExamples } from './examples/Banner.js'
import { buttonExamples } from './examples/Button.js'
import { cardExamples } from './examples/Card.js'
import { choiceInputsExamples } from './examples/ChoiceInputs.js'
import { collapsibleExamples } from './examples/Collapsible.js'
import { copyToClipboardExamples } from './examples/CopyToClipboard.js'
import { datePickerExamples } from './examples/DatePicker.js'
import { documentActionsExamples } from './examples/DocumentActions.js'
import { documentStateExamples } from './examples/DocumentState.js'
import { draggableSortableExamples } from './examples/DraggableSortable.js'
import { dropzoneExamples } from './examples/Dropzone.js'
import { errorPillExamples } from './examples/ErrorPill.js'
import { fieldChromeExamples } from './examples/FieldChrome.js'
import { gutterExamples } from './examples/Gutter.js'
import { iconsExamples } from './examples/Icons.js'
import { linkExamples } from './examples/Link.js'
import { listAndPaginationExamples } from './examples/ListAndPagination.js'
import { motionAndLoadingExamples } from './examples/MotionAndLoading.js'
import { pillExamples } from './examples/Pill.js'
import { pillSelectorExamples } from './examples/PillSelector.js'
import { reactSelectExamples } from './examples/ReactSelect.js'
import { relationshipInputsExamples } from './examples/RelationshipInputs.js'
import { shimmerEffectExamples } from './examples/ShimmerEffect.js'
import { stepNavigationExamples } from './examples/StepNavigation.js'
import { tableCellsExamples } from './examples/TableCells.js'
import { textInputsExamples } from './examples/TextInputs.js'
import { uploadHelpersExamples } from './examples/UploadHelpers.js'
import { PreviewProviders } from './PreviewProviders.js'

type PreviewTheme = 'dark' | 'light'

type Props = {
  component: string
  example: string
  theme: PreviewTheme
}

type Preview = ComponentRender | React.ReactNode

const examples: Record<string, Record<string, Preview>> = {
  AnimateHeight: animateHeightExamples,
  Banner: bannerExamples,
  Button: buttonExamples,
  Card: cardExamples,
  ChoiceInputs: choiceInputsExamples,
  Collapsible: collapsibleExamples,
  CopyToClipboard: copyToClipboardExamples,
  DatePicker: datePickerExamples,
  DocumentActions: documentActionsExamples,
  DocumentState: documentStateExamples,
  DraggableSortable: draggableSortableExamples,
  Dropzone: dropzoneExamples,
  ErrorPill: errorPillExamples,
  FieldChrome: fieldChromeExamples,
  Gutter: gutterExamples,
  Icons: iconsExamples,
  Link: linkExamples,
  ListAndPagination: listAndPaginationExamples,
  MotionAndLoading: motionAndLoadingExamples,
  Pill: pillExamples,
  PillSelector: pillSelectorExamples,
  ReactSelect: reactSelectExamples,
  RelationshipInputs: relationshipInputsExamples,
  ShimmerEffect: shimmerEffectExamples,
  StepNavigation: stepNavigationExamples,
  TableCells: tableCellsExamples,
  TextInputs: textInputsExamples,
  UploadHelpers: uploadHelpersExamples,
}

export function PayloadV4Preview({ component, example, theme }: Props) {
  const preview = examples[component]?.[example]

  if (!preview) {
    return <p>Preview unavailable.</p>
  }

  const content =
    typeof preview === 'object' && preview !== null && 'render' in preview
      ? preview.render({ theme })
      : preview

  return (
    <PreviewProviders>
      <div className="payload-v4-preview" data-theme={theme}>
        {content}
      </div>
    </PreviewProviders>
  )
}
