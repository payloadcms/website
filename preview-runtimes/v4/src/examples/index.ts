import type React from 'react'

import type { ComponentExamples, ComponentRender } from './types.js'

import { animateHeightExamples } from './AnimateHeight.js'
import { bannerExamples } from './Banner.js'
import { buttonExamples } from './Button.js'
import { cardExamples } from './Card.js'
import { choiceInputsExamples } from './ChoiceInputs.js'
import { collapsibleExamples } from './Collapsible.js'
import { copyToClipboardExamples } from './CopyToClipboard.js'
import { datePickerExamples } from './DatePicker.js'
import { documentActionsExamples } from './DocumentActions.js'
import { v4ComponentDocumentation } from './documentation/index.js'
import { documentStateExamples } from './DocumentState.js'
import { draggableSortableExamples } from './DraggableSortable.js'
import { dropzoneExamples } from './Dropzone.js'
import { errorPillExamples } from './ErrorPill.js'
import { fieldChromeExamples } from './FieldChrome.js'
import { gutterExamples } from './Gutter.js'
import { iconsExamples } from './Icons.js'
import { linkExamples } from './Link.js'
import { listAndPaginationExamples } from './ListAndPagination.js'
import { motionAndLoadingExamples } from './MotionAndLoading.js'
import { pillExamples } from './Pill.js'
import { pillSelectorExamples } from './PillSelector.js'
import { reactSelectExamples } from './ReactSelect.js'
import { relationshipInputsExamples } from './RelationshipInputs.js'
import { shimmerEffectExamples } from './ShimmerEffect.js'
import { stepNavigationExamples } from './StepNavigation.js'
import { tableCellsExamples } from './TableCells.js'
import { textInputsExamples } from './TextInputs.js'
import { uploadHelpersExamples } from './UploadHelpers.js'

type ComponentRenderSource = ComponentRender | React.ReactNode

const componentRenders: Record<string, Record<string, ComponentRenderSource>> = {
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

for (const [componentName, examples] of Object.entries(componentRenders)) {
  for (const exampleName of Object.keys(examples)) {
    if (!v4ComponentDocumentation[componentName]?.[exampleName]) {
      throw new Error(`Missing preview documentation for ${componentName}.${exampleName}`)
    }
  }
}

export const v4ComponentExamples: Record<string, ComponentExamples> = Object.fromEntries(
  Object.entries(v4ComponentDocumentation).map(([componentName, examples]) => [
    componentName,
    Object.fromEntries(
      Object.entries(examples).map(([exampleName, example]) => {
        const source = componentRenders[componentName]?.[exampleName]
        const render =
          typeof source === 'object' && source !== null && 'render' in source
            ? source.render
            : () => source

        if (!source) {
          throw new Error(`Missing preview render for ${componentName}.${exampleName}`)
        }

        return [exampleName, { ...example, render }]
      }),
    ),
  ]),
)
