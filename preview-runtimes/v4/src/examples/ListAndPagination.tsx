'use client'

import { Pagination } from '@payloadcms/ui/elements/Pagination'
import { useState } from 'react'

import type { PreviewExamples } from './types.js'

const PaginationDemo = () => {
  const [page, setPage] = useState(4)
  const totalPages = 12

  return (
    <div className="payload-v4-preview__pagination-demo">
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
        Showing page {page} of {totalPages}
      </span>
    </div>
  )
}

export const listAndPaginationExamples: PreviewExamples = {
  pagination: <PaginationDemo />,
}
