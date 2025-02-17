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

export const Archive: React.FC<{ category: Category['slug'] }> = async ({ category }) => {
  const { isEnabled: draft } = await draftMode()
  const getArchive = draft ? fetchArchive : unstable_cache(fetchArchive, [`${category}-archive`])
  const getArchives = draft
    ? fetchArchives
    : unstable_cache(fetchArchives, [`${category}-archives`])

  const archive = await getArchive(category)
  const archives = await getArchives(category)

  const { headline, description } = archive
  const posts = archive.posts?.docs || []

  const latestPost = posts[0]

  const breadcrumbsLinks = archives.map((archive) => ({
    label: archive.name,
    url: `/${archive.slug}`,
  }))

  return (
    <>
      <BreadcrumbsBar breadcrumbs={[{ label: archive.name }]} links={breadcrumbsLinks} />
      <BlockWrapper padding={{ bottom: 'large', top: 'hero' }} settings={{}}>
        <BackgroundGrid zIndex={0} />
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
          {posts && Array.isArray(posts) && posts.length > 0 && (
            <div className={[classes.cardGrid, 'grid'].filter(Boolean).join(' ')}>
              {(posts || []).slice(1).map(
                (post) =>
                  typeof post !== 'string' && (
                    <div className={['cols-8 cols-m-8'].filter(Boolean).join(' ')} key={post.id}>
                      <ContentMediaCard
                        authors={post.authors}
                        href={`/blog/${post.slug}`}
                        media={post.image}
                        publishedOn={post.publishedOn}
                        title={post.title}
                      />
                    </div>
                  ),
              )}
            </div>
          )}
        </Gutter>
      </BlockWrapper>
    </>
  )
}
