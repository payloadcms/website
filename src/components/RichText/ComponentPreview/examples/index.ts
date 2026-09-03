import type { ComponentExamples } from './types'

import { animateHeightExamples } from './AnimateHeight'
import { bannerExamples } from './Banner'
import { buttonExamples } from './Button'
import { cardExamples } from './Card'
import { codeEditorExamples } from './CodeEditor'
import { collapsibleExamples } from './Collapsible'
import { copyToClipboardExamples } from './CopyToClipboard'
import { datePickerExamples } from './DatePicker'
import { componentDesigns } from './designs'
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
import { v4ComponentExamples } from './v4'

const examplesWithoutDesign: Record<string, ComponentExamples> = {
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

const v3ComponentExamples: Record<string, ComponentExamples> = Object.fromEntries(
  Object.entries(examplesWithoutDesign).map(([componentName, examples]) => [
    componentName,
    Object.fromEntries(
      Object.entries(examples).map(([exampleName, example]) => {
        const design = example.design || componentDesigns[componentName]?.[exampleName]

        if (!design) {
          throw new Error(`Missing Design documentation for ${componentName}.${exampleName}`)
        }

        return [exampleName, { ...example, design }]
      }),
    ),
  ]),
)

export const componentExamplesByVersion: Record<'v3' | 'v4', Record<string, ComponentExamples>> = {
  v3: v3ComponentExamples,
  v4: v4ComponentExamples,
}
