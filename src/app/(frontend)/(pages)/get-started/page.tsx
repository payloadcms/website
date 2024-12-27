import type { Metadata } from 'next'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { fetchGetStarted } from '@data'
import * as Tabs from '@radix-ui/react-tabs'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import React from 'react'

import classes from './index.module.scss'
export default async function GetStartedPage() {
  const getGetStartedPage = unstable_cache(fetchGetStarted, ['get-started'])
  const data = await getGetStartedPage()

  if (!data) {
    return notFound()
  }

  const { heading, sidebar, sidebarLinks, tabs } = data
  return (
    <Gutter className={['grid', classes.wrap].filter(Boolean).join(' ')}>
      <main className={['cols-12 cols-m-8', classes.mainContent].filter(Boolean).join(' ')}>
        {heading && <h1 className={classes.heading}>{heading}</h1>}
        {tabs && tabs.length > 0 && (
          <Tabs.Root className={classes.tabs} defaultValue={tabs[0].id ?? ''}>
            <Tabs.List className={classes.tabsList}>
              {tabs.map((tab) => {
                return (
                  tab &&
                  tab.id && (
                    <Tabs.Trigger className={classes.tabsTrigger} key={tab.label} value={tab.id}>
                      {tab.label}
                    </Tabs.Trigger>
                  )
                )
              })}
            </Tabs.List>
            {tabs.map((tab) => {
              return (
                tab &&
                tab.id && (
                  <Tabs.Content className={classes.tabsContent} key={tab.label} value={tab.id}>
                    <RichText content={tab.content} />
                  </Tabs.Content>
                )
              )
            })}
          </Tabs.Root>
        )}
      </main>
      <aside className={['cols-4 cols-m-8', classes.sidebar].filter(Boolean).join(' ')}>
        <div>
          <RichText className={classes.sidebarContent} content={sidebar} />
          {sidebarLinks && sidebarLinks.length > 0 && (
            <ul className={classes.sidebarLinks}>
              {sidebarLinks.map(({ id, link }) => (
                <CMSLink
                  key={id}
                  {...link}
                  appearance="default"
                  buttonProps={{ hideBottomBorderExceptLast: true, hideHorizontalBorders: true }}
                  className={classes.sidebarLink}
                  fullWidth
                />
              ))}
            </ul>
          )}
        </div>
      </aside>
      <BackgroundGrid />
    </Gutter>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: any
  }>
}): Promise<Metadata> {
  const { slug } = await params
  const getGetStartedPage = unstable_cache(fetchGetStarted, ['get-started'])
  const { meta } = await getGetStartedPage()

  const ogImage =
    typeof meta?.image === 'object' &&
    meta?.image !== null &&
    'url' in meta.image &&
    `${process.env.NEXT_PUBLIC_CMS_URL}${meta.image.url}`

  return {
    description: meta?.description,
    openGraph: mergeOpenGraph({
      description: meta?.description ?? undefined,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title: meta?.title || 'Payload',
      url: Array.isArray(slug) ? slug.join('/') : '/',
    }),
    title: meta?.title || 'Payload',
  }
}
