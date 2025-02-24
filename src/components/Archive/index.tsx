import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockWrapper } from '@components/BlockWrapper'
import { Gutter } from '@components/Gutter'
import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar'
import { fetchArchive, fetchArchives } from '@data'
import { Category } from '@root/payload-types'
import { ContentMediaCard } from '@components/cards/ContentMediaCard'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

import classes from './index.module.scss'
import { FeaturedBlogPost } from '@components/FeaturedBlogPost'
import { BackgroundScanline } from '@components/BackgroundScanline'
import Link from 'next/link'
import { ArrowIcon } from '@icons/ArrowIcon'
import { ChevronDownIcon } from '@icons/ChevronDownIcon'
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
            href={`/${slug}`}
            key={slug}
            className={[classes.tab, slug == category ? classes.active : '']
              .filter(Boolean)
              .join(' ')}
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

  const { headline, description } = archive
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
    </>
  )
}
