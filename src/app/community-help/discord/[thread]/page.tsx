import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { fetchCommunityHelp, fetchCommunityHelps } from '@root/graphql'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { DiscordThreadPage, Messages } from './client_page'

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
  const { thread: slug } = params

  const thread = await fetchCommunityHelp(slug)

  if (!thread) return notFound()

  if (!isThreadData(thread)) {
    throw new Error('Unexpected thread data')
  }

  return <DiscordThreadPage {...thread} />
}

export default Thread

export async function generateStaticParams() {
  const fetchedThreads = await fetchCommunityHelps()

  return fetchedThreads?.map(({ slug }) => slug) ?? []
}

export const metadata: Metadata = {
  title: 'Discord Thread',
}

export async function generateStaticPaths({ params: { thread } }): Promise<Metadata> {
  return {
    title: 'Discord Thread',
    openGraph: mergeOpenGraph({
      url: `/community-help/discord/${thread}`,
    }),
  }
}
