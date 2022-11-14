import React from 'react'
import Meta from '@components/Meta'
import { fetchPage } from '@graphql'

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
