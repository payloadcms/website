import { fetchRelatedThreads } from '@graphql'
import { BackgroundScanline } from '@components/BackgroundScanline/index.js'
import { RelatedHelpList } from '@components/RelatedHelpList/index.js'
import { VersionSelector } from '@components/VersionSelector/index.js'
import { TableOfContents } from '@components/TableOfContents/index.js'
import { BackgroundGrid } from '@components/BackgroundGrid'
import { DocsNavigation } from '@components/DocsNavigation'
import { DiscordGitCTA } from '@components/DiscordGitCTA/index.js'
import { ArrowIcon } from '@icons/ArrowIcon/index.js'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Gutter } from '@components/Gutter'
import components from '@components/MDX/components/index.js'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'

import classes from './index.module.scss'
import { JumplistProvider } from '@components/Jumplist'

export const RenderDocs = async ({
  params,
  topics,
  children,
  version,
}: {
  params: { topic: string; doc: string }
  topics: any[]
  children?: React.ReactNode
  version?: string
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

  const next =
    topics[topicIndex].docs.length <= docIndex + 1
      ? {
          topic: topics[topicIndex + 1].slug,
          slug: topics[topicIndex + 1].docs[0].slug,
          title: topics[topicIndex + 1].docs[0].title,
        }
      : {
          topic: params.topic,
          slug: topics[topicIndex].docs[docIndex + 1].slug,
          title: topics[topicIndex].docs[docIndex + 1].title,
        }

  return (
    <Gutter className={classes.wrap}>
      <JumplistProvider>
        <div className="grid">
          <DocsNavigation
            currentTopic={params.topic}
            topics={topics}
            params={params}
            version={version}
          />
          <div className={classes.navOverlay} aria-hidden={true} />
          <main className={['cols-8 start-5 cols-m-8 start-m-1', classes.content].join(' ')}>
            <Suspense fallback={<DocsSkeleton />}>
              {children}
              <h1 className={classes.title}>{currentDoc.title}</h1>
              <div className={classes.mdx}>
                <MDXRemote
                  source={currentDoc.content}
                  components={components}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                    },
                  }}
                />
              </div>
            </Suspense>
            {next && (
              <Link
                className={[classes.next, hasRelatedThreads && classes.hasRelatedThreads]
                  .filter(Boolean)
                  .join(' ')}
                href={`/docs/${version ? `${version}/` : ''}${next.topic.toLowerCase()}/${
                  next.slug
                }`}
                data-algolia-no-crawl
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
              {!hideVersionSelector && <VersionSelector initialVersion={'current'} />}
              <TableOfContents headings={currentDoc.headings} />
              <div className={classes.discordGitWrap}>
                <DiscordGitCTA style="minimal" />
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
