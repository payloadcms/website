import React from 'react'
import { fetchPage } from '@graphql'

import Meta from '@components/Meta'

export default async () => {
  const page = await fetchPage(['home'])

  if (page) {
    const { meta } = page
    return (
      <React.Fragment>
        <Meta title={meta?.title} description={meta?.description} image={meta?.image} slug="" />
      </React.Fragment>
    )
  }
  return null
}
