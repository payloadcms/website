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
import { documentActionsExamples } from './DocumentActions'
import { documentStateExamples } from './DocumentState'
import { draggableSortableExamples } from './DraggableSortable'
import { dropzoneExamples } from './Dropzone'
import { errorPillExamples } from './ErrorPill'
import { gutterExamples } from './Gutter'
import { hamburgerExamples } from './Hamburger'
import { iconsExamples } from './Icons'
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
import { stepNavigationExamples } from './StepNavigation'
import { tableExamples } from './Table'
import { tableCellsExamples } from './TableCells'
import { thumbnailExamples } from './Thumbnail'
import { timezonePickerExamples } from './TimezonePicker'
import { tooltipExamples } from './Tooltip'
import { uploadHelpersExamples } from './UploadHelpers'
const examplesWithoutDesign: Record<string, ComponentExamples> = {
  AnimateHeight: animateHeightExamples,
  Banner: bannerExamples,
  Button: buttonExamples,
  Card: cardExamples,
  CodeEditor: codeEditorExamples,
  Collapsible: collapsibleExamples,
  CopyToClipboard: copyToClipboardExamples,
  DatePicker: datePickerExamples,
  DocumentActions: documentActionsExamples,
  DocumentState: documentStateExamples,
  DraggableSortable: draggableSortableExamples,
  Dropzone: dropzoneExamples,
  ErrorPill: errorPillExamples,
  Gutter: gutterExamples,
  Hamburger: hamburgerExamples,
  Icons: iconsExamples,
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
  StepNavigation: stepNavigationExamples,
  Table: tableExamples,
  TableCells: tableCellsExamples,
  Thumbnail: thumbnailExamples,
  TimezonePicker: timezonePickerExamples,
  Tooltip: tooltipExamples,
  UploadHelpers: uploadHelpersExamples,
}

export const v3ComponentExamples: Record<string, ComponentExamples> = Object.fromEntries(
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
