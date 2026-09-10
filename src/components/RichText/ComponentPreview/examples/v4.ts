import type { ComponentExamples } from './types'

const animateHeightDesign = {
  code: `@layer payload {
  .expandable-content {
    padding: var(--spacer-3);
    color: var(--color-text);
    background: var(--color-bg-secondary);
    border: var(--stroke-width-small) solid var(--color-border);
    border-radius: var(--radius-medium);
  }
}`,
  description:
    'AnimateHeight controls only the height transition. Apply visual styles to its child content so the same surface is used throughout the animation.',
  variables: [
    {
      name: '--color-bg-secondary',
      description: 'Expandable content background.',
    },
    {
      name: '--color-border',
      description: 'Expandable content border.',
    },
    {
      name: '--radius-medium',
      description: 'Expandable content corner radius.',
    },
  ],
}

const bannerDesign = {
  code: `@layer payload {
  .banner {
    --color-bg-secondary: #f1f0ff;
    --color-text: #352f67;
    --radius-medium: 0.5rem;
  }
}`,
  description:
    'Override Banner tokens on the component to adjust neutral messages without changing the same semantic colors throughout the Admin Panel.',
  variables: [
    {
      name: '--color-bg-secondary',
      description: 'Default banner background.',
    },
    {
      name: '--color-text',
      description: 'Default banner text and icon color.',
    },
    {
      name: '--radius-medium',
      description: 'Banner corner radius.',
    },
  ],
}

const bannerVariantsDesign = {
  code: `@layer payload {
  .banner--type-brand {
    --color-bg-brand-tertiary: #eeeaff;
  }

  .banner--type-success {
    --color-bg-success-tertiary: #e3f7e9;
  }

  .banner--type-warning {
    --color-bg-warning-tertiary: #fff2d8;
  }

  .banner--type-danger {
    --color-bg-danger-tertiary: #fde8e7;
  }
}`,
  description:
    'Target the class for each semantic Banner type to customize that message without changing unrelated uses of the same color token.',
  variables: [
    {
      name: '--color-bg-brand-tertiary',
      description: 'Brand banner background.',
    },
    {
      name: '--color-bg-success-tertiary',
      description: 'Success banner background.',
    },
    {
      name: '--color-bg-warning-tertiary',
      description: 'Warning banner background.',
    },
    {
      name: '--color-bg-danger-tertiary',
      description: 'Danger banner background.',
    },
  ],
}

const gutterDesign = {
  code: `@layer payload {
  .gutter {
    --gutter-h: 3rem;
  }
}`,
  description:
    'Override the horizontal gutter token on a specific Gutter when custom content needs different spacing from the surrounding Admin view.',
  variables: [
    {
      name: '--gutter-h',
      description: 'Left and right gutter spacing.',
    },
  ],
}

const pillShapeDesign = {
  code: `@layer payload {
  .pill {
    --button-radius: 0.25rem;
  }

  .pill--rounded {
    --radius-large: 999px;
  }
}`,
  description:
    'Override the default and rounded radius tokens within Pill selectors to change their shapes without altering other controls.',
  variables: [
    {
      name: '--button-radius',
      description: 'Default Pill corner radius.',
    },
    {
      name: '--radius-large',
      description: 'Corner radius used when rounded is enabled.',
    },
  ],
}

const pillSizeDesign = {
  code: `@layer payload {
  .pill--size-small {
    --spacer-1: 0.375rem;
  }

  .pill--size-medium {
    --spacer-1: 0.375rem;
    --spacer-2-5: 0.875rem;
  }
}`,
  description:
    'Adjust spacing tokens within each size class to customize Pill height and inline padding independently.',
  variables: [
    {
      name: '--spacer-1',
      description: 'Small spacing used for vertical and compact inline padding.',
    },
    {
      name: '--spacer-2-5',
      description: 'Medium Pill inline padding.',
    },
  ],
}

const pillStylesDesign = {
  code: `@layer payload {
  .pill--style-success {
    --color-bg-selected: #dff7e8;
    --color-text-brand: #176b3a;
  }

  .pill--style-warning {
    --color-bg-warning-tertiary: #fff0cc;
    --color-text-warning: #714b00;
  }

  .pill--style-error {
    --color-bg-danger-tertiary: #fde5e3;
    --color-text-danger: #9b2924;
  }
}`,
  description:
    'Target a semantic Pill style to customize its background and text without changing the corresponding palette throughout the Admin Panel.',
  variables: [
    {
      name: '--color-bg-selected',
      description: 'Success Pill background.',
    },
    {
      name: '--color-text-brand',
      description: 'Success Pill text.',
    },
    {
      name: '--color-bg-warning-tertiary',
      description: 'Warning Pill background.',
    },
    {
      name: '--color-text-warning',
      description: 'Warning Pill text.',
    },
    {
      name: '--color-bg-danger-tertiary',
      description: 'Error Pill background.',
    },
    {
      name: '--color-text-danger',
      description: 'Error Pill text.',
    },
  ],
}

