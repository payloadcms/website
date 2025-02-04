import { RichText } from '@components/RichText'
import classes from './index.module.scss'
import { fetchBlogPost } from '@data'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@components/RenderBlocks'
import { Video } from '@components/RichText/Video/index.js'
import { ArrowRightIcon } from '@icons/ArrowRightIcon'
import { Media } from '@components/Media'
import { GuestSocials } from '@components/GuestSocials'
import { ArrowIcon } from '@icons/ArrowIcon'
import { BackButton } from '@components/BackButton'

export default async function Guide({
  params,
}: {
  params: Promise<{
    slug: string
  }>
}) {
  const { slug } = await params

  const guide = await fetchBlogPost(slug)

  if (!guide) {
    return notFound()
  }

  const {
    title,
    excerpt,
    content,
    image,
    useVideo,
    videoUrl,
    guestAuthor,
    guestSocials,
    authorType,
    authors,
    relatedPosts,
  } = guide

  let videoToUse: {
    id: string
    platform: 'vimeo' | 'youtube'
  } | null = null

  if (videoUrl && (videoUrl.includes('vimeo') || videoUrl.includes('youtube'))) {
    const platform = videoUrl.includes('vimeo') ? 'vimeo' : 'youtube'
    const id = platform === 'vimeo' ? videoUrl.split('/').pop() : videoUrl.split('v=').pop()

    videoToUse = {
      id: id || '',
      platform,
    }
  }

  return (
    <div className={classes.backdrop} data-modal="open">
      <BackButton className={classes.overlayButton} />
      <div className={classes.guide}>
        <div className={classes.guideHeader}>
          <BackButton className={classes.guideBackButton}>
            <ArrowRightIcon className={classes.arrow} />
            Go back
          </BackButton>
        </div>
        <article className={classes.guideContent}>
          {authorType === 'guest' && (
            <span className={classes.communityBadge}>Community Guide</span>
          )}
          <h1 className={classes.guideTitle}>{title}</h1>
          <div className={classes.authorWrap}>
            {authorType === 'guest' ? (
              <>
                <span>
                  Created by <span className={classes.author}>{guestAuthor}</span>
                </span>
                {guestSocials && (
                  <GuestSocials guestSocials={guestSocials} className={classes.guestSocials} />
                )}
              </>
            ) : (
              <span>
                {authors?.map(
                  (author) =>
                    typeof author !== 'string' && (
                      <span key={author.id}>
                        {author.firstName} {author.lastName}
                      </span>
                    ),
                )}
              </span>
            )}
          </div>
          <div className={classes.heroImage}>
            {useVideo ? (
              <Video {...videoToUse} />
            ) : (
              typeof image !== 'string' && <Media priority resource={image} />
            )}
          </div>
          <RichText content={excerpt} />
          <div className={classes.blocks}>
            <RenderBlocks blocks={content} disableGutter />
          </div>
          {relatedPosts && (
            <div className={classes.relatedPosts}>
              <h4>Related Resources</h4>
              <ul>
                {relatedPosts.map(
                  (post) =>
                    typeof post !== 'string' && (
                      <li key={post.id}>
                        <a href={`/${post.category ?? 'blog'}/${post.slug}`}>
                          {post.title} <ArrowIcon className={classes.relatedPostsArrow} />
                        </a>
                      </li>
                    ),
                )}
              </ul>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
