import * as React from 'react'

import classes from './index.module.scss'

export const Pagination: React.FC<{
  page: number
  setPage: (page: number) => void
  totalPages: number
}> = ({ page, setPage, totalPages }) => {
  return (
    <div className={classes.pagination}>
      <button
        disabled={page - 1 < 1}
        onClick={() => {
          if (page - 1 < 1) return

          setTimeout(() => {
            window.scrollTo(0, 0)
          }, 0)
          setPage(page > 1 ? page - 1 : 1)
        }}
        className={classes.button}
      >
        &#8249;
      </button>
      <span className={classes.page}>{`Page ${page} of ${totalPages}`}</span>
      <button
        disabled={page + 1 > totalPages}
        onClick={() => {
          if (page + 1 > totalPages) return

          setTimeout(() => {
            window.scrollTo(0, 0)
          }, 0)
          setPage(page + 1)
        }}
        className={classes.button}
      >
        &#8250;
      </button>
    </div>
  )
}