const shimmerDesign = {
  code: `@layer payload {
  .shimmer-effect {
    --shine-bg: #ebe9f5;
    --shine-fg: #f8f7fc;
    --radius-medium: 0.5rem;
  }
}`,
  description:
    'Override ShimmerEffect tokens on the component to match a custom surface without changing global background colors.',
  variables: [
    {
      name: '--shine-bg',
      description: 'Base placeholder color.',
    },
    {
      name: '--shine-fg',
      description: 'Animated highlight color.',
    },
    {
      name: '--radius-medium',
      description: 'Default placeholder corner radius.',
    },
  ],
}

const buttonColorDesign = {
  code: `@layer payload {
  .btn--style-primary {
    --color-bg-brand: #6d5dfc;
    --color-bg-brand-hover: #5947e5;
    --color-bg-brand-pressed: #4938cc;
    --color-text-onbrand: #ffffff;
  }
}`,
  description:
    'Scope Payload 4 semantic color tokens to primary Buttons to customize the component without changing the global brand palette.',
  variables: [
    {
      name: '--color-bg-brand',
      description: 'Primary button background.',
    },
    {
      name: '--color-bg-brand-hover',
      description: 'Primary button background on hover.',
    },
    {
      name: '--color-bg-brand-pressed',
      description: 'Primary button background while pressed.',
    },
    {
      name: '--color-text-onbrand',
      description: 'Button label and icon color.',
    },
  ],
}

const buttonDisabledDesign = {
  code: `@layer payload {
  .btn--style-primary.btn--disabled {
    --color-bg-disabled: #e3e1f5;
    --color-text-ondisabled: #625d82;
  }
}`,
  description:
    'Target the disabled state together with a style variant to customize unavailable Buttons without changing enabled actions.',
  variables: [
    {
      name: '--color-bg-disabled',
      description: 'Disabled button background.',
    },
    {
      name: '--color-text-ondisabled',
      description: 'Label and icon color on a disabled filled button.',
    },
  ],
}

const buttonSizeDesign = {
  code: `@layer payload {
  .btn--size-medium {
    --button-height: 1.75rem;
    --spacer-2: 0.625rem;
  }

  .btn--size-large {
    --spacer-5: 2.25rem;
    --spacer-3: 0.875rem;
  }
}`,
  description:
    'Override the spacing tokens within a size class when a project needs different Button dimensions.',
  variables: [
    {
      name: '--button-height',
      description: 'Medium button height.',
    },
    {
      name: '--spacer-2',
      description: 'Medium button inline padding.',
    },
    {
      name: '--spacer-5',
      description: 'Large button height.',
    },
    {
      name: '--spacer-3',
      description: 'Large button inline padding.',
    },
  ],
}

const buttonStylesDesign = {
  code: `@layer payload {
  .btn--style-secondary {
    --color-bg: #f7f5ff;
    --color-text: #4938cc;
    --special-border-translucent: #8b7cf6;
  }

  .btn--style-destructive {
    --color-bg-danger: #c7362f;
    --color-bg-danger-hover: #a92c27;
    --color-bg-danger-pressed: #8f2420;
    --color-text-ondanger: #ffffff;
  }
}`,
  description:
    'Each Button variant has its own class, so supporting and destructive actions can be customized independently.',
  variables: [
    {
      name: '--color-bg',
      description: 'Secondary button background.',
    },
    {
      name: '--color-text',
      description: 'Secondary button label and icon color.',
    },
    {
      name: '--special-border-translucent',
      description: 'Secondary button border color.',
    },
    {
      name: '--color-bg-danger',
      description: 'Destructive button background.',
    },
    {
      name: '--color-bg-danger-hover',
      description: 'Destructive button background on hover.',
    },
    {
      name: '--color-bg-danger-pressed',
      description: 'Destructive button background while pressed.',
    },
    {
      name: '--color-text-ondanger',
      description: 'Destructive button label and icon color.',
    },
  ],
}

