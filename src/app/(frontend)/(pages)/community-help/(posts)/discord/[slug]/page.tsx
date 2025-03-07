import type { Metadata } from 'next'

import { fetchCommunityHelp, fetchCommunityHelps } from '@data/index'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { slugToText } from '@root/utilities/slug-to-text'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'

import type { Messages } from './client_page'

import { DiscordThreadPage } from './client_page'

const isThreadData = (
  data: any,
): data is {
  communityHelpJSON: {
    info: {
      createdAt: number | string
      guildId: string
      id: string
      name: string
    }
    intro: Messages
    messageCount: number
    messages: Messages[]
    slug: string
  }
  communityHelpType?: 'discord' | 'github'
  discordID?: string
  githubID?: string
  id: string
  slug?: string
  title?: string
} => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    'slug' in data &&
    'discordID' in data &&
    'communityHelpType' in data &&
    'communityHelpJSON' in data
  )
}

const getDiscordThread = (slug: string, draft: boolean) =>
  draft
    ? fetchCommunityHelp(slug)
    : unstable_cache(fetchCommunityHelp, [`community-help-${slug}`])(slug)

const Thread = async ({ params }) => {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params

  const thread = await getDiscordThread(slug, draft)

  // Algolia is return all threads as helpful, regardless of the value of the helpful field
  // So they are showing up in the archive at /community-help

  // This is a temporary fix to still show the page even if the thread is not marked as helpful

  // if (!thread || !thread.helpful) return notFound()
  if (!thread) {
    return notFound()
  }

  if (!isThreadData(thread)) {
    throw new Error('Unexpected thread data')
  }

  return <DiscordThreadPage {...thread} />
}

export default Thread

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_SKIP_BUILD_HELPS) {
    return []
  }

  try {
    const getDiscordThreads = unstable_cache(fetchCommunityHelps, ['discord-threads'])
    const fetchedThreads = await getDiscordThreads('discord')
    return fetchedThreads?.map(({ slug }) => ({ slug: slug || '404' })) ?? []
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: any
  }>
}): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  const thread = await getDiscordThread(slug, draft)
  return {
    openGraph: mergeOpenGraph({
      description: thread?.introDescription ?? undefined,
      title: slugToText(slug),
      url: `/community-help/discord/${slug}`,
    }),
    title: slugToText(slug),
  }
}
