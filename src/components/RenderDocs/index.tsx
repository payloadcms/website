import type { Heading, TopicGroupForNav } from '@root/collections/Docs/types'
import type { Doc } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { DiscordGitCTA } from '@components/DiscordGitCTA/index'
import { DocsNavigation } from '@components/DocsNavigation'
import { Feedback } from '@components/Feedback'
import { Gutter } from '@components/Gutter'
import { JumplistProvider } from '@components/Jumplist'
import { PayloadRedirects } from '@components/PayloadRedirects'
import { RelatedHelpList } from '@components/RelatedHelpList/index'
import { RelatedResources } from '@components/RelatedResources'
import { RichTextWithTOC } from '@components/RichText'
import { TableOfContents } from '@components/TableOfContents/index'
import { VersionSelector } from '@components/VersionSelector/index'
import { fetchRelatedThreads } from '@data'
import { ArrowIcon } from '@icons/ArrowIcon/index'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import React, { Suspense } from 'react'

import classes from './index.module.scss'

export type DocsVersion = 'beta' | 'current' | 'dynamic' | 'local' | 'v2'

export const RenderDocs = async ({
  children,
  currentDoc,
  docSlug,
  topicGroups,
  topicSlug,
  version,
}: {
  children?: React.ReactNode
  currentDoc: Doc
  docSlug: string
  topicGroups: TopicGroupForNav[]
  topicSlug: string
  version?: DocsVersion
}) => {
  const groupIndex = topicGroups.findIndex(({ topics: tGroup }) =>
    tGroup.some((topic) => topic?.slug?.toLowerCase() === topicSlug.toLowerCase()),
  )

  const topicIndex = topicGroups[groupIndex]?.topics.findIndex(
    (topic) => topic?.slug?.toLowerCase() === topicSlug.toLowerCase(),
  )

  if (!currentDoc) {
    return (
      <PayloadRedirects
        url={`/docs${version && version !== 'current' ? '/' + version : ''}/${topicSlug}/${
          docSlug
        }`}
      />
    )
  }

  const topicGroup = topicGroups?.find(
    ({ groupLabel, topics }) =>
      topics.some((topic) => topic.slug.toLowerCase() === topicSlug) &&
      groupLabel === currentDoc.topicGroup,
  )

  if (!topicGroup) {
    throw new Error('Topic group not found')
  }

  const topic = topicGroup.topics.find((topic) => topic.slug.toLowerCase() === topicSlug)

  if (!topic) {
    throw new Error('Topic not found')
  }

  const docIndex = topic?.docs.findIndex((doc) => doc.slug === currentDoc.slug)

  const path = `${topicSlug.toLowerCase()}/${currentDoc.slug}`

  const hideVersionSelector =
    process.env.NEXT_PUBLIC_ENABLE_BETA_DOCS !== 'true' &&
    process.env.NEXT_PUBLIC_ENABLE_LEGACY_DOCS !== 'true'

  const getRelatedThreads = (path) => unstable_cache(fetchRelatedThreads, ['relatedThreads'])(path)
  const relatedThreads = await getRelatedThreads(path)

  const hasRelatedThreads =
    relatedThreads && Array.isArray(relatedThreads) && relatedThreads.length > 0

  const hasGuides =
    currentDoc.guides && currentDoc.guides.docs && currentDoc.guides.docs?.length > 0

  const guides = currentDoc?.guides?.docs ?? []

  const isLastGroup = topicGroups.length === groupIndex + 1
  const isLastTopic = topicGroup.topics.length === topicIndex + 1
  const isLastDoc = docIndex === topic.docs.length - 1

  const hasNext = !(isLastGroup && isLastTopic && isLastDoc)

  const nextGroupIndex = !isLastGroup && isLastTopic && isLastDoc ? groupIndex + 1 : groupIndex

  let nextTopicIndex

  if (!isLastDoc) {
    nextTopicIndex = topicIndex
  } else if (isLastDoc && !isLastTopic) {
    nextTopicIndex = topicIndex + 1
  } else {
    nextTopicIndex = 0
  }

  const nextDocIndex = !isLastDoc ? docIndex + 1 : 0

  const nextDoc = hasNext
    ? topicGroups[nextGroupIndex]?.topics?.[nextTopicIndex]?.docs[nextDocIndex]
    : null

  const next = hasNext
    ? {
        slug: nextDoc?.slug,
        title: nextDoc?.title,
        topic: topicGroups?.[nextGroupIndex]?.topics?.[nextTopicIndex]?.slug,
      }
    : null

  return (
    <Gutter className={classes.wrap}>
      <JumplistProvider>
        <div className="grid">
          <DocsNavigation
            currentDoc={docSlug}
            currentTopic={topicSlug}
            docIndex={docIndex}
            groupIndex={groupIndex}
            indexInGroup={topicIndex}
            topics={topicGroups}
            version={version}
          />
          <div aria-hidden className={classes.navOverlay} />
          <main className={['cols-8 start-5 cols-m-8 start-m-1', classes.content].join(' ')}>
            <Suspense fallback={<DocsSkeleton />}>
              {children}
              <h1 className={classes.title}>{currentDoc.title}</h1>
              <div className={classes.mdx}>
                <RichTextWithTOC content={currentDoc.content} />
              </div>
            </Suspense>
            {next && (
              <Link
                className={[classes.next, hasRelatedThreads && classes.hasRelatedThreads]
                  .filter(Boolean)
                  .join(' ')}
                data-algolia-no-crawl
                href={`/docs/${version ? `${version}/` : ''}${next?.topic?.toLowerCase()}/${
                  next.slug
                }`}
                prefetch={false}
              >
                <div className={classes.nextLabel}>
                  Next <ArrowIcon />
                </div>
                <h3>{next.title}</h3>

                <BackgroundScanline className={classes.nextScanlines} />
              </Link>
            )}
            {(hasGuides || hasRelatedThreads) && (
              <RelatedResources guides={guides} relatedThreads={relatedThreads} />
            )}
          </main>
          <aside className={['cols-3 start-14', classes.aside].join(' ')}>
            <div className={classes.asideStickyContent}>
              {!hideVersionSelector && <VersionSelector initialVersion={version ?? 'current'} />}
              <TableOfContents headings={currentDoc.headings as Heading[]} />
              <div className={classes.discordGitWrap}>
                <DiscordGitCTA appearance="minimal" />
              </div>
              <Feedback path={path} />
            </div>
          </aside>
        </div>
        <BackgroundGrid wideGrid />
      </JumplistProvider>
    </Gutter>
  )
}

const DocsSkeleton = () => (
  <div className={classes.skeleton}>
    <div className={classes.skeletonTitle} />
    <div className={classes.skeletonContent} />
  </div>
)