const cardDesign = {
  code: `@layer payload {
  .card {
    --color-bg-secondary: #f4f1ff;
    --color-bg-secondary-hover: #e9e3ff;
    --color-border: #c8bdf5;
    --radius-medium: 0.75rem;
  }
}`,
  description:
    'Override Card tokens within the component selector to customize its surface, interactive state, border, and corner radius.',
  variables: [
    {
      name: '--color-bg-secondary',
      description: 'Default card background.',
    },
    {
      name: '--color-bg-secondary-hover',
      description: 'Interactive card background on hover.',
    },
    {
      name: '--color-border',
      description: 'Card border color.',
    },
    {
      name: '--radius-medium',
      description: 'Card corner radius.',
    },
  ],
}

const collapsibleDesign = {
  code: `@layer payload {
  .collapsible {
    --color-bg: #ffffff;
    --color-bg-secondary: #f4f1ff;
    --color-bg-secondary-hover: #e9e3ff;
    --color-border: #c8bdf5;
    --button-radius: 0.5rem;
  }
}`,
  description:
    'Scope surface and border tokens to Collapsible to customize both its header and expanded content.',
  variables: [
    {
      name: '--color-bg',
      description: 'Expanded content background.',
    },
    {
      name: '--color-bg-secondary',
      description: 'Header background.',
    },
    {
      name: '--color-bg-secondary-hover',
      description: 'Header background on hover.',
    },
    {
      name: '--color-border',
      description: 'Header and content border color.',
    },
    {
      name: '--button-radius',
      description: 'Outer corner radius.',
    },
  ],
}

const collapsibleErrorDesign = {
  code: `@layer payload {
  .collapsible--style-error {
    --color-bg-danger-tertiary: #fde5e3;
    --color-bg-danger-tertiary-hover: #f8cfcc;
    --color-border-danger-strong: #b8322c;
  }
}`,
  description:
    'Target the error state to customize invalid sections without changing the danger palette across the entire Admin Panel.',
  variables: [
    {
      name: '--color-bg-danger-tertiary',
      description: 'Error header background.',
    },
    {
      name: '--color-bg-danger-tertiary-hover',
      description: 'Error header background on hover.',
    },
    {
      name: '--color-border-danger-strong',
      description: 'Error header and content border.',
    },
  ],
}

const copyToClipboardDesign = {
  code: `@layer payload {
  .copy-to-clipboard {
    --color-icon: #4938cc;
    --color-bg-secondary: #f4f1ff;
    --color-bg-secondary-pressed: #d9d0ff;
    --color-border-selected: #6d5dfc;
    --button-radius: 0.375rem;
  }
}`,
  description:
    'Override CopyToClipboard tokens on the control to customize its icon, interaction states, focus color, and radius.',
  variables: [
    {
      name: '--color-icon',
      description: 'Copy icon color.',
    },
    {
      name: '--color-bg-secondary',
      description: 'Control background on hover.',
    },
    {
      name: '--color-bg-secondary-pressed',
      description: 'Control background while pressed.',
    },
    {
      name: '--color-border-selected',
      description: 'Keyboard focus outline color.',
    },
    {
      name: '--button-radius',
      description: 'Control corner radius.',
    },
  ],
}

const datePickerDesign = {
  code: `@layer payload {
  .date-time-picker {
    --field-color-bg: #f8f7fc;
    --field-color-border: #8f87bd;
    --field-color-placeholder: #625d82;
    --field-border-radius: 0.5rem;
  }

  .react-datepicker {
    --color-bg: #ffffff;
    --color-bg-selected-strong: #6d5dfc;
    --color-text-onselected-strong: #ffffff;
  }
}`,
  description:
    'Override field tokens on DatePicker for the input, then scope calendar tokens to react-datepicker for the open calendar surface and selected date.',
  variables: [
    {
      name: '--field-color-bg',
      description: 'Input background.',
    },
    {
      name: '--field-color-border',
      description: 'Input border.',
    },
    {
      name: '--field-color-placeholder',
      description: 'Placeholder text color.',
    },
    {
      name: '--field-border-radius',
      description: 'Input corner radius.',
    },
    {
      name: '--color-bg-selected-strong',
      description: 'Selected date background.',
    },
  ],
}

