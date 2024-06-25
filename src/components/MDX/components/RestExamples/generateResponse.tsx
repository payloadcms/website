import React from 'react'

import Code from '@components/Code/index.js'

import classes from './index.module.scss'

export const GenerateResponse = ({ res }) => {
  if (!res) return null

  if (res.paginated) {
    const paginatedRes = {
      docs: [res.data],
      totalDocs: res.data.length || 1,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
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
