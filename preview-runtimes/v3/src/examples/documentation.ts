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
  DocumentActions: {
    bulk: {
      code: `<EditMany collection={collection} />
<PublishMany collection={collection} />
<UnpublishMany collection={collection} />
<DeleteMany collection={collection} />`,
      design: {
        code: `.list-selection__button {
  color: #6d5dfc;
  font-weight: 600;
}

.list-selection__button:hover,
.list-selection__button:focus-visible {
  color: #5947e5;
  text-decoration: underline;
}`,
        description:
          'Bulk actions share the ListSelection button treatment. Override that class to customize selection actions without changing standard Buttons.',
        variables: [
          { name: 'color', description: 'Bulk action label color.' },
          { name: 'font-weight', description: 'Bulk action label emphasis.' },
          { name: 'text-decoration', description: 'Interaction feedback for bulk actions.' },
        ],
      },
    },
    editView: {
      code: `<SaveDraftButton />
<PublishButton />`,
      design: {
        code: `#action-save-draft.btn--style-secondary {
  --color: #6d5dfc;
  --btn-border: 1px solid #6d5dfc;
  --hover-color: #5947e5;
  --hover-btn-border: 1px solid #5947e5;
}

#action-publish.btn--style-primary {
  --bg-color: #6d5dfc;
  --color: #ffffff;
  --hover-bg: #5947e5;
  --hover-color: #ffffff;
}`,
        description:
          'Use the stable action IDs together with Button style classes when Save and Publish controls need treatment distinct from other Admin buttons.',
        variables: [
          { name: '--bg-color', description: 'Primary action background.' },
          { name: '--color', description: 'Action label color.' },
          { name: '--hover-bg', description: 'Primary action background on interaction.' },
          { name: '--btn-border', description: 'Secondary action border.' },
          { name: '--hover-btn-border', description: 'Secondary action border on interaction.' },
        ],
      },
    },
    save: {
      code: `<SaveButton />`,
      design: {
        code: `#action-save.btn--style-primary {
  --bg-color: #6d5dfc;
  --color: #ffffff;
  --hover-bg: #5947e5;
  --hover-color: #ffffff;
}`,
        description:
          'Use the Save action ID together with its Button style class when the document Save control needs treatment distinct from other primary Admin buttons.',
        variables: [
          { name: '--bg-color', description: 'Save action background.' },
          { name: '--color', description: 'Save action label color.' },
          { name: '--hover-bg', description: 'Save action background on interaction.' },
          { name: '--hover-color', description: 'Save action label color on interaction.' },
        ],
      },
    },
  },
  DocumentState: {
    lockedDocument: {
      code: `<DocumentLocked
  handleGoBack={() => router.back()}
  isActive={isLocked}
  onReadOnly={() => setReadOnly(true)}
  onTakeOver={takeOverDocument}
  updatedAt={lockedAt}
  user={lockingUser}
/>`,
      design: {
        code: `.document-locked,
.document-take-over {
  background: rgb(255 255 255 / 88%);
  backdrop-filter: blur(8px);
}

.document-locked__wrapper,
.document-take-over__wrapper {
  border: 1px solid #c8c0ff;
  border-radius: 8px;
}`,
        description:
          'Target each document-state surface and its inner wrapper to customize the interruption without changing its permission or navigation behavior.',
        variables: [
          { name: 'background', description: 'Surface displayed over the interrupted Edit View.' },
          {
            name: 'backdrop-filter',
            description: 'Visual separation from the underlying document.',
          },
          { name: 'border', description: 'Optional outline around the state message.' },
          { name: 'border-radius', description: 'State message corner radius.' },
        ],
      },
    },
    lockIndicator: {
      code: `<Locked user={lockingUser} />`,
      design: {
        code: `.locked {
  color: #6d5dfc;
  background: #f3f1ff;
  border: 1px solid #c8c0ff;
  border-radius: 999px;
  padding: 0.35rem;
}`,
        description:
          'Style the compact Locked indicator directly while preserving its built-in editor tooltip.',
        variables: [
          { name: 'color', description: 'Lock icon color.' },
          { name: 'background', description: 'Indicator surface.' },
          { name: 'border', description: 'Indicator outline.' },
          { name: 'padding', description: 'Clickable area around the lock icon.' },
        ],
      },
    },
    takenOver: {
      code: `<DocumentTakeOver
  handleBackToDashboard={() => router.push('/admin')}
  isActive={hasLostEditAccess}
  onReadOnly={() => setReadOnly(true)}
/>`,
      design: {
        code: `.document-locked,
.document-take-over {
  background: rgb(255 255 255 / 88%);
  backdrop-filter: blur(8px);
}

.document-locked__wrapper,
.document-take-over__wrapper {
  border: 1px solid #c8c0ff;
  border-radius: 8px;
}`,
        description:
          'Target each document-state surface and its inner wrapper to customize the interruption without changing its permission or navigation behavior.',
        variables: [
          { name: 'background', description: 'Surface displayed over the interrupted Edit View.' },
          {
            name: 'backdrop-filter',
            description: 'Visual separation from the underlying document.',
          },
          { name: 'border', description: 'Optional outline around the state message.' },
          { name: 'border-radius', description: 'State message corner radius.' },
        ],
      },
    },
  },
  DraggableSortable: {
    basic: {
      code: `'use client'

import {
  Button,
  DraggableSortable,
  DraggableSortableItem,
  DragHandleIcon,
} from '@payloadcms/ui'
import { useState } from 'react'

const initialItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
  { id: 'settings', label: 'Settings' },
]

const moveItem = (items, moveFromIndex, moveToIndex) => {
  const nextItems = [...items]
  const [movedItem] = nextItems.splice(moveFromIndex, 1)
  nextItems.splice(moveToIndex, 0, movedItem)
  return nextItems
}

export function SortableList() {
  const [items, setItems] = useState(initialItems)

  return (
    <DraggableSortable
      ids={items.map(({ id }) => id)}
      onDragEnd={({ moveFromIndex, moveToIndex }) => {
        setItems((current) => moveItem(current, moveFromIndex, moveToIndex))
      }}
    >
      {items.map(({ id, label }) => (
        <DraggableSortableItem id={id} key={id}>
          {({ attributes, isDragging, listeners, setNodeRef, transform, transition }) => (
            <div
              ref={setNodeRef}
              style={{ opacity: isDragging ? 0.6 : 1, transform, transition }}
            >
              <span>{label}</span>
              <Button
                aria-label={\`Reorder \${label}\`}
                buttonStyle="icon-label"
                extraButtonProps={{ ...attributes, ...listeners }}
                icon={<DragHandleIcon />}
                margin={false}
              />
            </div>
          )}
        </DraggableSortableItem>
      ))}
    </DraggableSortable>
  )
}`,
      design: {
        code: `.sortable-list {
  display: grid;
  gap: calc(var(--base) / 2);
}

.sortable-item {
  align-items: center;
  background: var(--theme-elevation-50);
  border: 1px solid var(--theme-elevation-200);
  display: flex;
  justify-content: space-between;
  padding: calc(var(--base) / 2) var(--base);
}`,
        description:
          'Style the list and row wrappers while leaving the drag transform and transition inline on each item. Payload theme variables keep the surface consistent across light and dark modes.',
        variables: [
          { name: '--theme-elevation-50', description: 'Sortable item background.' },
          { name: '--theme-elevation-200', description: 'Sortable item border.' },
          { name: '--base', description: 'Spacing within and between items.' },
        ],
      },
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
  Icons: {
    gallery: {
      code: `import { CopyIcon, EditIcon, PlusIcon, SearchIcon } from '@payloadcms/ui'

export function Toolbar() {
  return (
    <div className="toolbar">
      <span aria-hidden="true"><PlusIcon /></span>
      <span aria-hidden="true"><EditIcon /></span>
      <span aria-hidden="true"><CopyIcon /></span>
      <span aria-hidden="true"><SearchIcon /></span>
    </div>
  )
}`,
      design: {
        code: `.toolbar-icon {
  color: var(--theme-text);
  display: inline-flex;
}

.toolbar-icon svg {
  height: 1.25rem;
  width: 1.25rem;
}

.toolbar-icon:hover {
  color: var(--theme-elevation-600);
}`,
        description:
          'Icons use currentColor, so set color on a wrapper to follow your theme. Target the nested SVG only when the surrounding layout requires a consistent size.',
        variables: [
          { name: 'color', description: 'Stroke or fill color inherited by the icon.' },
          { name: 'height', description: 'Rendered icon height.' },
          { name: 'width', description: 'Rendered icon width.' },
        ],
      },
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
  StepNavigation: {
    customView: {
      code: `const stepNav = [
  { label: 'Orders', url: '/admin/collections/orders' },
  { label: 'Order #1042' },
]

export function OrderView() {
  return (
    <>
      <SetStepNav nav={stepNav} />
      <Gutter>
        <h1>Order #1042</h1>
      </Gutter>
    </>
  )
}`,
      design: {
        code: `.step-nav {
  gap: 0.75rem;
}

.step-nav a {
  color: #6d5dfc;
  text-decoration-color: #b8adff;
}`,
        description:
          'Target the existing StepNav in your Admin Panel stylesheet to adjust breadcrumb spacing and linked-item treatment across Custom Views.',
        variables: [
          {
            name: 'gap',
            description: 'Space between the home link, separators, and breadcrumb items.',
          },
          { name: 'color', description: 'Linked breadcrumb text and inherited icon color.' },
          {
            name: 'text-decoration-color',
            description: 'Underline color shown when a breadcrumb link is hovered or focused.',
          },
        ],
      },
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
  TableCells: {
    custom: {
      code: `'use client'

import type { DefaultCellComponentProps } from 'payload'
import { Pill } from '@payloadcms/ui'

const variantLabels = {
  alpha: 'Alpha',
  beta: 'Beta',
  gamma: 'Gamma',
  delta: 'Delta',
  epsilon: 'Epsilon',
} as const

type Variant = keyof typeof variantLabels

const isVariant = (value: unknown): value is Variant =>
  typeof value === 'string' && value in variantLabels

export const CustomCell = ({ cellData }: DefaultCellComponentProps) => {
  const variant = isVariant(cellData) ? cellData : 'other'
  const label = isVariant(cellData)
    ? variantLabels[cellData]
    : String(cellData ?? 'Other')

  return (
    <Pill className={['custom-cell', 'custom-cell--' + variant].join(' ')}>
      {label}
    </Pill>
  )
}`,
      design: {
        code: `.table .custom-cell {
  background: var(--cell-background, var(--theme-elevation-100));
  border: 1px solid var(--cell-border, var(--theme-elevation-250));
  border-radius: 999px;
  color: var(--cell-text, var(--theme-text));
  font-weight: 600;
}

.custom-cell--alpha {
  --cell-background: #eee8ff;
  --cell-border: #a99be8;
  --cell-text: #41317d;
}

.custom-cell--beta {
  --cell-background: #dff1ff;
  --cell-border: #78add1;
  --cell-text: #174d70;
}

.custom-cell--gamma {
  --cell-background: #ffe3f0;
  --cell-border: #d68eae;
  --cell-text: #71334f;
}

.custom-cell--delta {
  --cell-background: #dff5e8;
  --cell-border: #7eb996;
  --cell-text: #245d3b;
}

.custom-cell--epsilon {
  --cell-background: #fff0d9;
  --cell-border: #d2a25d;
  --cell-text: #704914;
}`,
        description:
          'Use one shared cell rule and assign color tokens from a stable modifier class for each known value. Values without a modifier use the neutral fallback colors.',
        variables: [
          { name: '--cell-background', description: 'Surface color for a custom value.' },
          { name: '--cell-text', description: 'Text color for a custom value.' },
          { name: '--cell-border', description: 'Outline color for a custom value.' },
          { name: 'border-radius', description: 'Shape of the custom value treatment.' },
          { name: 'font-weight', description: 'Emphasis applied to the custom value.' },
        ],
      },
    },
    defaults: {
      code: `<DefaultCell
  cellData={row.title}
  collectionSlug="posts"
  field={titleField}
  link={false}
  rowData={row}
/>`,
      design: {
        code: `.table .cell-title {
  color: var(--theme-text);
  font-weight: 600;
}

.table .cell-publishedAt {
  color: var(--theme-elevation-600);
}`,
        description:
          'Target the column class generated from each accessor to adjust a built-in cell without replacing its value formatting.',
        variables: [
          { name: 'color', description: 'Text color for a specific column.' },
          { name: 'font-weight', description: 'Text emphasis for a specific column.' },
        ],
      },
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
  UploadHelpers: {
    fileDetails: {
      code: `<FileDetails
  collectionSlug="media"
  doc={doc}
  hideRemoveFile
  uploadConfig={uploadConfig}
/>`,
      design: {
        code: `.file-details {
  background: #f9f8ff;
  border: 1px solid #c8c0ff;
  border-radius: 8px;
}

.file-details__thumbnail {
  border-radius: 6px;
}`,
        description:
          'Customize the FileDetails surface and thumbnail while preserving its metadata, copy, adjustment, and removal behavior.',
        variables: [
          { name: 'background', description: 'File summary surface.' },
          { name: 'border', description: 'File summary outline.' },
          { name: 'border-radius', description: 'Summary and thumbnail corner radius.' },
        ],
      },
    },
    previewSizes: {
      code: `<PreviewSizes doc={doc} uploadConfig={uploadConfig} />`,
      design: {
        code: `.preview-sizes__sizeOption:hover,
.preview-sizes--selected {
  background: #f3f1ff;
}

.preview-sizes__imageWrap {
  border-color: #c8c0ff;
}`,
        description:
          'Target the selected size and structural regions to align the PreviewSizes browser with a project’s media treatment.',
        variables: [
          { name: 'background', description: 'Selected and hovered size surface.' },
          { name: 'border-color', description: 'Divider between the preview and size list.' },
        ],
      },
    },
  },
}
