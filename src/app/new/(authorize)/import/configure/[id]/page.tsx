import React from 'react'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

import ConfigureDraftProject from '@root/app/new/(authorize)/Configure'

const ConfigureDraftFromImport: React.FC<{
  params: Params
}> = ({ params: { id: draftProjectID } }) => {
  return (
    <ConfigureDraftProject
      draftProjectID={draftProjectID}
      breadcrumb={{ label: 'Import', url: '/new/import' }}
    />
  )
}

export default ConfigureDraftFromImport
