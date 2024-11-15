import { BackgroundGrid } from '@components/BackgroundGrid'
import { Gutter } from '@components/Gutter'
import RichText from '@components/RichText'
import { fetchGetStarted } from '@data'
import * as Tabs from '@radix-ui/react-tabs'
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

  const { heading, sidebar, tabs } = data
  return (
    <Gutter className={['grid', classes.wrap].filter(Boolean).join(' ')}>
      <main className={['cols-12 cols-m-8', classes.mainContent].filter(Boolean).join(' ')}>
        {heading && <h1 className={classes.heading}>{heading}</h1>}
        {tabs && tabs.length > 0 && (
          <Tabs.Root className={classes.tabs} defaultValue={tabs[0].id ?? ''}>
            <Tabs.List className={classes.tabsList}>
              {tabs.map(tab => {
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
            {tabs.map(tab => {
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
      <aside className={['cols-4 cols-m-8', classes.sidebarContent].filter(Boolean).join(' ')}>
        <RichText content={sidebar} />
      </aside>
      <BackgroundGrid />
    </Gutter>
  )
}
