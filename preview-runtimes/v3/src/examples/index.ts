import type { ComponentExamples, ComponentRenders } from './types'

import { animateHeightExamples } from './AnimateHeight'
import { bannerExamples } from './Banner'
import { buttonExamples } from './Button'
import { cardExamples } from './Card'
import { codeEditorExamples } from './CodeEditor'
import { collapsibleExamples } from './Collapsible'
import { copyToClipboardExamples } from './CopyToClipboard'
import { datePickerExamples } from './DatePicker'
import { v3ComponentDocumentation } from './documentation'
import { dropzoneExamples } from './Dropzone'
import { errorPillExamples } from './ErrorPill'
import { gutterExamples } from './Gutter'
import { hamburgerExamples } from './Hamburger'
import { linkExamples } from './Link'
import { listAndPaginationExamples } from './ListAndPagination'
import { modalsAndDrawersExamples } from './ModalsAndDrawers'
import { motionAndLoadingExamples } from './MotionAndLoading'
import { pillExamples } from './Pill'
import { pillSelectorExamples } from './PillSelector'
import { popupExamples } from './Popup'
import { reactSelectExamples } from './ReactSelect'
import { searchFilterExamples } from './SearchFilter'
import { shimmerEffectExamples } from './ShimmerEffect'
import { tableExamples } from './Table'
import { thumbnailExamples } from './Thumbnail'
import { timezonePickerExamples } from './TimezonePicker'
import { tooltipExamples } from './Tooltip'

const componentRenders: Record<string, ComponentRenders> = {
  AnimateHeight: animateHeightExamples,
  Banner: bannerExamples,
  Button: buttonExamples,
  Card: cardExamples,
  CodeEditor: codeEditorExamples,
  Collapsible: collapsibleExamples,
  CopyToClipboard: copyToClipboardExamples,
  DatePicker: datePickerExamples,
  Dropzone: dropzoneExamples,
  ErrorPill: errorPillExamples,
  Gutter: gutterExamples,
  Hamburger: hamburgerExamples,
  Link: linkExamples,
  ListAndPagination: listAndPaginationExamples,
  ModalsAndDrawers: modalsAndDrawersExamples,
  MotionAndLoading: motionAndLoadingExamples,
  Pill: pillExamples,
  PillSelector: pillSelectorExamples,
  Popup: popupExamples,
  ReactSelect: reactSelectExamples,
  SearchFilter: searchFilterExamples,
  ShimmerEffect: shimmerEffectExamples,
  Table: tableExamples,
  Thumbnail: thumbnailExamples,
  TimezonePicker: timezonePickerExamples,
  Tooltip: tooltipExamples,
}

for (const [componentName, examples] of Object.entries(componentRenders)) {
  for (const exampleName of Object.keys(examples)) {
    if (!v3ComponentDocumentation[componentName]?.[exampleName]) {
      throw new Error(`Missing preview documentation for ${componentName}.${exampleName}`)
    }
  }
}

export const v3ComponentExamples: Record<string, ComponentExamples> = Object.fromEntries(
  Object.entries(v3ComponentDocumentation).map(([componentName, examples]) => [
    componentName,
    Object.fromEntries(
      Object.entries(examples).map(([exampleName, example]) => {
        const render = componentRenders[componentName]?.[exampleName]?.render

        if (!render) {
          throw new Error(`Missing preview render for ${componentName}.${exampleName}`)
        }

        return [exampleName, { ...example, render }]
      }),
    ),
  ]),
)