const errorPillDesign = {
  code: `@layer payload {
  .error-pill {
    --color-bg-danger: #b8322c;
    --color-text-ondanger: #ffffff;
    --radius-medium: 999px;
  }
}`,
  description:
    'Override semantic tokens on ErrorPill to customize its validation color and shape without changing danger colors elsewhere in the Admin Panel.',
  variables: [
    {
      name: '--color-bg-danger',
      description: 'ErrorPill background.',
    },
    {
      name: '--color-text-ondanger',
      description: 'ErrorPill count and message color.',
    },
    {
      name: '--radius-medium',
      description: 'ErrorPill corner radius.',
    },
  ],
}

const linkDesign = {
  code: `@layer payload {
  .custom-admin-link {
    color: var(--color-text-brand);
    font-weight: var(--font-weight-strong);
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }

  .custom-admin-link:hover {
    color: var(--color-text);
  }
}`,
  description:
    'Link supplies navigation behavior but no visual treatment. Pass a className and style that class to match the link’s purpose and surrounding Admin content.',
  variables: [
    {
      name: '--color-text-brand',
      description: 'Branded link text color.',
    },
    {
      name: '--color-text',
      description: 'Default text color used here for hover.',
    },
    {
      name: '--font-weight-strong',
      description: 'Emphasized link weight.',
    },
  ],
}

const paginationDesign = {
  code: `@layer payload {
  .paginator {
    --field-color-border: #8f87bd;
    --color-border-selected: #6d5dfc;
    --color-bg-secondary: #f8f7fc;
  }
}`,
  description:
    'Override field and surface tokens on Pagination to customize its page input without changing other Admin controls.',
  variables: [
    {
      name: '--field-color-border',
      description: 'Page input border.',
    },
    {
      name: '--color-border-selected',
      description: 'Page input border while focused.',
    },
    {
      name: '--color-bg-secondary',
      description: 'Page input background.',
    },
  ],
}

const loadingOverlayDesign = {
  code: `@layer payload {
  .loading-overlay {
    --color-bg: #f8f7fc;
    --color-icon-secondary: #6d5dfc;
  }
}`,
  description:
    'Override LoadingOverlay tokens to customize its backdrop and spinner while preserving the built-in loading behavior.',
  variables: [
    {
      name: '--color-bg',
      description: 'Loading backdrop color.',
    },
    {
      name: '--color-icon-secondary',
      description: 'Spinner color.',
    },
  ],
}

const progressBarDesign = {
  code: `@layer payload {
  .progress-bar__progress {
    background-color: var(--color-bg-brand);
  }
}`,
  description:
    'Target the progress element to replace its default text-colored fill with a semantic brand color.',
  variables: [
    {
      name: '--color-bg-brand',
      description: 'Route progress fill color in this override.',
    },
  ],
}

const pillSelectorDesign = {
  code: `@layer payload {
  .pill-selector {
    --color-bg-secondary: #f7f5ff;
    --spacer-4: 1.25rem;
  }

  .pill-selector .chip--selected {
    --color-bg-brand-tertiary: #e8e4ff;
    --color-border-brand: #6d5dfc;
  }
}`,
  description:
    'Override tokens on the selector surface and its selected Chips to customize this group without changing the same colors throughout the Admin Panel.',
  variables: [
    {
      name: '--color-bg-secondary',
      description: 'PillSelector surface color.',
    },
    {
      name: '--color-bg-brand-tertiary',
      description: 'Selected Chip background.',
    },
    {
      name: '--color-border-brand',
      description: 'Selected Chip border.',
    },
    {
      name: '--spacer-4',
      description: 'PillSelector padding.',
    },
  ],
}

const reactSelectDesign = {
  code: `@layer payload {
  .react-select {
    --field-color-bg: #ffffff;
    --field-color-border: #b8b2d8;
    --field-color-border-focus: #6d5dfc;
    --field-border-radius: 0.5rem;
  }

  .rs__floating-menu-portal .rs__option--is-focused {
    --color-bg-secondary: #f2efff;
  }

  .rs__floating-menu-portal .rs__option--is-selected {
    --color-bg-selected: #e4dfff;
  }
}`,
  description:
    'Override field tokens within ReactSelect, then target its portalled menu to customize the control, focus state, and options without changing other Admin fields.',
  variables: [
    {
      name: '--field-color-bg',
      description: 'Select control background.',
    },
    {
      name: '--field-color-border',
      description: 'Select control border.',
    },
    {
      name: '--field-color-border-focus',
      description: 'Select control border while focused.',
    },
    {
      name: '--field-border-radius',
      description: 'Select control corner radius.',
    },
    {
      name: '--color-bg-secondary',
      description: 'Focused option background.',
    },
    {
      name: '--color-bg-selected',
      description: 'Selected option background.',
    },
  ],
}

