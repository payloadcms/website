import React from 'react'
import { notFound } from 'next/navigation'
import { getDiscussion, getAllDiscussions } from '../../api'
import { RenderDiscussion } from './render'

const Discussion = async ({ params }) => {
  const { discussion: slug } = params
  const discussion = await getDiscussion(slug)

  if (!discussion) return notFound()

  return <RenderDiscussion {...discussion} />
}

export default Discussion

export async function generateStaticParams() {
  const discussions = await getAllDiscussions()
  return (
    discussions?.map(({ slug }) => ({
      discussion: slug,
    })) ?? []
  )
}
