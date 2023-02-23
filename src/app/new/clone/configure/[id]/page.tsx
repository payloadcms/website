import React from 'react'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

import Checkout from '@root/app/new/Checkout'

const ConfigureDraftFromTemplate: React.FC<{
  params: Params
}> = ({ params: { id: draftProjectID } }) => {
  return (
    <Checkout
      draftProjectID={draftProjectID}
      breadcrumb={{ label: 'Template', url: '/new/clone' }}
    />
  )
}

export default ConfigureDraftFromTemplate
