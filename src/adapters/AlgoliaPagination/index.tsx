import React from 'react'
import { usePagination } from 'react-instantsearch-hooks-web'
import { ChevronIconV2 } from '@root/graphics/ChevronIconV2'

import classes from './index.module.scss'

export const AlgoliaPagination: React.FC<{
  className?: string
}> = () => {
  const {
    pages,
    currentRefinement,
    // nbHits,
    nbPages,
    // isLastPage,
    // canRefine,
    refine,
    // createURL
  } = usePagination({ padding: 2 })

  const hasPages = pages && Array.isArray(pages) && pages.length > 0

  return (
    <div className={classes.pagination}>
      <div className={classes.pages}>
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
      <div className={classes.nextPrev}>
        <button
          type="button"
          className={classes.chevronButton}
          onClick={() => {
            refine(currentRefinement - 1)
          }}
          disabled={currentRefinement === 0}
        >
          <ChevronIconV2 rotation={180} />
        </button>
        <button
          type="button"
          className={classes.chevronButton}
          onClick={() => {
            refine(currentRefinement + 1)
          }}
          disabled={currentRefinement >= (nbPages - 1)}
        >
          <ChevronIconV2 />
        </button>
      </div>
    </div>
  )
}
