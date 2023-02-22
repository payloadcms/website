import React from 'react'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

import ConfigureDraftProject from '@root/app/new/Configure'

const ConfigureDraftFromTemplate: React.FC<{
  params: Params
}> = ({ params: { id: draftProjectID } }) => {
  return (
    <ConfigureDraftProject
      draftProjectID={draftProjectID}
      breadcrumb={{ label: 'Template', url: '/new/clone' }}
    />
  )
}

export default ConfigureDraftFromTemplate
