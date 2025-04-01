import type { Category } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BackgroundScanline } from '@components/BackgroundScanline'
import { BlockWrapper } from '@components/BlockWrapper'
import { ContentMediaCard } from '@components/cards/ContentMediaCard'
import { FeaturedBlogPost } from '@components/FeaturedBlogPost'
import { Gutter } from '@components/Gutter'
import { fetchArchive, fetchArchives } from '@data'
import { ArrowIcon } from '@icons/ArrowIcon'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import Link from 'next/link'

import classes from './index.module.scss'
import { MobileNav } from './MobileNav'

const Navigation = ({
  archives,
  category,
  className,
}: {
  archives: Partial<Category>[]
  category: Category['slug']
  className?: string
}) => {
  return (
    <nav className={className}>
      {archives.map(({ name, slug }) => {
        return (
          <Link
            className={[classes.tab, slug == category ? classes.active : '']
              .filter(Boolean)
              .join(' ')}
            href={`/posts/${slug}`}
            key={slug}
          >
            {name}
          </Link>
        )
      })}
      <Link href="/case-studies">
        Case Studies <ArrowIcon />
      </Link>
      <Link href="https://www.github.com/payloadcms/payload/releases" target="_blank">
        Releases <ArrowIcon />
      </Link>
    </nav>
  )
}

export const Archive: React.FC<{ category: Category['slug'] }> = async ({ category }) => {
  const { isEnabled: draft } = await draftMode()
  const getArchive = draft ? fetchArchive : unstable_cache(fetchArchive, [`${category}-archive`])
  const getArchives = draft
    ? fetchArchives
    : unstable_cache(fetchArchives, [`archives`], {
        tags: ['archives'],
      })

  const archive = await getArchive(category)
  const archives = await getArchives()

  const { description, headline } = archive
  const posts = archive.posts?.docs || []

  const latestPost = posts[0]

  return (
    <>
      <div className={classes.navigation}>
        <span className={classes.breadcrumbsLabel}>Posts</span>
        <MobileNav className={classes.mobileNav} currentCategory={archive.name ?? ''}>
          <Navigation archives={archives} category={category} />
        </MobileNav>
        <Navigation archives={archives} category={category} className={classes.desktopNav} />
      </div>
      <BlockWrapper padding={{ bottom: 'large', top: 'small' }} settings={{}}>
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
          {latestPost && typeof latestPost !== 'string' && (
            <FeaturedBlogPost {...latestPost} category={category} />
          )}
          {posts && Array.isArray(posts) && posts.length > 0 ? (
            <div className={[classes.cardGrid, 'grid'].filter(Boolean).join(' ')}>
              {(posts || [])
                .slice(1)
                .filter((post) => typeof post !== 'string')
                .map((post) => {
                  const thumbnailAsset =
                    post.featuredMedia === 'upload'
                      ? post.image
                      : post.dynamicThumbnail
                        ? `/api/og?type=${category}&title=${post.title}`
                        : post.thumbnail

                  return (
                    typeof post !== 'string' && (
                      <div className={['cols-8 cols-m-8'].filter(Boolean).join(' ')} key={post.id}>
                        <ContentMediaCard
                          authors={post.authors}
                          href={`/posts/${category}/${post.slug}`}
                          media={thumbnailAsset ?? ''}
                          publishedOn={post.publishedOn}
                          title={post.title}
                        />
                      </div>
                    )
                  )
                })}
            </div>
          ) : (
            <div className={classes.noPosts}>
              <h5>No posts to show.</h5>
              <BackgroundScanline />
            </div>
          )}
        </Gutter>
      </BlockWrapper>
    </>
  )
}