const animateHeightExamples: ComponentExamples = {
  interactive: {
    code: `const [isOpen, setIsOpen] = useState(true)

<Button
  buttonStyle="secondary"
  extraButtonProps={{ 'aria-controls': 'details-panel', 'aria-expanded': isOpen }}
  margin={false}
  onClick={() => setIsOpen(!isOpen)}
>
  {isOpen ? 'Hide details' : 'Show details'}
</Button>
<AnimateHeight height={isOpen ? 'auto' : 0} id="details-panel">
  <div className="expandable-content">Expandable content</div>
</AnimateHeight>`,
    design: animateHeightDesign,
  },
}

const buttonExamples: ComponentExamples = {
  disabled: {
    code: `<Button disabled margin={false}>Save changes</Button>`,
    design: buttonDisabledDesign,
  },
  primary: {
    code: `<Button margin={false}>Save changes</Button>`,
    design: buttonColorDesign,
  },
  sizes: {
    code: `<Button margin={false} size="medium">Medium</Button>
<Button margin={false} size="large">Large</Button>`,
    design: buttonSizeDesign,
  },
  styles: {
    code: `<Button margin={false}>Primary</Button>
<Button buttonStyle="secondary" margin={false}>Secondary</Button>
<Button buttonStyle="destructive" margin={false}>Delete</Button>
<Button buttonStyle="dashed" margin={false}>Dashed</Button>
<Button buttonStyle="ghost" margin={false}>Ghost</Button>
<Button buttonStyle="pill" margin={false}>Pill</Button>`,
    design: buttonStylesDesign,
  },
}

const cardExamples: ComponentExamples = {
  actions: {
    code: `<Card
  actions={
    <Button
      aria-label="Create new Post"
      buttonStyle="ghost"
      icon={<PlusIcon size={16} />}
      margin={false}
      onClick={() => createPost()}
      round
    />
  }
  title="Posts"
/>`,
    design: cardDesign,
  },
  basic: {
    code: `<Card title="Posts" />`,
    design: cardDesign,
  },
}

const collapsibleExamples: ComponentExamples = {
  basic: {
    code: `<Collapsible header="Collapsible header">
  Collapsible content
</Collapsible>`,
    design: collapsibleDesign,
  },
  error: {
    code: `<Collapsible collapsibleStyle="error" header="Collapsible header">
  Correct the invalid fields in this section.
</Collapsible>`,
    design: collapsibleErrorDesign,
  },
}

const copyToClipboardExamples: ComponentExamples = {
  basic: {
    code: `<span>post_123456789</span>
<CopyToClipboard
  defaultMessage="Copy ID"
  successMessage="ID copied"
  value="post_123456789"
/>`,
    design: copyToClipboardDesign,
  },
}

const datePickerExamples: ComponentExamples = {
  basic: {
    code: `const [value, setValue] = useState<Date>()

<label htmlFor="publish-date-input">Publish date</label>
<DatePicker
  onChange={setValue}
  overrides={{ id: 'publish-date-input' }}
  placeholder="Select a date"
  value={value}
/>`,
    design: datePickerDesign,
  },
}

const errorPillExamples: ComponentExamples = {
  counts: {
    code: `const { i18n } = useTranslation()

<ErrorPill count={1} i18n={i18n} />
<ErrorPill count={12} i18n={i18n} />
<ErrorPill count={120} i18n={i18n} />
<ErrorPill count={3} i18n={i18n} withMessage />`,
    design: errorPillDesign,
  },
}

const bannerExamples: ComponentExamples = {
  basic: {
    code: `<Banner>Review these changes before publishing.</Banner>`,
    design: bannerDesign,
  },
  variants: {
    code: `<Banner type="default">Default message</Banner>
<Banner type="brand">Additional product context</Banner>
<Banner type="success">Changes saved successfully.</Banner>
<Banner type="warning">Review this setting before continuing.</Banner>
<Banner type="danger">Something went wrong.</Banner>`,
    design: bannerVariantsDesign,
  },
}

const gutterExamples: ComponentExamples = {
  basic: {
    code: `<Gutter>
  <div>Content aligned to the Admin Panel gutter</div>
</Gutter>`,
    design: gutterDesign,
  },
}

