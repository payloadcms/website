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
  const [indexToShow, setIndexToShow] = React.useState([0, 1, 2, 3, 4])
  const showFirstPage = nbPages > 5 && currentRefinement >= 2
  const showLastPage = nbPages > 5 && currentRefinement <= nbPages - 3

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
    <div className={classes.pagination}>
      <div className={classes.pages}>
        {showFirstPage && (
          <>
            <button
              type="button"
              className={classes.paginationButton}
              onClick={() => {
                refine(0)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              1
            </button>
            <div className={classes.dash}>&mdash;</div>
          </>
        )}
        {hasPages &&
          pages.map((page, index) => {
            const isCurrent = currentRefinement === page
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
                      refine(page)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    {page + 1}
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
                refine(nbPages - 1)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              {nbPages}
            </button>
          </>
        )}
      </div>
      <button
        type="button"
        className={[classes.chevronButton, currentRefinement === 0 && classes.disabled]
          .filter(Boolean)
          .join(' ')}
        onClick={() => {
          refine(currentRefinement - 1)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        disabled={currentRefinement === 0}
      >
        <ChevronIconV2 rotation={180} />
      </button>
      <div className={classes.nextPrev}>
        <button
          type="button"
          className={[classes.chevronButton, currentRefinement >= nbPages - 1 && classes.disabled]
            .filter(Boolean)
            .join(' ')}
          onClick={() => {
            refine(currentRefinement + 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          disabled={currentRefinement >= nbPages - 1}
        >
          <ChevronIconV2 />
        </button>
      </div>
    </div>
  )
}
