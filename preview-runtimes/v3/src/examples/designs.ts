import type { ComponentDesign } from './types'

const createDesign = ({
  code,
  description,
  variables,
}: {
  code: string
  description: string
  variables: Array<[name: string, description: string]>
}): ComponentDesign => ({
  code,
  description,
  variables: variables.map(([name, variableDescription]) => ({
    name,
    description: variableDescription,
  })),
})

const cardDesign = createDesign({
  code: `.card {
  background: #f3f1ff;
  border: 1px solid #c8c0ff;
  border-radius: 8px;
}

.card--has-onclick:hover {
  background: #ebe7ff;
  border-color: #6d5dfc;
}`,
  description:
    'Target the Card base class and its interactive modifier to change its surface, border, and hover treatment.',
  variables: [
    ['background', 'Card surface color.'],
    ['border', 'Card border width, style, and color.'],
    ['border-radius', 'Card corner radius.'],
  ],
})

const shimmerDesign = createDesign({
  code: `.shimmer-effect {
  --shine-bg: #ebe7ff;
  --shine-fg: #b8adff;
  border-radius: 6px;
}`,
  description:
    'Override the ShimmerEffect variables to match a branded loading surface without changing the animation implementation.',
  variables: [
    ['--shine-bg', 'Resting skeleton background.'],
    ['--shine-fg', 'Animated highlight color.'],
    ['border-radius', 'Skeleton corner radius.'],
  ],
})

