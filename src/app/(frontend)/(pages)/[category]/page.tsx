import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockWrapper } from '@components/BlockWrapper'
import { Gutter } from '@components/Gutter'
import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar'
import { fetchArchive, fetchArchives } from '@data'
import { ContentMediaCard } from '@components/cards/ContentMediaCard'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { FeaturedBlogPost } from '@components/FeaturedBlogPost'

import React from 'react'

import classes from './index.module.scss'
import { notFound } from 'next/navigation'
import { BackgroundScanline } from '@components/BackgroundScanline'

export const dynamicParams = false
export default async ({
  params,
}: {
  params: Promise<{
    category: string
  }>
}) => {
  const { category } = await params
  const { isEnabled: draft } = await draftMode()
  const archive = draft
    ? await fetchArchive(category, draft)
    : await unstable_cache(fetchArchive, [`${category}-archive`])(category, draft)
  const archives = draft
    ? await fetchArchives(category)
    : await unstable_cache(fetchArchives, [`${category}-archives`])(category)

  const { headline, description } = archive
  const posts = archive.posts?.docs

  if (!archive || !posts) {
    notFound()
  }

  const latestPost = posts[0]

  const breadcrumbsLinks = archives.map((archive) => ({
    label: archive.name,
    url: `/${archive.slug}`,
  }))

  return (
    <React.Fragment>
      <BreadcrumbsBar breadcrumbs={[{ label: archive.name }]} links={breadcrumbsLinks} />
      <BlockWrapper padding={{ bottom: 'large', top: 'hero' }} settings={{}}>
        <BackgroundGrid zIndex={-1} />
        <Gutter>
          <div className={[classes.hero].filter(Boolean).join(' ')}>
            <div className={[classes.heroContent, 'grid'].filter(Boolean).join(' ')}>
              <h2 className={[classes.title, 'cols-8 cols-m-8'].filter(Boolean).join(' ')}>
                {headline}
              </h2>
              <p
                className={[classes.description, 'cols-4 start-13 start-m-1 cols-m-8']
                  .filter(Boolean)
                  .join(' ')}
              >
                {description}
              </p>
            </div>
          </div>
          {latestPost && typeof latestPost !== 'string' && <FeaturedBlogPost {...latestPost} />}
          {posts && Array.isArray(posts) && posts.length > 0 ? (
            <div className={[classes.cardGrid, 'grid'].filter(Boolean).join(' ')}>
              {(posts || []).slice(1).map(
                (post) =>
                  typeof post !== 'string' && (
                    <div className={['cols-8 cols-m-8'].filter(Boolean).join(' ')} key={post.id}>
                      <ContentMediaCard
                        authors={post.authors}
                        href={`/${category}/${post.slug}`}
                        media={post.image}
                        publishedOn={post.publishedOn}
                        title={post.title}
                      />
                    </div>
                  ),
              )}
            </div>
          ) : (
            <div className={classes.noPosts}>
              <h5>No posts to show.</h5>
              <BackgroundScanline />
            </div>
          )}
        </Gutter>
      </BlockWrapper>
    </React.Fragment>
  )
}

export const generateStaticParams = async () => {
  const archives = await fetchArchives()
  return archives.map((archive) => ({
    category: archive.slug,
  }))
}

export const generateMetadata = async ({ params }: { params: Promise<{ category: string }> }) => {
  const { category } = await params
  const archive = await fetchArchive(category)
  const { name, description } = archive

  return {
    title: `${name} | Payload`,
    description,
  }
}
