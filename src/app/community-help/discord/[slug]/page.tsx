import React from 'react'
import { notFound } from 'next/navigation'

import { fetchCommunityHelp, fetchCommunityHelps } from '@root/graphql'
import { Messages, RenderThread } from './render'

const isThreadData = (
  data: any,
): data is {
  id: string
  title?: string
  slug?: string
  discordID?: string
  githubID?: string
  communityHelpType?: 'discord' | 'github'
  communityHelpJSON: {
    info: {
      name: string
      id: string
      guildId: string
      createdAt: string | number
    }
    intro: Messages
    messageCount: number
    messages: Messages[]
    slug: string
  }
} => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    'slug' in data &&
    'discordID' in data &&
    'githubID' in data &&
    'communityHelpType' in data &&
    'communityHelpJSON' in data
  )
}

const Thread = async ({ params }) => {
  const { slug } = params

  const thread = await fetchCommunityHelp(slug)

  if (!thread) return notFound()

  if (!isThreadData(thread)) {
    throw new Error('Unexpected thread data')
  }

  return <RenderThread {...thread} />
}

export default Thread

export async function generateStaticParams() {
  const fetchedThreads = await fetchCommunityHelps('discord')
  return fetchedThreads?.map(({ slug }) => ({ slug })) ?? []
}
