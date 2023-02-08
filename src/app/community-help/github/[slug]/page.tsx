import React from 'react'
import { notFound } from 'next/navigation'
import { Gutter } from '@components/Gutter'
import { getDiscussion, getAllDiscussions } from '../../api'

const Discussion = async ({ params }) => {
  const { slug } = params
  const discussion = await getDiscussion(slug)

  if (!discussion) return notFound()

  return (
    <Gutter>
      <a href={`${process.env.NEXT_PUBLIC_SITE_URL}/community-help/github`}>Back</a>
      <h3>{discussion.title}</h3>
      <div dangerouslySetInnerHTML={{ __html: discussion.body }} />
      <h5>
        <a href={discussion.url}>View on GitHub</a>
      </h5>
    </Gutter>
  )
}

export default Discussion

export async function generateStaticParams() {
  const discussions = await getAllDiscussions()
  return discussions.map(({ slug }) => ({
    slug,
  }))
}
