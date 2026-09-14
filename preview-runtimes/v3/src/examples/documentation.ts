import type { ComponentDesign, ComponentDocumentation } from './types'

import { componentDesigns } from './designs'

const buttonColorDesign: ComponentDesign = {
  code: `.btn--style-primary {
  --bg-color: #6d5dfc;
  --color: #ffffff;
  --hover-bg: #5947e5;
  --hover-color: #ffffff;
}`,
  description:
    'Add this override to your Admin Panel stylesheet to change primary Buttons without changing the rest of the Payload color system.',
  variables: [
    {
      name: '--bg-color',
      description: 'Button background.',
    },
    {
      name: '--color',
      description: 'Button label and icon color.',
    },
    {
      name: '--hover-bg',
      description: 'Background shown on hover, focus, and active states.',
    },
    {
      name: '--hover-color',
      description: 'Label and icon color shown on hover, focus, and active states.',
    },
    {
      name: '--btn-border',
      description: 'Optional button border.',
    },
    {
      name: '--hover-btn-border',
      description: 'Optional border shown on hover, focus, and active states.',
    },
  ],
}

const buttonDisabledDesign: ComponentDesign = {
  code: `.btn--style-primary.btn--disabled {
  --bg-color: #e3e1f5;
  --color: #625d82;
}`,
  description:
    'Disabled styles use a more specific selector. Target both classes to customize the unavailable state without changing enabled Buttons.',
  variables: [
    {
      name: '--bg-color',
      description: 'Disabled button background.',
    },
    {
      name: '--color',
      description: 'Disabled label and icon color.',
    },
  ],
}

const buttonSizeDesign: ComponentDesign = {
  code: `.btn--size-medium {
  --btn-padding-block-start: 0.5rem;
  --btn-padding-inline-end: 1rem;
  --btn-padding-block-end: 0.5rem;
  --btn-padding-inline-start: 1rem;
}`,
  description:
    'Target a size class in your Admin Panel stylesheet when a project needs different Button dimensions.',
  variables: [
    {
      name: '--btn-padding-block-start',
      description: 'Top padding.',
    },
    {
      name: '--btn-padding-inline-end',
      description: 'Right padding in left-to-right layouts.',
    },
    {
      name: '--btn-padding-block-end',
      description: 'Bottom padding.',
    },
    {
      name: '--btn-padding-inline-start',
      description: 'Left padding in left-to-right layouts.',
    },
  ],
}

const buttonStylesDesign: ComponentDesign = {
  code: `.btn--style-primary {
  --bg-color: #6d5dfc;
  --color: #ffffff;
  --hover-bg: #5947e5;
  --hover-color: #ffffff;
}

.btn--style-secondary {
  --color: #6d5dfc;
  --btn-border: 1px solid #6d5dfc;
  --hover-color: #5947e5;
  --hover-btn-border: 1px solid #5947e5;
}

.btn--style-error {
  --bg-color: #c7362f;
  --color: #ffffff;
  --hover-bg: #a92c27;
  --hover-color: #ffffff;
}`,
  description:
    'Each Button style has its own class, so a project can customize primary, secondary, and destructive actions independently.',
  variables: buttonColorDesign.variables,
}

