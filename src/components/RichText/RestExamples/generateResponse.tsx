import Code from '@components/Code/index'
import React from 'react'

import classes from './index.module.scss'

export const GenerateResponse = ({ res }) => {
  if (!res) {
    return null
  }

  if (res.paginated) {
    const paginatedRes = {
      docs: [res.data],
      hasNextPage: false,
      hasPrevPage: false,
      limit: 10,
      nextPage: null,
      page: 1,
      pagingCounter: 1,
      prevPage: null,
      totalDocs: res.data.length || 1,
      totalPages: 1,
    }

    return (
      <>
        <h5>Response</h5>
        <Code className={classes.code} disableMinHeight>{`${JSON.stringify(
          paginatedRes,
          null,
          2,
        )}`}</Code>
      </>
    )
  }

  return (
    <>
      <h5>Response</h5>
      <Code className={classes.code} disableMinHeight>
        {JSON.stringify(res, null, 2)}
      </Code>
    </>
  )
}
