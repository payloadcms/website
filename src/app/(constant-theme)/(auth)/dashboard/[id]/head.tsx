import React from 'react'
import { fetchPage } from '@graphql'

import Meta from '@components/Meta'

export default async props => {
  const { slug } = props.params
  const page = await fetchPage(slug)

  if (page) {
    const { meta } = page
    return (
      <React.Fragment>
        <Meta
          title={meta?.title}
          description={meta?.description}
          image={meta?.image}
          slug={`${slug ? slug?.join('/') : ''}`}
        />
      </React.Fragment>
    )
  }
  return null
}
