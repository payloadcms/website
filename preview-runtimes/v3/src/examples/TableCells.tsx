'use client'

import type { ClientField, Column, DefaultCellComponentProps } from 'payload'

import { Pill } from '@payloadcms/ui/elements/Pill'
import { Table } from '@payloadcms/ui/elements/Table'
import { DefaultCell } from '@payloadcms/ui/elements/Table/DefaultCell'
import { ConfigProvider } from '@payloadcms/ui/providers/Config'
import { TranslationProvider } from '@payloadcms/ui/providers/Translation'
import { en } from 'payload/i18n/en'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

const defaultRows = [
  { id: '1', publishedAt: '2026-09-08T14:30:00.000Z', status: 'published', title: 'Launch notes' },
  { id: '2', publishedAt: '2026-09-10T13:15:00.000Z', status: 'draft', title: 'Release checklist' },
]

const variantRows = [
  { id: '1', title: 'Entry A', variant: 'alpha' },
  { id: '2', title: 'Entry B', variant: 'beta' },
  { id: '3', title: 'Entry C', variant: 'gamma' },
  { id: '4', title: 'Entry D', variant: 'delta' },
  { id: '5', title: 'Entry E', variant: 'epsilon' },
]

const variantLabels = {
  alpha: 'Alpha',
  beta: 'Beta',
  delta: 'Delta',
  epsilon: 'Epsilon',
  gamma: 'Gamma',
} as const

type Variant = keyof typeof variantLabels

const titleField = { name: 'title', type: 'text', label: 'Title' } as ClientField
const statusField = {
  name: 'status',
  type: 'select',
  label: 'Status',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ],
} as ClientField
const variantField = {
  name: 'variant',
  type: 'select',
  label: 'Variant',
  options: Object.entries(variantLabels).map(([value, label]) => ({ label, value })),
} as ClientField
const publishedAtField = {
  name: 'publishedAt',
  type: 'date',
  admin: { date: { displayFormat: 'MMM d, yyyy' } },
  label: 'Published',
} as ClientField

const previewConfig = {
  admin: { dateFormat: 'MMM d, yyyy' },
  collections: [{ slug: 'posts' }],
  globals: [],
  routes: { admin: '/admin' },
}

const PreviewProviders = ({ children }: { children: React.ReactNode }) => (
  <ConfigProvider config={previewConfig as never}>
    <TranslationProvider
      dateFNSKey="en-US"
      fallbackLang="en"
      language="en"
      languageOptions={[{ label: 'English', value: 'en' }]}
      switchLanguageServerAction={() => Promise.resolve()}
      translations={en.translations}
    >
      {children}
    </TranslationProvider>
  </ConfigProvider>
)

const defaultColumns: Column[] = [
  {
    accessor: 'title',
    active: true,
    field: titleField,
    Heading: 'Title',
    renderedCells: defaultRows.map((row) => (
      <DefaultCell
        cellData={row.title}
        collectionSlug="posts"
        field={titleField}
        key={row.id}
        link={false}
        rowData={row}
      />
    )),
  },
  {
    accessor: 'status',
    active: true,
    field: statusField,
    Heading: 'Status',
    renderedCells: defaultRows.map((row) => (
      <DefaultCell
        cellData={row.status}
        collectionSlug="posts"
        field={statusField}
        key={row.id}
        link={false}
        rowData={row}
      />
    )),
  },
  {
    accessor: 'publishedAt',
    active: true,
    field: publishedAtField,
    Heading: 'Published',
    renderedCells: defaultRows.map((row) => (
      <DefaultCell
        cellData={row.publishedAt}
        collectionSlug="posts"
        field={publishedAtField}
        key={row.id}
        link={false}
        rowData={row}
      />
    )),
  },
]

const isVariant = (value: unknown): value is Variant =>
  typeof value === 'string' && value in variantLabels

const CustomCell = ({ cellData }: Pick<DefaultCellComponentProps, 'cellData'>) => {
  const variant = isVariant(cellData) ? cellData : 'other'
  const label = isVariant(cellData) ? variantLabels[cellData] : String(cellData ?? 'Other')

  return (
    <Pill className={['custom-cell', `custom-cell--${variant}`, classes.customCell].join(' ')}>
      {label}
    </Pill>
  )
}

const customColumns: Column[] = [
  {
    accessor: 'title',
    active: true,
    field: titleField,
    Heading: 'Title',
    renderedCells: variantRows.map((row) => row.title),
  },
  {
    accessor: 'variant',
    active: true,
    field: variantField,
    Heading: 'Variant',
    renderedCells: variantRows.map((row) => <CustomCell cellData={row.variant} key={row.id} />),
  },
]

export const tableCellsExamples: ComponentExamples = {
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
    render: () => (
      <div className={classes.tableCellsDemo}>
        <Table columns={customColumns} data={variantRows} />
      </div>
    ),
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
    render: () => (
      <PreviewProviders>
        <div className={classes.tableCellsDemo}>
          <Table columns={defaultColumns} data={defaultRows} />
        </div>
      </PreviewProviders>
    ),
  },
}
