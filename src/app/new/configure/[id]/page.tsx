import React from 'react'
import { Metadata } from 'next'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

import Checkout from '@root/app/new/(checkout)/Checkout'

const ConfigureDraftFromImport: React.FC<{
  params: Params
}> = ({ params: { id: draftProjectID } }) => {
  return <Checkout draftProjectID={draftProjectID} />
}

export default ConfigureDraftFromImport

export async function generateMetadata({ params: { id } }: { params: Params }): Promise<Metadata> {
  return {
    title: 'Checkout | Payload Cloud',
    openGraph: {
      url: `/new/configure/${id}`,
    },
  }
}