const linkExamples: ComponentExamples = {
  basic: {
    code: `<Link className="custom-admin-link" href="/admin/collections/posts">
  View posts
</Link>`,
    design: linkDesign,
  },
}

const listAndPaginationExamples: ComponentExamples = {
  pagination: {
    code: `const [page, setPage] = useState(4)
const totalPages = 12

<Pagination
  hasNextPage={page < totalPages}
  hasPrevPage={page > 1}
  nextPage={page + 1}
  onChange={setPage}
  page={page}
  prevPage={page - 1}
  totalPages={totalPages}
/>`,
    design: paginationDesign,
  },
}

const motionAndLoadingExamples: ComponentExamples = {
  overlay: {
    code: `const [show, setShow] = useState(false)

<Button onClick={() => setShow(true)}>Show loading overlay</Button>
<LoadingOverlay animationDuration="160ms" show={show} />`,
    design: loadingOverlayDesign,
  },
  progress: {
    code: `<RouteTransitionProvider>
  <ProgressBar />
  <Link href="/admin/collections/posts">View posts</Link>
</RouteTransitionProvider>`,
    design: progressBarDesign,
  },
  staggered: {
    code: `<StaggeredShimmers
  count={4}
  height={12}
  renderDelay={0}
  shimmerDelay={75}
/>`,
    design: shimmerDesign,
  },
}

const pillExamples: ComponentExamples = {
  shapes: {
    code: `<Pill>Default</Pill>
<Pill rounded>Rounded</Pill>`,
    design: pillShapeDesign,
  },
  sizes: {
    code: `<Pill size="small">Small</Pill>
<Pill size="medium">Medium</Pill>`,
    design: pillSizeDesign,
  },
  styles: {
    code: `<Pill>Default</Pill>
<Pill pillStyle="dark">Dark</Pill>
<Pill pillStyle="success">Success</Pill>
<Pill pillStyle="warning">Warning</Pill>
<Pill pillStyle="error">Error</Pill>`,
    design: pillStylesDesign,
  },
}

const pillSelectorExamples: ComponentExamples = {
  interactive: {
    code: `const [pills, setPills] = useState([
  { name: 'Posts', selected: true },
  { name: 'Media', selected: false },
  { name: 'Users', selected: true },
])

<PillSelector
  onClick={({ pill }) => {
    setPills((current) =>
      current.map((item) =>
        item.name === pill.name
          ? { ...item, selected: !item.selected }
          : item,
      ),
    )
  }}
  pills={pills}
/>`,
    design: pillSelectorDesign,
  },
}

const reactSelectExamples: ComponentExamples = {
  basic: {
    code: `import type { ReactSelectOption } from '@payloadcms/ui'

const options: ReactSelectOption[] = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
]

const [value, setValue] = useState<ReactSelectOption | null>(options[0] ?? null)

const handleChange = (
  nextValue: ReactSelectOption | ReactSelectOption[] | null,
) => {
  setValue(Array.isArray(nextValue) ? null : nextValue)
}

<ReactSelect
  aria-label="Status"
  isClearable={false}
  onChange={handleChange}
  options={options}
  placeholder="Select a status"
  value={value}
/>`,
    design: reactSelectDesign,
  },
  multiple: {
    code: `import type { ReactSelectOption } from '@payloadcms/ui'

const options: ReactSelectOption[] = [
  { label: 'Posts', value: 'posts' },
  { label: 'Media', value: 'media' },
  { label: 'Pages', value: 'pages' },
  { label: 'Users', value: 'users' },
]

const [value, setValue] = useState<ReactSelectOption[]>(options.slice(0, 2))

const handleChange = (
  nextValue: ReactSelectOption | ReactSelectOption[] | null,
) => {
  setValue(Array.isArray(nextValue) ? nextValue : nextValue ? [nextValue] : [])
}

<ReactSelect
  aria-label="Collections"
  isMulti
  isSortable
  onChange={handleChange}
  options={options}
  placeholder="Select collections"
  value={value}
/>`,
    design: reactSelectDesign,
  },
}

const shimmerEffectExamples: ComponentExamples = {
  basic: {
    code: `<ShimmerEffect height={60} width="100%" />`,
    design: shimmerDesign,
  },
  shapes: {
    code: `<ShimmerEffect height={48} style={{ borderRadius: '50%' }} width={48} />
<ShimmerEffect height={16} width="75%" />
<ShimmerEffect height={16} width="50%" />`,
    design: shimmerDesign,
  },
}

export const v4ComponentExamples: Record<string, ComponentExamples> = {
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
