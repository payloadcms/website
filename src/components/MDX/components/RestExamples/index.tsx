import React from 'react'

import { Drawer, DrawerToggler } from '@components/Drawer'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import Table from '../Table'
import { GenerateRequest } from './generateRequest'
import { GenerateResponse } from './generateResponse'
import { Data, Example, Props } from './types'

import classes from './index.module.scss'

const ExampleCell: React.FC<{ example: Example; row: Data }> = ({ example, row }) => {
  const { req, res, drawerContent } = example
  const drawerRow = [{ ...row, example: false, operation: false }] as any
  const slug = row?.example?.slug

  return (
    <>
      <DrawerToggler slug={slug} className={classes.toggle}>
        <span className={classes.label}>Example</span>
        <ArrowIcon className={classes.arrow} />
      </DrawerToggler>
      <Drawer slug={slug} title={row.operation} size="s">
        <Table data={drawerRow} columns={columns.slice(1)} />
        <GenerateRequest req={req} row={row} />
        <GenerateResponse res={res} />
        {drawerContent && <div className={classes.drawerContent}>{drawerContent}</div>}
      </Drawer>
    </>
  )
}

const columns = [
  {
    accessor: 'operation',
    components: {
      Heading: 'Operation',
      renderCell: (_, data) => <strong>{data}</strong>,
    },
  },
  {
    accessor: 'method',
    components: {
      Heading: 'Method',
      renderCell: (_, data) => <label>{data}</label>,
    },
  },
  {
    accessor: 'path',
    components: {
      Heading: 'Path',
      renderCell: (_, data) => <span>{data}</span>,
    },
  },
  {
    accessor: 'example',
    components: {
      Heading: '',
      renderCell: (row, data) => {
        if (!data || !row) return null
        return <ExampleCell row={row} example={data} />
      },
    },
  },
]

export const RestExamples: React.FC<Props> = ({ data }) => {
  return <Table data={data} columns={columns} />
}
