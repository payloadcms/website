import * as React from 'react'

import { ChevronIcon } from '@root/icons/ChevronIcon/index.js'

import classes from './index.module.scss'

export const Pagination: React.FC<{
  page: number
  setPage: (page: number) => void
  totalPages: number
  className?: string
}> = ({ page, setPage, totalPages, className }) => {
  const [indexToShow, setIndexToShow] = React.useState([0, 1, 2, 3, 4])
  const showFirstPage = totalPages > 5 && page >= 2
  const showLastPage = totalPages > 5 && page <= totalPages - 3

  React.useEffect(() => {
    if (showFirstPage && showLastPage) {
      setIndexToShow([1, 2, 3])
    }

    if (showFirstPage && !showLastPage) {
      setIndexToShow([2, 3, 4])
    }

    if (!showFirstPage && showLastPage) {
      setIndexToShow([0, 1, 2])
    }

    if (!showFirstPage && !showLastPage) {
      setIndexToShow([0, 1, 2, 3, 4])
    }
  }, [showFirstPage, showLastPage])

  return (
    <div className={[classes.pagination, className].filter(Boolean).join(' ')}>
      {showFirstPage && (
        <>
          <button
            type="button"
            className={classes.paginationButton}
            onClick={() => {
              window.scrollTo(0, 0)
              setPage(1)
            }}
          >
            1
          </button>
          <div className={classes.dash}>&mdash;</div>
        </>
      )}
      {[...Array(totalPages)].map((_, index) => {
        const currentPage = index + 1
        const isCurrent = page === currentPage

        if (indexToShow.includes(index))
          return (
            <div key={index}>
              <button
                type="button"
                className={[
                  classes.paginationButton,
                  isCurrent && classes.paginationButtonActive,
                  isCurrent && classes.disabled,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  window.scrollTo(0, 0)
                  setPage(currentPage)
                }}
              >
                {currentPage}
              </button>
            </div>
          )
      })}
      {showLastPage && (
        <>
          <div className={classes.dash}>&mdash;</div>
          <button
            type="button"
            className={classes.paginationButton}
            onClick={() => {
              setTimeout(() => {
                window.scrollTo(0, 0)
              }, 0)
              setPage(totalPages)
            }}
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        disabled={page - 1 < 1}
        onClick={() => {
          if (page - 1 < 1) return
          window.scrollTo(0, 0)
          setPage(page > 1 ? page - 1 : 1)
        }}
        className={[classes.button, page - 1 < 1 && classes.disabled].filter(Boolean).join(' ')}
      >
        <ChevronIcon rotation={180} />
      </button>
      <button
        disabled={page + 1 > totalPages}
        onClick={() => {
          if (page + 1 > totalPages) return

          window.scrollTo(0, 0)
          setPage(page + 1)
        }}
        className={[classes.button, page + 1 > totalPages && classes.disabled]
          .filter(Boolean)
          .join(' ')}
      >
        <ChevronIcon />
      </button>
    </div>
  )
}
