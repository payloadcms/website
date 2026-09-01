import type { ClientField, Column } from 'payload'

import { Table } from '@payloadcms/ui/elements/Table'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

const rows = [
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

export const tableExamples: ComponentExamples = {
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
    render: () => (
      <div className={classes.tableDemo}>
        <Table columns={columns} data={rows} />
      </div>
    ),
  },
}
