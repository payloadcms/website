import React from 'react'

import Meta from '@components/Meta'

export default async props => {
  const { 'team-slug': teamSlug, 'project-slug': projectSlug } = props.params

  return (
    <React.Fragment>
      <Meta
        title={`Logs | ${teamSlug} | ${projectSlug}`}
        slug={`/cloud/${teamSlug}/${projectSlug}/logs`}
      />
    </React.Fragment>
  )
}
