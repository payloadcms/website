import React from 'react'

import Meta from '@components/Meta'

export default async props => {
  const { 'team-slug': teamSlug, 'project-slug': projectSlug } = props.params

  return (
    <React.Fragment>
      <Meta
        title={`Ownership | Settings | ${teamSlug} | ${projectSlug}`}
        slug={`/cloud/${teamSlug}/${projectSlug}/settings/ownership`}
      />
    </React.Fragment>
  )
}
