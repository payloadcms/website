import React from 'react'
import { Hero } from '../../components/Hero'
import { RenderBlocks } from '../../components/RenderBlocks'
import { fetchPage } from '../../graphql'
import { App } from '../App'

const Page = async ({ params }) => {
  let { slug } = params
  if (typeof slug === 'undefined') slug = 'home'
  const page = await fetchPage(slug)

  return (
    <App id={page.id} collection="pages" preview={false}>
      <Hero {...page.hero} />
      <RenderBlocks blocks={page.layout} />
    </App>
  )
}

export default Page
