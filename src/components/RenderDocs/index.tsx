import { BackgroundGrid } from '@components/BackgroundGrid'
import { BackgroundScanline } from '@components/BackgroundScanline/index.js'
import { DiscordGitCTA } from '@components/DiscordGitCTA/index.js'
import { DocsNavigation } from '@components/DocsNavigation'
import { Gutter } from '@components/Gutter'
import { JumplistProvider } from '@components/Jumplist'
import components from '@components/MDX/components/index.js'
import { RelatedHelpList } from '@components/RelatedHelpList/index.js'
import { TableOfContents } from '@components/TableOfContents/index.js'
import { VersionSelector } from '@components/VersionSelector/index.js'
import { fetchRelatedThreads } from '@data'
import { ArrowIcon } from '@icons/ArrowIcon/index.js'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import React from 'react'
import { Suspense } from 'react'
import remarkGfm from 'remark-gfm'

import classes from './index.module.scss'
import { TopicGroup } from '@root/app/(frontend)/(pages)/docs/api'
import { Feedback } from '@components/Feedback'

export const RenderDocs = async ({
  children,
  params,
  topics: topicGroups,
  version,
}: {
  children?: React.ReactNode
  params: { doc: string; topic: string }
  topics: TopicGroup[]
  version?: 'beta' | 'current' | 'v2'
}) => {
  const groupIndex = topicGroups.findIndex(({ topics: tGroup }) =>
    tGroup.some(topic => topic?.slug?.toLowerCase() === params.topic),
  )

  const topicIndex = topicGroups[groupIndex].topics.findIndex(
    topic => topic?.slug?.toLowerCase() === params.topic,
  )

  const topicGroup = topicGroups?.[groupIndex]

  const topic = topicGroup?.topics?.[topicIndex]

  const docIndex = topic?.docs.findIndex(doc => doc.slug.replace('.mdx', '') === params.doc)

  const currentDoc = topic?.docs?.[docIndex]

  const path = `${topic.slug.toLowerCase()}/${currentDoc.slug}`

  if (!currentDoc) {
    return notFound()
  }

  const hideVersionSelector =
    process.env.NEXT_PUBLIC_ENABLE_BETA_DOCS !== 'true' &&
    process.env.NEXT_PUBLIC_ENABLE_LEGACY_DOCS !== 'true'

  const getRelatedThreads = path => unstable_cache(fetchRelatedThreads, ['relatedThreads'])(path)
  const relatedThreads = await getRelatedThreads(path)

  const hasRelatedThreads =
    relatedThreads && Array.isArray(relatedThreads) && relatedThreads.length > 0

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
            currentTopic={params.topic}
            params={params}
            topics={topicGroups}
            version={version}
            groupIndex={groupIndex}
            indexInGroup={topicIndex}
            docIndex={docIndex}
          />
          <div aria-hidden className={classes.navOverlay} />
          <main className={['cols-8 start-5 cols-m-8 start-m-1', classes.content].join(' ')}>
            <Suspense fallback={<DocsSkeleton />}>
              {children}
              <h1 className={classes.title}>{currentDoc.title}</h1>
              <div className={classes.mdx}>
                <MDXRemote
                  components={components}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                    },
                  }}
                  source={currentDoc.content}
                />
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

                <BackgroundScanline crosshairs="all" />
              </Link>
            )}
            {hasRelatedThreads && <RelatedHelpList relatedThreads={relatedThreads} />}
          </main>
          <aside className={['cols-3 start-14', classes.aside].join(' ')}>
            <div className={classes.asideStickyContent}>
              {!hideVersionSelector && <VersionSelector initialVersion={version ?? 'current'} />}
              <TableOfContents headings={currentDoc.headings} />
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
