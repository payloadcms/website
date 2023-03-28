import React from 'react'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

import Checkout from '@root/app/new/(checkout)/Checkout'

const ConfigureDraftFromTemplate: React.FC<{
  params: Params
}> = ({ params: { id: draftProjectID } }) => {
  return (
    <Checkout
      draftProjectID={draftProjectID}
      breadcrumb={{ label: 'Template', url: '/new/import' }}
    />
  )
}

export default ConfigureDraftFromTemplate
