import React from 'react'
import { usePagination } from 'react-instantsearch-hooks-web'
import classes from './index.module.scss'

export const AlgoliaPagination: React.FC<{
  className?: string
}> = () => {
  const {
    pages,
    currentRefinement,
    // nbHits,
    // nbPages,
    // isFirstPage,
    // isLastPage,
    // canRefine,
    refine,
    // createURL
  } = usePagination()

  const hasPages = pages && Array.isArray(pages) && pages.length > 0

  return (
    <div className={classes.pagination}>
      {hasPages &&
        pages.map((page, index) => {
          const isCurrent = currentRefinement === page

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
                  refine(page)
                }}
              >
                {page + 1}
              </button>
            </div>
          )
        })}
    </div>
  )
}
