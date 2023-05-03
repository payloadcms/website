import React from 'react'

import Code from '@components/Code'

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
        <Code className={classes.code}>{`${JSON.stringify(paginatedRes, null, 4)}`}</Code>
      </>
    )
  }

  return (
    <>
      <h5>Response</h5>
      <Code className={classes.code}>{JSON.stringify(res, null, 4)}</Code>
    </>
  )
}
