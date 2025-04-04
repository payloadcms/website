'use client'

import type { Post } from '@root/payload-types'

import { Drawer, DrawerToggler } from '@components/Drawer'
import { GuestSocials } from '@components/GuestSocials'
import { Media } from '@components/Media'
import { RenderBlocks } from '@components/RenderBlocks'
import { Video } from '@components/RichText/Video/index'
import { ArrowRightIcon } from '@icons/ArrowRightIcon'
import { PlayIcon } from '@icons/PlayIcon'
import { getVideo } from '@root/utilities/get-video'
import { formatOxfordComma } from '@root/utilities/oxford-comma'
import { qs } from '@root/utilities/qs'
import { useCallback, useEffect, useState } from 'react'

import classes from './index.module.scss'

export const ResourceBlock: React.FC<{ id: string }> = ({ id }) => {
  const [resource, setResource] = useState<
    | { category: string; featuredMedia: 'upload' | 'videoUrl'; slug: string; title: string }
    | null
    | undefined
  >(null)
  const [resourceData, setResourceData] = useState<null | Partial<Post> | undefined>(null)

  useEffect(() => {
    if (!id) {
      return
    }
    const fetchResource = async () => {
      const query = qs.stringify({
        select: {
          slug: true,
          category: true,
          featuredMedia: true,
          title: true,
        },
      })
      const res = await fetch(`/api/posts/${id}?${query}`)
      const data = await res.json()

      return data
    }
    fetchResource()
      .then((res) =>
        setResource({
          slug: res.slug,
          category: res.category.slug,
          featuredMedia: res.featuredMedia,
          title: res.title,
        }),
      )
      .catch((err) => {
        console.error('Error fetching resource:', err)
        setResource(undefined)
      })
  }, [id])

  const handleDrawerOpen = useCallback(async () => {
    if (resourceData) {
      return
    }
    const fetchResourceData = async () => {
      const query = qs.stringify({
        depth: 2,
        select: {
          authors: true,
          authorType: true,
          content: true,
          excerpt: true,
          guestAuthor: true,
          guestSocials: true,
          image: true,
          publishedOn: true,
          relatedResources: true,
          videoUrl: true,
        },
        where: {
          slug: {
            equals: resource?.slug,
          },
        },
      })

      const res = await fetch(`/api/posts?${query}`)
      const data = await res.json()

      if (data?.docs?.length > 0) {
        setResourceData(data.docs[0])
      } else {
        setResourceData(undefined)
      }
    }
    await fetchResourceData()
  }, [resource, resourceData])

  useEffect(() => {
    console.log('Resource data:', resourceData)
  }, [resourceData])

  return (
    <>
      <DrawerToggler
        className={resource === null ? classes.loading : classes.resourceBanner}
        disabled={!resource}
        onClick={() => handleDrawerOpen()}
        slug={`resource_${id}`}
      >
        {resource === null ? (
          <span className={classes.skeleton} />
        ) : resource === undefined ? (
          <div>Linked resource not found</div>
        ) : (
          <>
            <span className={classes.resourceTitle}>
              {resource.featuredMedia === 'videoUrl' && <PlayIcon size="large" />}
              {resource.category === 'guides' && 'Guide: '}
              {resource.title}
            </span>
            <ArrowRightIcon className={classes.arrow} size="large" />
          </>
        )}
      </DrawerToggler>
      <Drawer
        size="s"
        slug={`resource_${id}`}
        title={
          resource?.category === 'guides' ? (
            resourceData?.authorType === 'guest' ? (
              <span className={classes.resourceTypeBadge}>Community Guide</span>
            ) : (
              <span className={classes.resourceTypeBadge}>Official Guide</span>
            )
          ) : (
            <span className={classes.resourceTypeBadge}>Blog</span>
          )
        }
      >
        {resourceData ? (
          <article className={classes.resourceContent}>
            <h1 className={classes.articleTitle}>{resource?.title}</h1>
            {resourceData && (
              <span className={classes.author}>
                By {resourceData?.authorType === 'guest' && resourceData.guestAuthor}
                {resourceData?.authorType === 'team' &&
                  formatOxfordComma(
                    resourceData?.authors?.map(
                      (author) =>
                        typeof author !== 'string' && `${author.firstName} ${author.lastName}`,
                    ),
                  )}
                {resourceData?.authorType === 'guest' && resourceData?.guestSocials && (
                  <GuestSocials guestSocials={resourceData?.guestSocials} />
                )}
              </span>
            )}
            {resource?.featuredMedia === 'upload'
              ? resourceData?.image &&
                typeof resourceData?.image !== 'string' && (
                  <Media className={classes.heroImage} priority resource={resourceData?.image} />
                )
              : resourceData?.videoUrl && <Video {...getVideo(resourceData?.videoUrl)} />}
            {resourceData?.content && <RenderBlocks blocks={resourceData.content} disableGutter />}
            {resourceData?.relatedPosts &&
              typeof resourceData.relatedPosts[0] !== 'string' &&
              typeof resourceData.relatedPosts[0]?.image !== 'string' && (
                <RenderBlocks
                  blocks={[
                    {
                      blockName: 'Related Posts',
                      blockType: 'relatedPosts',
                      relatedPosts: resourceData.relatedPosts || [],
                    },
                  ]}
                  disableGutter
                />
              )}
          </article>
        ) : (
          <div className={classes.drawerSkeleton} />
        )}
      </Drawer>
    </>
  )
}
