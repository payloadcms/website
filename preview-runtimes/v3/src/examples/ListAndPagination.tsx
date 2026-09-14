'use client'

import { Pagination } from '@payloadcms/ui/elements/Pagination'
import { useState } from 'react'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'

const PaginationDemo = () => {
  const [page, setPage] = useState(4)
  const totalPages = 12

  return (
    <div className={classes.paginationDemo}>
      <Pagination
        hasNextPage={page < totalPages}
        hasPrevPage={page > 1}
        nextPage={page + 1}
        onChange={setPage}
        page={page}
        prevPage={page - 1}
        totalPages={totalPages}
      />
      <span aria-live="polite">
        Page {page} of {totalPages}
      </span>
    </div>
  )
}

export const listAndPaginationExamples: ComponentRenders = {
  pagination: {
    render: () => <PaginationDemo />,
  },
}
