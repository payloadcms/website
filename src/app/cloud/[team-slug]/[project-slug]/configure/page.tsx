import React from 'react'
import { cloudSlug } from '@cloud/client_layout'
import { Metadata } from 'next'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

import Checkout from '@root/app/new/(checkout)/Checkout'

const ConfigureDraftFromImport: React.FC<{
  params: Params
}> = ({ params: { 'team-slug': team, 'project-slug': slug } }) => {
  return <Checkout teamSlug={team} projectSlug={slug} />
}

export default ConfigureDraftFromImport

export async function generateMetadata({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}: {
  params: Params
}): Promise<Metadata> {
  return {
    title: 'Checkout | Payload Cloud',
    openGraph: {
      url: `/cloud/${teamSlug}/${projectSlug}/configure`,
    },
  }
}