export const componentDesigns: Record<string, Record<string, ComponentDesign>> = {
  AnimateHeight: {
    interactive: createDesign({
      code: `.rah-static > div {
  background: #f3f1ff;
  border-left: 3px solid #6d5dfc;
  border-radius: 4px;
  padding: 1rem;
}`,
      description:
        'AnimateHeight controls movement rather than appearance. Style its content wrapper to give every expanded panel a project-specific surface.',
      variables: [
        ['background', 'Expanded content surface.'],
        ['border-left', 'Accent edge for the expanded region.'],
        ['padding', 'Space around the animated content.'],
      ],
    }),
  },
  Banner: {
    basic: createDesign({
      code: `.banner--type-default {
  background: #f3f1ff;
  color: #211b4d;
  border: 1px solid #c8c0ff;
  border-radius: 8px;
}`,
      description:
        'Target a Banner type to replace its default surface without changing semantic success or error messages.',
      variables: [
        ['background', 'Banner surface color.'],
        ['border', 'Optional Banner outline.'],
        ['color', 'Banner text and inherited icon color.'],
      ],
    }),
    variants: createDesign({
      code: `.banner--type-success {
  background: #dcfce7;
  color: #166534;
}

.banner--type-error {
  background: #fee2e2;
  color: #991b1b;
}`,
      description:
        'Use each semantic modifier to align success and error Banners with a customer’s status palette.',
      variables: [
        ['background', 'Semantic Banner surface.'],
        ['color', 'Semantic Banner text and inherited icon color.'],
      ],
    }),
  },
  Card: {
    actions: cardDesign,
    basic: cardDesign,
  },
  CodeEditor: {
    readOnly: createDesign({
      code: `.code-editor {
  border: 1px solid #c8c0ff;
  border-radius: 8px;
  overflow: hidden;
}

.code-editor .monaco-editor {
  --vscode-editor-background: #151225;
}`,
      description:
        'Style the CodeEditor frame directly. Monaco exposes its own variables for editor-specific colors.',
      variables: [
        ['--vscode-editor-background', 'Monaco editor surface.'],
        ['border', 'Outer editor border.'],
        ['border-radius', 'Outer editor corner radius.'],
      ],
    }),
  },
  Collapsible: {
    basic: createDesign({
      code: `.collapsible--style-default {
  border-color: #c8c0ff;
}

.collapsible--style-default > .collapsible__toggle-wrap {
  background: #f3f1ff;
}

.collapsible__content {
  background: #ffffff;
}`,
      description:
        'Customize the Collapsible frame, header, and content surfaces independently with its structural classes.',
      variables: [
        ['background', 'Header or content surface.'],
        ['border-color', 'Collapsed section outline.'],
      ],
    }),
    error: createDesign({
      code: `.collapsible--style-error {
  border-color: #dc2626;
}

.collapsible--style-error > .collapsible__toggle-wrap {
  background: #fee2e2;
}

.collapsible--style-error .row-label {
  color: #7f1d1d;
}`,
      description:
        'Target the error modifier when a customer’s validation palette differs from Payload’s defaults.',
      variables: [
        ['background', 'Error header surface.'],
        ['border-color', 'Error outline.'],
        ['color', 'Error header label.'],
      ],
    }),
  },
  CopyToClipboard: {
    basic: createDesign({
      code: `.copy-to-clipboard {
  background: #f3f1ff;
  color: #5947e5;
  border-radius: 6px;
  padding: 0.25rem;
}

.copy-to-clipboard:hover {
  background: #ded8ff;
}`,
      description:
        'Style the copy control itself while leaving its tooltip and clipboard behavior unchanged.',
      variables: [
        ['background', 'Copy control surface.'],
        ['color', 'Icon color inherited by the control.'],
        ['padding', 'Clickable area around the icon.'],
      ],
    }),
  },
  DatePicker: {
    basic: createDesign({
      code: `.date-time-picker .react-datepicker__input-container input {
  background: #ffffff;
  border: 1px solid #6d5dfc;
  border-radius: 8px;
}

.date-time-picker .react-datepicker {
  background: #ffffff;
  border-color: #c8c0ff;
}

.date-time-picker .react-datepicker__day--selected {
  background: #6d5dfc;
  color: #ffffff;
}`,
      description:
        'Customize the input and calendar separately using the DatePicker wrapper and react-datepicker state classes.',
      variables: [
        ['background', 'Input, calendar, or selected-day surface.'],
        ['border', 'Input and calendar outline.'],
        ['color', 'Selected-day text color.'],
      ],
    }),
  },
  Dropzone: {
    basic: createDesign({
      code: `.dropzone {
  background: #faf9ff;
  border: 2px dashed #8b7cf6;
  border-radius: 10px;
}

.dropzone.dragging {
  background: #ede9fe;
  border-color: #6d5dfc;
}`,
      description:
        'Target the base Dropzone and its dragging state to create a branded upload area and clear drag feedback.',
      variables: [
        ['background', 'Idle or dragging surface.'],
        ['border', 'Drop target outline.'],
        ['border-radius', 'Dropzone corner radius.'],
      ],
    }),
  },
  ErrorPill: {
    counts: createDesign({
      code: `.error-pill {
  background: #dc2626;
  color: #ffffff;
  border-radius: 999px;
  font-weight: 600;
}`,
      description:
        'Override ErrorPill directly to match the project’s validation color, shape, and emphasis.',
      variables: [
        ['background', 'Error count surface.'],
        ['color', 'Error count text.'],
        ['font-weight', 'Count emphasis.'],
      ],
    }),
  },
  Gutter: {
    basic: createDesign({
      code: `.gutter {
  --gutter-h: 3rem;
}`,
      description:
        'Set the horizontal gutter variable on a Gutter instance—or at the Admin root—to change content alignment.',
      variables: [
        ['--gutter-h', 'Horizontal padding and matching negative margin used by Gutter.'],
      ],
    }),
  },
  Hamburger: {
    states: createDesign({
      code: `.hamburger {
  --hamburger-size: 1.25rem;
  background: #f3f1ff;
  color: #5947e5;
  box-shadow: 0 0 0 1px #c8c0ff;
}

.hamburger:hover {
  background: #ded8ff;
  box-shadow: 0 0 0 1px #6d5dfc;
}`,
      description:
        'Customize the Hamburger’s control surface, icon color, and icon scale without replacing its state icons.',
      variables: [
        ['--hamburger-size', 'Open and close icon dimensions.'],
        ['background', 'Control surface.'],
        ['color', 'Icon color.'],
        ['box-shadow', 'Control outline.'],
      ],
    }),
  },
  Link: {
    basic: createDesign({
      code: `.custom-admin-link {
  color: #6d5dfc;
  font-weight: 600;
  text-decoration-color: #b8adff;
  text-underline-offset: 0.2em;
}

.custom-admin-link:hover {
  color: #5947e5;
}`,
      description:
        'Pass className="custom-admin-link" to Link, then style that class so other Admin links are unaffected.',
      variables: [
        ['color', 'Link text color.'],
        ['font-weight', 'Link emphasis.'],
        ['text-decoration-color', 'Underline color.'],
      ],
    }),
  },
  ListAndPagination: {
    pagination: createDesign({
      code: `.paginator__page {
  border-radius: 6px;
  color: #5947e5;
}

.paginator__page--is-current {
  background: #6d5dfc;
  color: #ffffff;
}`,
      description:
        'Style page controls and the current-page modifier independently to create a stronger active state.',
      variables: [
        ['background', 'Current page surface.'],
        ['border-radius', 'Page control corner radius.'],
        ['color', 'Page number color.'],
      ],
    }),
  },
  ModalsAndDrawers: {
    confirmation: createDesign({
      code: `.confirmation-modal__wrapper {
  background: #ffffff;
  border: 1px solid #c8c0ff;
  border-radius: 12px;
  box-shadow: 0 24px 60px rgb(33 27 77 / 20%);
}`,
      description:
        'Target the ConfirmationModal wrapper to give confirmation dialogs a branded panel treatment.',
      variables: [
        ['background', 'Dialog panel surface.'],
        ['border', 'Dialog panel outline.'],
        ['box-shadow', 'Dialog elevation.'],
      ],
    }),
    drawer: createDesign({
      code: `.drawer__content {
  background: #faf9ff;
  border-left: 1px solid #c8c0ff;
}

.drawer__close {
  background: #211b4d;
}`,
      description:
        'Customize the Drawer panel and dismiss region separately while preserving its positioning and transition behavior.',
      variables: [
        ['background', 'Drawer panel or dismiss-region surface.'],
        ['border-left', 'Panel edge in left-to-right layouts.'],
      ],
    }),
  },
  MotionAndLoading: {
    overlay: createDesign({
      code: `.loading-overlay::after {
  background: #151225;
  opacity: 0.9;
}

.loading-overlay__bar {
  background: #8b7cf6;
}`,
      description:
        'Change the loading veil and animated bars without altering the overlay’s timing or accessibility behavior.',
      variables: [
        ['background', 'Overlay veil or loading-bar color.'],
        ['opacity', 'Strength of the overlay veil.'],
      ],
    }),
    progress: createDesign({
      code: `.progress-bar {
  height: 4px;
}

.progress-bar__progress {
  background: #6d5dfc;
}`,
      description:
        'Target the ProgressBar track height and progress element to create a more visible branded route transition.',
      variables: [
        ['background', 'Progress indicator color.'],
        ['height', 'Progress indicator thickness.'],
      ],
    }),
    staggered: shimmerDesign,
  },
  Pill: {
    shapes: createDesign({
      code: `.pill {
  border-radius: 4px;
}

.pill--rounded {
  border-radius: 999px;
}`,
      description:
        'Override the base and rounded modifiers independently to establish the project’s preferred badge shape.',
      variables: [['border-radius', 'Corner radius for default and rounded Pills.']],
    }),
    sizes: createDesign({
      code: `.pill--size-medium {
  --pill-padding-block-start: 0.375rem;
  --pill-padding-inline-end: 0.75rem;
  --pill-padding-block-end: 0.375rem;
  --pill-padding-inline-start: 0.75rem;
}`,
      description:
        'Target a Pill size modifier and override its padding variables to change density without replacing the component.',
      variables: [
        ['--pill-padding-block-start', 'Top padding.'],
        ['--pill-padding-inline-end', 'End padding.'],
        ['--pill-padding-block-end', 'Bottom padding.'],
        ['--pill-padding-inline-start', 'Start padding.'],
      ],
    }),
    styles: createDesign({
      code: `.pill--style-success {
  background: #dcfce7;
  color: #166534;
}

.pill--style-warning {
  background: #fef3c7;
  color: #92400e;
}

.pill--style-error {
  background: #fee2e2;
  color: #991b1b;
}`,
      description:
        'Override each semantic Pill modifier to match a customer’s status palette while retaining semantic labels.',
      variables: [
        ['background', 'Semantic Pill surface.'],
        ['color', 'Semantic Pill label.'],
      ],
    }),
  },
  PillSelector: {
    interactive: createDesign({
      code: `.pill-selector {
  background: #faf9ff;
  border-radius: 10px;
}

.pill-selector__pill--selected {
  background: #6d5dfc;
  color: #ffffff;
  box-shadow: none;
}`,
      description:
        'Customize the selector surface and selected Pill state to make the current filters visually distinct.',
      variables: [
        ['background', 'Selector or selected-Pill surface.'],
        ['color', 'Selected-Pill label.'],
        ['box-shadow', 'Selected-Pill outline and elevation.'],
      ],
    }),
  },
  Popup: {
    menu: createDesign({
      code: `.popup__content {
  --popup-caret-size: 10px;
  background: #211b4d;
  color: #ffffff;
  border: 1px solid #6d5dfc;
  border-radius: 8px;
}`,
      description:
        'Style the portaled Popup content and caret size without changing trigger positioning or menu behavior.',
      variables: [
        ['--popup-caret-size', 'Popup caret dimensions.'],
        ['background', 'Popup menu surface.'],
        ['border', 'Popup menu outline.'],
        ['color', 'Inherited menu text color.'],
      ],
    }),
  },
  ReactSelect: {
    basic: createDesign({
      code: `.react-select .rs__control {
  background: #ffffff;
  border: 1px solid #6d5dfc;
  border-radius: 8px;
}

.react-select .rs__option--is-focused {
  background: #ede9fe;
}

.react-select .rs__option--is-selected {
  background: #6d5dfc;
  color: #ffffff;
}`,
      description:
        'Use ReactSelect’s stable rs__ classes under the Payload wrapper to customize the control and option states.',
      variables: [
        ['background', 'Control or option surface.'],
        ['border', 'Control outline.'],
        ['color', 'Selected option label.'],
      ],
    }),
  },
  SearchFilter: {
    interactive: createDesign({
      code: `.search-bar {
  --search-bg: #f3f1ff;
  border: 1px solid #c8c0ff;
  border-radius: 999px;
}

.search-bar:focus-within {
  border-color: #6d5dfc;
  box-shadow: 0 0 0 3px #ded8ff;
}`,
      description:
        'Override the SearchBar surface and focus state without changing the SearchFilter debounce behavior it composes.',
      variables: [
        ['--search-bg', 'Search control surface.'],
        ['border', 'Search input outline.'],
        ['box-shadow', 'Keyboard and pointer focus ring.'],
      ],
    }),
  },
  ShimmerEffect: {
    basic: shimmerDesign,
    shapes: shimmerDesign,
  },
  Table: {
    basic: createDesign({
      code: `.table thead {
  background: #211b4d;
  color: #ffffff;
}

.table tbody tr:nth-child(odd) {
  background: #f3f1ff;
}

.table th,
.table td {
  border-color: #ded8ff;
}`,
      description:
        'Customize the Table header, striped rows, and cell borders while leaving column rendering and interactions intact.',
      variables: [
        ['background', 'Header or striped-row surface.'],
        ['border-color', 'Cell separator color.'],
        ['color', 'Header label color.'],
      ],
    }),
  },
  Thumbnail: {
    fallback: createDesign({
      code: `.thumbnail {
  background: #f3f1ff;
  border: 1px solid #c8c0ff;
  border-radius: 10px;
  color: #6d5dfc;
}`,
      description:
        'Style the Thumbnail frame and inherited fallback icon color when no image is available.',
      variables: [
        ['background', 'Fallback surface.'],
        ['border', 'Thumbnail outline.'],
        ['color', 'Inherited fallback icon color.'],
      ],
    }),
    sizes: createDesign({
      code: `.thumbnail--size-small {
  width: 3rem;
  max-height: 3rem;
}

.thumbnail--size-medium {
  width: 5rem;
  max-height: 5rem;
}

.thumbnail--size-large {
  width: 8rem;
  max-height: 8rem;
}`,
      description:
        'Override the size modifiers when a project’s media grid needs different Thumbnail dimensions.',
      variables: [
        ['max-height', 'Maximum Thumbnail height.'],
        ['width', 'Thumbnail width.'],
      ],
    }),
  },
  TimezonePicker: {
    basic: createDesign({
      code: `.timezone-picker-wrapper .field-label {
  color: #5947e5;
  font-weight: 600;
}

.timezone-picker .rs__control {
  background: #f3f1ff;
  border: 1px solid #c8c0ff;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
}`,
      description:
        'Customize the translated label and compact ReactSelect control through the TimezonePicker wrapper.',
      variables: [
        ['background', 'Timezone control surface.'],
        ['border', 'Timezone control outline.'],
        ['color', 'Translated label color.'],
        ['padding', 'Space inside the compact selector.'],
      ],
    }),
  },
  Tooltip: {
    interactive: createDesign({
      code: `.tooltip:not(.field-error) {
  --caret-size: 8px;
  background: #211b4d;
  color: #ffffff;
  border-radius: 6px;
  padding: 0.375rem 0.625rem;
}

.tooltip--position-top:not(.field-error)::after {
  border-top-color: #211b4d;
}`,
      description:
        'Style regular Tooltips and their caret together while excluding field-error Tooltips from the override.',
      variables: [
        ['--caret-size', 'Tooltip caret dimensions.'],
        ['background', 'Tooltip surface.'],
        ['color', 'Tooltip text.'],
        ['padding', 'Space around Tooltip content.'],
      ],
    }),
  },
}
