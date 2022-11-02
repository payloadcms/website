import React from 'react'
import { Hero } from '../../components/Hero'
import { RenderBlocks } from '../../components/RenderBlocks'
import { fetchPage } from '../../graphql'

const Page = async ({ params }) => {
  const page = await fetchPage(params.slug || 'home')

  return (
    <React.Fragment>
      <Hero page={page} />
      <RenderBlocks blocks={page.layout} />
    </React.Fragment>
  )
}

export default Page
