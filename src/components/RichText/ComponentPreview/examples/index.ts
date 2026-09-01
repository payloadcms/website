import type { ComponentExamples } from './types'

import { animateHeightExamples } from './AnimateHeight'
import { bannerExamples } from './Banner'
import { buttonExamples } from './Button'
import { cardExamples } from './Card'
import { codeEditorExamples } from './CodeEditor'
import { collapsibleExamples } from './Collapsible'
import { copyToClipboardExamples } from './CopyToClipboard'
import { errorPillExamples } from './ErrorPill'
import { gutterExamples } from './Gutter'
import { hamburgerExamples } from './Hamburger'
import { linkExamples } from './Link'
import { pillExamples } from './Pill'
import { pillSelectorExamples } from './PillSelector'
import { popupExamples } from './Popup'
import { reactSelectExamples } from './ReactSelect'
import { searchFilterExamples } from './SearchFilter'
import { shimmerEffectExamples } from './ShimmerEffect'
import { thumbnailExamples } from './Thumbnail'
import { tooltipExamples } from './Tooltip'

export const componentExamples: Record<string, ComponentExamples> = {
  AnimateHeight: animateHeightExamples,
  Banner: bannerExamples,
  Button: buttonExamples,
  Card: cardExamples,
  CodeEditor: codeEditorExamples,
  Collapsible: collapsibleExamples,
  CopyToClipboard: copyToClipboardExamples,
  ErrorPill: errorPillExamples,
  Gutter: gutterExamples,
  Hamburger: hamburgerExamples,
  Link: linkExamples,
  Pill: pillExamples,
  PillSelector: pillSelectorExamples,
  Popup: popupExamples,
  ReactSelect: reactSelectExamples,
  SearchFilter: searchFilterExamples,
  ShimmerEffect: shimmerEffectExamples,
  Thumbnail: thumbnailExamples,
  Tooltip: tooltipExamples,
}