export const v3ComponentDocumentation: Record<string, ComponentDocumentation> = {
  AnimateHeight: {
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
  <div>Expandable content</div>
</AnimateHeight>`,
      design: componentDesigns['AnimateHeight']['interactive'],
    },
  },
  Banner: {
    basic: {
      code: `<Banner>Changes saved successfully.</Banner>`,
      design: componentDesigns['Banner']['basic'],
    },
    variants: {
      code: `<Banner type="default">Default message</Banner>
<Banner type="success">Changes saved successfully.</Banner>
<Banner type="info">Additional context is available.</Banner>
<Banner type="error">Something went wrong.</Banner>`,
      design: componentDesigns['Banner']['variants'],
    },
  },
  Button: {
    disabled: {
      code: `<Button disabled margin={false}>Save changes</Button>`,
      design: buttonDisabledDesign,
    },
    primary: {
      code: `<Button margin={false}>Save changes</Button>`,
      design: buttonColorDesign,
    },
    sizes: {
      code: `<Button margin={false} size="xsmall">Extra small</Button>
<Button margin={false} size="small">Small</Button>
<Button margin={false} size="medium">Medium</Button>
<Button margin={false} size="large">Large</Button>`,
      design: buttonSizeDesign,
    },
    styles: {
      code: `<Button margin={false}>Primary</Button>
<Button buttonStyle="secondary" margin={false}>Secondary</Button>
<Button buttonStyle="error" margin={false}>Delete</Button>`,
      design: buttonStylesDesign,
    },
  },
  Card: {
    actions: {
      code: `<Card
  actions={
    <Button
      aria-label="Create new Post"
      buttonStyle="icon-label"
      icon="plus"
      iconStyle="with-border"
      onClick={() => createPost()}
      round
    />
  }
  title="Posts"
/>`,
      design: componentDesigns['Card']['actions'],
    },
    basic: {
      code: `<Card title="Posts" />`,
      design: componentDesigns['Card']['basic'],
    },
  },
  CodeEditor: {
    readOnly: {
      code: `<CodeEditor
  defaultLanguage="json"
  minHeight={110}
  readOnly
  value={'{\\n  "title": "Payload UI",\\n  "enabled": true\\n}'}
/>`,
      design: componentDesigns['CodeEditor']['readOnly'],
    },
  },
  Collapsible: {
    basic: {
      code: `<Collapsible header="Collapsible header">
  Collapsible content
</Collapsible>`,
      design: componentDesigns['Collapsible']['basic'],
    },
    error: {
      code: `<Collapsible collapsibleStyle="error" header="Collapsible header">
  Correct the invalid fields in this section.
</Collapsible>`,
      design: componentDesigns['Collapsible']['error'],
    },
  },
  CopyToClipboard: {
    basic: {
      code: `<span>post_123456789</span>
<CopyToClipboard defaultMessage="Copy ID" successMessage="ID copied" value="post_123456789" />`,
      design: componentDesigns['CopyToClipboard']['basic'],
    },
  },
  DatePicker: {
    basic: {
      code: `const [value, setValue] = useState<Date>()

<label htmlFor="publish-date">Date</label>
<DatePicker
  id="publish-date"
  onChange={(date) => setValue(date || undefined)}
  placeholder="Select a date"
  value={value}
/>`,
      design: componentDesigns['DatePicker']['basic'],
    },
  },
  Dropzone: {
    basic: {
      code: `const inputRef = useRef<HTMLInputElement>(null)
const [fileNames, setFileNames] = useState<string[]>([])

const selectFiles = (files: FileList) => {
  setFileNames(Array.from(files, (file) => file.name))
}

<Dropzone multipleFiles onChange={selectFiles}>
  <Button
    buttonStyle="secondary"
    margin={false}
    onClick={() => inputRef.current?.click()}
    size="small"
  >
    Select files
  </Button>
  <input
    aria-label="Select files"
    hidden
    multiple
    onChange={(event) => event.target.files && selectFiles(event.target.files)}
    ref={inputRef}
    type="file"
  />
  <span>{fileNames.length ? fileNames.join(', ') : 'or drag and drop files here'}</span>
</Dropzone>`,
      design: componentDesigns['Dropzone']['basic'],
    },
  },
  ErrorPill: {
    counts: {
      code: `const { i18n } = useTranslation()

<ErrorPill count={1} i18n={i18n} />
<ErrorPill count={12} i18n={i18n} />
<ErrorPill count={120} i18n={i18n} />`,
      design: componentDesigns['ErrorPill']['counts'],
    },
  },
  Gutter: {
    basic: {
      code: `<Gutter>
  <div>Content aligned to the Admin Panel gutter</div>
</Gutter>`,
      design: componentDesigns['Gutter']['basic'],
    },
  },
  Hamburger: {
    states: {
      code: `<Hamburger />
<Hamburger isActive />
<Hamburger closeIcon="collapse" isActive />`,
      design: componentDesigns['Hamburger']['states'],
    },
  },
  Link: {
    basic: {
      code: `<Link className="custom-admin-link" href="/admin/collections/posts">
  View posts
</Link>`,
      design: componentDesigns['Link']['basic'],
    },
  },
  ListAndPagination: {
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
      design: componentDesigns['ListAndPagination']['pagination'],
    },
  },
  ModalsAndDrawers: {
    confirmation: {
      code: `const modalSlug = 'confirm-action'
const { openModal } = useModal()

<Button onClick={() => openModal(modalSlug)}>Open confirmation modal</Button>
<ConfirmationModal
  body="Confirm before continuing with this action."
  cancelLabel="Cancel"
  confirmLabel="Confirm"
  heading="Confirm action"
  modalSlug={modalSlug}
  onConfirm={() => performAction()}
/>`,
      design: componentDesigns['ModalsAndDrawers']['confirmation'],
    },
    drawer: {
      code: `const drawerSlug = 'example-drawer'
const { closeModal, openModal } = useModal()

<Button onClick={() => openModal(drawerSlug)}>Open drawer</Button>
<Drawer slug={drawerSlug} title="Drawer example">
  <DrawerContentContainer>
    <p>Place supporting information or controls related to the current view here.</p>
    <Button
      buttonStyle="secondary"
      onClick={() => closeModal(drawerSlug)}
    >
      Close drawer
    </Button>
  </DrawerContentContainer>
</Drawer>`,
      design: componentDesigns['ModalsAndDrawers']['drawer'],
    },
  },
  MotionAndLoading: {
    overlay: {
      code: `const [show, setShow] = useState(false)

<Button onClick={() => setShow(true)}>Show loading overlay</Button>
<LoadingOverlay loadingText="Loading" show={show} />`,
      design: componentDesigns['MotionAndLoading']['overlay'],
    },
    progress: {
      code: `<RouteTransitionProvider>
  <ProgressBar />
  <Link href="/admin/collections/posts">View posts</Link>
</RouteTransitionProvider>`,
      design: componentDesigns['MotionAndLoading']['progress'],
    },
    staggered: {
      code: `<StaggeredShimmers
  count={4}
  height={12}
  renderDelay={0}
  shimmerDelay={75}
/>`,
      design: componentDesigns['MotionAndLoading']['staggered'],
    },
  },
  Pill: {
    shapes: {
      code: `<Pill>Default</Pill>
<Pill rounded>Rounded</Pill>`,
      design: componentDesigns['Pill']['shapes'],
    },
    sizes: {
      code: `<Pill size="small">Small</Pill>
<Pill size="medium">Medium</Pill>`,
      design: componentDesigns['Pill']['sizes'],
    },
    styles: {
      code: `<Pill>Default</Pill>
<Pill pillStyle="dark">Dark</Pill>
<Pill pillStyle="success">Success</Pill>
<Pill pillStyle="warning">Warning</Pill>
<Pill pillStyle="error">Error</Pill>`,
      design: componentDesigns['Pill']['styles'],
    },
  },
  PillSelector: {
    interactive: {
      code: `const [pills, setPills] = useState([
  { name: 'Posts', selected: true },
  { name: 'Media', selected: false },
])

<PillSelector
  pills={pills}
  onClick={({ pill }) => {
    setPills(current => current.map(item =>
      item.name === pill.name ? { ...item, selected: !item.selected } : item
    ))
  }}
/>`,
      design: componentDesigns['PillSelector']['interactive'],
    },
  },
  Popup: {
    menu: {
      code: `<Popup button="Actions" size="small">
  <PopupList.ButtonGroup>
    <PopupList.Button onClick={() => editDocument()}>Edit</PopupList.Button>
    <PopupList.Button onClick={() => duplicateDocument()}>Duplicate</PopupList.Button>
    <PopupList.Divider />
    <PopupList.Button onClick={() => deleteDocument()}>Delete</PopupList.Button>
  </PopupList.ButtonGroup>
</Popup>`,
      design: componentDesigns['Popup']['menu'],
    },
  },
  ReactSelect: {
    basic: {
      code: `const options = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
]

const [value, setValue] = useState(options[0])

<ReactSelect
  isClearable={false}
  onChange={setValue}
  options={options}
  placeholder="Select a status"
  value={value}
/>`,
      design: componentDesigns['ReactSelect']['basic'],
    },
  },
  SearchFilter: {
    interactive: {
      code: `const [search, setSearch] = useState('')

<SearchBar
  label="Search posts"
  onSearchChange={(value) => setSearch(value || '')}
/>`,
      design: componentDesigns['SearchFilter']['interactive'],
    },
  },
  ShimmerEffect: {
    basic: {
      code: `<ShimmerEffect height={60} width="100%" />`,
      design: componentDesigns['ShimmerEffect']['basic'],
    },
    shapes: {
      code: `<ShimmerEffect height={48} style={{ borderRadius: '50%' }} width={48} />
<ShimmerEffect height={16} width="75%" />
<ShimmerEffect height={16} width="50%" />`,
      design: componentDesigns['ShimmerEffect']['shapes'],
    },
  },
  Table: {
    basic: {
      code: `const rows = [
  { id: '1', name: 'Button', status: 'Documented' },
  { id: '2', name: 'DatePicker', status: 'In progress' },
  { id: '3', name: 'Upload', status: 'Planned' },
]

const columns: Column[] = [
  {
    accessor: 'name',
    active: true,
    field: { name: 'name', type: 'text' } as ClientField,
    Heading: 'Component',
    renderedCells: rows.map((row) => row.name),
  },
  {
    accessor: 'status',
    active: true,
    field: { name: 'status', type: 'text' } as ClientField,
    Heading: 'Status',
    renderedCells: rows.map((row) => row.status),
  },
]

<Table columns={columns} data={rows} />`,
      design: componentDesigns['Table']['basic'],
    },
  },
  Thumbnail: {
    fallback: {
      code: `<Thumbnail size="medium" />`,
      design: componentDesigns['Thumbnail']['fallback'],
    },
    sizes: {
      code: `<Thumbnail size="small" />
<Thumbnail size="medium" />
<Thumbnail size="large" />`,
      design: componentDesigns['Thumbnail']['sizes'],
    },
  },
  TimezonePicker: {
    basic: {
      code: `const options = [
  { label: 'America/Detroit', value: 'America/Detroit' },
  { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
  { label: 'Europe/London', value: 'Europe/London' },
]

const [timezone, setTimezone] = useState('America/Detroit')

<TimezonePicker
  id="timezone"
  onChange={setTimezone}
  options={options}
  selectedTimezone={timezone}
/>`,
      design: componentDesigns['TimezonePicker']['basic'],
    },
  },
  Tooltip: {
    interactive: {
      code: `const [show, setShow] = useState(false)

<div style={{ position: 'relative' }}>
  <Button
    buttonStyle="secondary"
    extraButtonProps={{
      onBlur: () => setShow(false),
      onFocus: () => setShow(true),
      onMouseEnter: () => setShow(true),
      onMouseLeave: () => setShow(false),
    }}
    margin={false}
  >
    Hover or focus
  </Button>
  <Tooltip delay={0} position="top" show={show} staticPositioning>
    Helpful context
  </Tooltip>
</div>`,
      design: componentDesigns['Tooltip']['interactive'],
    },
  },
}
