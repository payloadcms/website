import React from 'react'

import Meta from '@components/Meta'

export default async props => {
  const { 'team-slug': teamSlug } = props.params

  return (
    <React.Fragment>
      <Meta title={`Settings | ${teamSlug} | Payload Cloud`} slug={`/cloud/${teamSlug}`} />
    </React.Fragment>
  )
}
