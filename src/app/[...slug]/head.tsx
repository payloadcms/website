import React from 'react'
import Meta from '@components/Meta'
import { fetchPage } from '@graphql'

export default async props => {
  const { slug } = props.params
  const { meta } = await fetchPage(slug)

  return (
    <Meta
      title={meta?.title}
      description={meta?.description}
      image={meta?.image}
      slug={`/${slug ? slug.join('/') : ''}`}
    />
  )
}
