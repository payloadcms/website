import React from 'react'

import { PageContent } from '../(pages)/[...slug]/PageContent'

const Cloud = async () => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/pages?where[slug][equals]=cloud&limit=1`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  const res = await req.json()
  const page = res.docs?.[0]

  return <PageContent page={page} slug="cloud" />
}

export default Cloud
