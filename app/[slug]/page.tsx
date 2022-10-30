import React from 'react'
import { Hero } from '../../components/Hero'
import { RenderBlocks } from '../../components/RenderBlocks'
import { fetchPage } from '../../graphql'
import { Globals } from '../components/Globals'
import { Providers } from '../components/Providers'

const PageTemplate = async ({ params }) => {
  const { slug } = params
  const page = await fetchPage(slug)

  return (
    <Providers id={page.id} collection="pages" preview={false}>
      <Globals />
      <Hero {...page.hero} />
      <RenderBlocks blocks={page.layout} />
    </Providers>
  )
}

export default PageTemplate
