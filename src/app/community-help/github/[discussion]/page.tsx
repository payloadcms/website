import React from 'react'
import { notFound } from 'next/navigation'
import { RenderDiscussion } from './render'
import { fetchCommunityHelp, fetchCommunityHelps } from '@root/graphql'

const Discussion = async ({ params }) => {
  const { discussion: slug } = params
  const discussion = await await fetchCommunityHelp(slug)

  if (!discussion) return notFound()

  return <RenderDiscussion {...discussion} />
}

export default Discussion

export async function generateStaticParams() {
  const discussions = await fetchCommunityHelps()
  return discussions?.map(({ slug }) => slug) ?? []
}
