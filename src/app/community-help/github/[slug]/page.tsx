import React from 'react'
import { notFound } from 'next/navigation'
import { getDiscussion, getAllDiscussions } from '../../api'

const Discussion = async ({ params }) => {
  const { slug } = params
  const discussion = await getDiscussion(slug)

  if (!discussion) return notFound()

  return <div>{discussion.title}</div>
}

export default Discussion

export async function generateStaticParams() {
  const discussions = await getAllDiscussions()
  return discussions.map(({ slug }) => ({
    slug,
  }))
}
