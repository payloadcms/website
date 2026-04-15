import type { Metadata } from 'next'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockWrapper } from '@components/BlockWrapper'
import { ContentMediaCard } from '@components/cards/ContentMediaCard'
import { Gutter } from '@components/Gutter'
import { fetchReleases } from '@data'
import { unstable_cache } from 'next/cache'
import React from 'react'

export default async function ReleasesPage() {
  const getReleases = unstable_cache(fetchReleases, ['releases-archive'])
  const releases = await getReleases()

  return (
    <BlockWrapper padding={{ bottom: 'large', top: 'large' }} settings={{}}>
      <BackgroundGrid />
      <Gutter>
        <h1>Releases</h1>
        {releases && Array.isArray(releases) && releases.length > 0 ? (
          <div className={['grid'].filter(Boolean).join(' ')} style={{ marginTop: '2rem' }}>
            {releases.map((release) => {
              if (typeof release === 'string' || !release.slug) {
                return null
              }

              return (
                <div className={['cols-8 cols-m-8'].filter(Boolean).join(' ')} key={release.slug}>
                  <ContentMediaCard
                    authors={release.authors}
                    href={`/posts/releases/${release.slug}`}
                    media={
                      release.image ??
                      `/api/og?type=releases&title=${encodeURIComponent(release.title || '')}`
                    }
                    publishedOn={release.publishedOn}
                    title={release.title}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <p>No releases found.</p>
        )}
      </Gutter>
    </BlockWrapper>
  )
}

export const metadata: Metadata = {
  description: 'Release notes for Payload CMS',
  title: 'Releases | Payload',
}
