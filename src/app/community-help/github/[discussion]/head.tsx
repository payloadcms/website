import React from 'react'

import Meta from '@components/Meta'

export default async props => {
  const { discussion: discussionSlug } = props.params

  return (
    <React.Fragment>
      <Meta
        title={`${discussionSlug} | Community Help | Payload CMS`}
        slug={`/community-help/github/${discussionSlug}`}
      />
    </React.Fragment>
  )
}
