'use client'

import { Banner } from '@components/Banner'
import { ArrowRightIcon } from '@icons/ArrowRightIcon'
import { PlayIcon } from '@icons/PlayIcon'
import { qs } from '@root/utilities/qs'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import classes from './index.module.scss'

export const ResourceBlock: React.FC<{ id: string }> = ({ id }) => {
  const [resource, setResource] = useState<
    | { category: string; featuredMedia: 'upload' | 'videoUrl'; slug: string; title: string }
    | null
    | undefined
  >(null)

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

  return (
    <Link href={`/posts/${resource?.category}/${resource?.slug}`} target="_blank">
      <Banner type="success">
        {resource === null ? (
          <span className={classes.skeleton} />
        ) : resource === undefined ? (
          <div>Linked resource not found</div>
        ) : (
          <div className={classes.bannerContent}>
            <span className={classes.resourceTitle}>
              {resource.featuredMedia === 'videoUrl' && <PlayIcon size="large" />}
              {resource.category === 'guides' && 'Guide: '}
              {resource.title}
            </span>
            <ArrowRightIcon className={classes.arrow} size="large" />
          </div>
        )}
      </Banner>
    </Link>
  )
}
