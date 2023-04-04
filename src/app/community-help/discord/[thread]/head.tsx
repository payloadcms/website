import React from 'react'

import Meta from '@components/Meta'

export default async props => {
  const { thread: threadSlug } = props.params

  return (
    <React.Fragment>
      <Meta
        title={`${threadSlug} | Community Help | Payload CMS`}
        slug={`/community-help/discord/${threadSlug}`}
      />
    </React.Fragment>
  )
}
