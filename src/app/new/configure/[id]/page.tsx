import React from 'react'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

import Checkout from '@root/app/new/(checkout)'

const ConfigureDraftFromImport: React.FC<{
  params: Params
}> = ({ params: { id: draftProjectID } }) => {
  return <Checkout draftProjectID={draftProjectID} />
}

export default ConfigureDraftFromImport
