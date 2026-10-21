import type { ComponentDocumentation } from '../types'

const dropzoneDesign = {
  code: `@layer payload {
  .dropzone {
    background: var(--color-bg-secondary);
    border-color: var(--color-border);
    border-radius: var(--radius-medium);
  }
}`,
  description:
    'Override semantic surface, border, and radius tokens on Dropzone while preserving its drag-and-drop interaction states.',
  variables: [
    { name: '--color-bg-secondary', description: 'Drop target surface.' },
    { name: '--color-border', description: 'Drop target outline.' },
    { name: '--radius-medium', description: 'Drop target corner radius.' },
  ],
}

export const adminDocumentation: Record<string, ComponentDocumentation> = {
  ChoiceInputs: {
    checkbox: {
      code: `const [checked, setChecked] = useState(true)

<CheckboxInput
  checked={checked}
  label="Feature this project"
  name="featured"
  onToggle={(event) => setChecked(event.target.checked)}
/>`,
      design: {
        code: `.checkbox-input__input {
  border-color: var(--color-border);
  border-radius: 4px;
}

.checkbox-input--checked .checkbox-input__input {
  background: var(--color-text);
  color: var(--color-text-onbrand);
}`,
        description:
          'Style the checkbox control and its checked modifier while leaving the native input and label connection intact.',
        variables: [
          { name: 'background', description: 'Checked control surface.' },
          { name: 'border-color', description: 'Checkbox outline.' },
          { name: 'border-radius', description: 'Checkbox corner radius.' },
          { name: 'color', description: 'Check icon color.' },
        ],
      },
    },
    select: {
      code: `const options = [
  { label: 'Planned', value: 'planned' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Complete', value: 'complete' },
]

const [value, setValue] = useState('in-progress')

<SelectInput
  label="Status"
  name="status"
  onChange={(option) => setValue(option?.value || '')}
  options={options}
  path="status"
  value={value}
/>`,
      design: {
        code: `.field-type.select .rs__control {
  background: var(--color-bg);
  border-color: var(--color-border);
  border-radius: 6px;
}

.field-type.select .rs__control--is-focused {
  border-color: var(--color-border-brand-strong);
}`,
        description:
          'Customize the ReactSelect control within SelectInput while retaining Payload’s field label, description, and error structure.',
        variables: [
          { name: '--color-bg', description: 'Select control surface.' },
          { name: 'border-color', description: 'Resting and focused outline color.' },
          { name: 'border-radius', description: 'Select control corner radius.' },
        ],
      },
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
  ChevronIcon,
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
      {items.map(({ id, label }, index) => (
        <DraggableSortableItem id={id} key={id}>
          {({ attributes, isDragging, listeners, setNodeRef, transform, transition }) => (
            <div
              ref={setNodeRef}
              style={{ opacity: isDragging ? 0.6 : 1, transform, transition }}
            >
              <span>{label}</span>
              <div className="sortable-actions">
                <Button
                  aria-label={\`Move \${label} up\`}
                  buttonStyle="ghost"
                  disabled={index === 0}
                  icon={<ChevronIcon direction="up" size={16} />}
                  margin={false}
                  onClick={() => setItems((current) => moveItem(current, index, index - 1))}
                />
                <Button
                  aria-label={\`Move \${label} down\`}
                  buttonStyle="ghost"
                  disabled={index === items.length - 1}
                  icon={<ChevronIcon direction="down" size={16} />}
                  margin={false}
                  onClick={() => setItems((current) => moveItem(current, index, index + 1))}
                />
                <Button
                  aria-label={\`Drag to reorder \${label}\`}
                  buttonStyle="ghost"
                  extraButtonProps={{ ...attributes, ...listeners }}
                  icon={<DragHandleIcon />}
                  margin={false}
                />
              </div>
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
  gap: var(--spacer-2);
}

.sortable-item {
  align-items: center;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  padding: var(--spacer-2) var(--spacer-3);
}`,
        description:
          'Style the list and row wrappers while leaving the drag transform and transition inline on each item. Payload theme variables keep the surface consistent across light and dark modes.',
        variables: [
          { name: '--color-bg-secondary', description: 'Sortable item background.' },
          { name: '--color-border', description: 'Sortable item border.' },
          { name: '--spacer-2', description: 'Spacing within and between items.' },
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
    margin={false}
    onClick={() => inputRef.current?.click()}
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
      design: dropzoneDesign,
    },
    uploadEmptyState: {
      code: `const inputRef = useRef<HTMLInputElement>(null)
const [fileName, setFileName] = useState<string>()

const selectFile = (files: FileList) => {
  setFileName(files[0]?.name)
}

<Dropzone onChange={selectFile}>
  <Button
    buttonStyle="pill"
    margin={false}
    onClick={() => inputRef.current?.click()}
    size="medium"
  >
    Select a file
  </Button>
  <input
    aria-label="Select a file"
    hidden
    onChange={(event) => event.target.files && selectFile(event.target.files)}
    ref={inputRef}
    type="file"
  />
  <span>or</span>
  <Button buttonStyle="pill" margin={false} size="medium">
    Paste URL
  </Button>
  <span>{fileName || 'or drag and drop a file'}</span>
</Dropzone>`,
      design: dropzoneDesign,
    },
  },
  FieldChrome: {
    labels: {
      code: `<div className="field-type text">
  <FieldLabel
    htmlFor="project-name"
    label="Project name"
    required
  />
  <div className="field-type__wrap">
    <input
      aria-label="Project name"
      defaultValue="Payload website"
      id="project-name"
      type="text"
    />
  </div>
</div>`,
      design: {
        code: `.field-label {
  color: var(--color-text);
  font-weight: 600;
}

.field-label .required {
  color: var(--color-text-danger);
}`,
        description:
          'Style the shared FieldLabel class and its required marker to keep custom inputs aligned with the rest of the Admin Panel.',
        variables: [
          { name: 'color', description: 'Label and required-marker color.' },
          { name: 'font-weight', description: 'Label emphasis.' },
        ],
      },
    },
    messages: {
      code: `<div className="field-type text error">
  <FieldLabel
    htmlFor="project-slug"
    label="Project slug"
    required
  />
  <div className="field-type__wrap">
    <FieldError
      message="This field is required."
      path="projectSlug"
      showError
    />
    <input
      aria-invalid="true"
      aria-label="Project slug"
      id="project-slug"
      type="text"
    />
    <FieldDescription
      description="Use a short, recognizable slug for this project."
      path="projectSlug"
    />
  </div>
</div>`,
      design: {
        code: `.field-description {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.field-error.tooltip {
  background: var(--color-bg-danger);
  color: var(--color-text-ondanger);
}`,
        description:
          'Customize helper and validation messages through their shared classes while preserving the visibility behavior controlled by the field state.',
        variables: [
          { name: 'background', description: 'Validation tooltip surface.' },
          { name: 'color', description: 'Helper or validation text color.' },
          { name: 'font-size', description: 'Helper text size.' },
        ],
      },
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
  color: var(--color-text);
  display: inline-flex;
}

.toolbar-icon svg {
  height: 1.25rem;
  width: 1.25rem;
}

.toolbar-icon:hover {
  color: var(--color-text-secondary);
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
  RelationshipInputs: {
    relationship: {
      code: `const [value, setValue] = useState<ValueWithRelation[]>([])

<RelationshipInput
  allowCreate={false}
  appearance="select"
  hasMany
  label="Related posts"
  onChange={setValue}
  path="relatedPosts"
  placeholder="Choose posts"
  relationTo={['posts']}
  value={value}
/>`,
      design: {
        code: `.field-type.relationship .rs__control {
  background: var(--color-bg);
  border-color: var(--color-border);
  border-radius: 6px;
}`,
        description:
          'Style the RelationshipInput select surface through its field wrapper while preserving document drawer behavior.',
        variables: [
          { name: '--color-bg', description: 'Relationship control surface.' },
          { name: 'border-color', description: 'Relationship control outline.' },
          { name: 'border-radius', description: 'Relationship control corner radius.' },
        ],
      },
    },
    upload: {
      code: `const [value, setValue] = useState<string | number>()

<UploadInput
  allowCreate
  label="Media"
  onChange={setValue}
  path="media"
  relationTo="media"
  required
  value={value}
/>`,
      design: {
        code: `.field-type.upload .dropzone {
  background: var(--color-bg-secondary);
  border-color: var(--color-border);
  border-radius: 6px;
}

.field-type.upload .btn--style-pill {
  border-color: var(--color-border);
}`,
        description:
          'Customize the UploadInput drop target and its Create New and Choose from existing controls without changing their drawer behavior.',
        variables: [
          { name: 'background', description: 'Upload selection surface.' },
          { name: 'border-color', description: 'Drop target or action outline.' },
          { name: 'border-radius', description: 'Upload selection corner radius.' },
        ],
      },
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
  background: var(--cell-background, var(--color-bg-secondary));
  border: 1px solid var(--cell-border, var(--color-border));
  border-radius: 999px;
  color: var(--cell-text, var(--color-text));
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
  color: var(--color-text);
  font-weight: 600;
}

.table .cell-publishedAt {
  color: var(--color-text-secondary);
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
  TextInputs: {
    text: {
      code: `const [value, setValue] = useState('Quarterly report')

<TextInput
  description="Displayed as the document title."
  label="Title"
  onChange={(event) => setValue(event.target.value)}
  path="title"
  required
  value={value}
/>`,
      design: {
        code: `.field-type.text input {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

.field-type.text input:focus {
  border-color: var(--color-border-brand-strong);
}`,
        description:
          'Target the TextInput field wrapper and native input to customize its surface, outline, and focus treatment.',
        variables: [
          { name: '--color-bg', description: 'Input surface inherited from the theme.' },
          { name: 'border', description: 'Input outline.' },
          { name: 'border-radius', description: 'Input corner radius.' },
        ],
      },
    },
    textarea: {
      code: `const [value, setValue] = useState(
  'A concise summary for the project dashboard.',
)

<TextareaInput
  description="Keep the summary brief and useful."
  label="Summary"
  onChange={(event) => setValue(event.target.value)}
  path="summary"
  rows={4}
  value={value}
/>`,
      design: {
        code: `.field-type.textarea textarea {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  resize: vertical;
}

.field-type.textarea textarea:focus {
  border-color: var(--color-border-brand-strong);
}`,
        description:
          'Style the native textarea inside Payload’s field wrapper while retaining its label, description, and validation layout.',
        variables: [
          { name: '--color-bg', description: 'Textarea surface inherited from the theme.' },
          { name: 'border', description: 'Textarea outline.' },
          { name: 'border-radius', description: 'Textarea corner radius.' },
          { name: 'resize', description: 'Allowed manual resize direction.' },
        ],
      },
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
