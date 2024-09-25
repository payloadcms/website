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
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import React from 'react'
import { Suspense } from 'react'
import remarkGfm from 'remark-gfm'

import classes from './index.module.scss'

export const RenderDocs = async ({
  children,
  params,
  topics,
  version,
}: {
  children?: React.ReactNode
  params: { doc: string; topic: string }
  topics: any[]
  version?: 'beta' | 'current' | 'v2'
}) => {
  const topicIndex = topics.findIndex(topic => topic.slug.toLowerCase() === params.topic)
  const docIndex = topics[topicIndex].docs.findIndex(
    doc => doc.slug.replace('.mdx', '') === params.doc,
  )

  const currentDoc = topics[topicIndex].docs[docIndex]

  if (!currentDoc) {
    return notFound()
  }

  const hideVersionSelector =
    process.env.NEXT_PUBLIC_ENABLE_BETA_DOCS !== 'true' &&
    process.env.NEXT_PUBLIC_ENABLE_LEGACY_DOCS !== 'true'

  const relatedThreads = await fetchRelatedThreads()

  const filteredRelatedThreads = relatedThreads.filter(
    thread =>
      Array.isArray(thread.relatedDocs) &&
      thread.relatedDocs.some(
        relatedDoc => typeof relatedDoc !== 'string' && relatedDoc.title === currentDoc?.title,
      ),
  )

  const hasRelatedThreads =
    filteredRelatedThreads &&
    Array.isArray(filteredRelatedThreads) &&
    filteredRelatedThreads.length > 0

  const hasNext = topics.length > topicIndex + 1

  const next = !hasNext
    ? null
    : topics[topicIndex].docs.length <= docIndex + 1
    ? {
        slug: topics[topicIndex + 1].docs[0].slug,
        title: topics[topicIndex + 1].docs[0].title,
        topic: topics[topicIndex + 1].slug,
      }
    : {
        slug: topics[topicIndex].docs[docIndex + 1].slug,
        title: topics[topicIndex].docs[docIndex + 1].title,
        topic: params.topic,
      }

  return (
    <Gutter className={classes.wrap}>
      <JumplistProvider>
        <div className="grid">
          <DocsNavigation
            currentTopic={params.topic}
            params={params}
            topics={topics}
            version={version}
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
                href={`/docs/${version ? `${version}/` : ''}${next.topic.toLowerCase()}/${
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
            {hasRelatedThreads && <RelatedHelpList relatedThreads={filteredRelatedThreads} />}
          </main>
          <aside className={['cols-3 start-14', classes.aside].join(' ')}>
            <div className={classes.asideStickyContent}>
              {!hideVersionSelector && <VersionSelector initialVersion={version ?? 'current'} />}
              <TableOfContents headings={currentDoc.headings} />
              <div className={classes.discordGitWrap}>
                <DiscordGitCTA appearance="minimal" />
              </div>
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
