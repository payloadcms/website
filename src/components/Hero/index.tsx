import React from 'react'

import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar'
import { BlocksProp } from '@components/RenderBlocks'
import { Page } from '@root/payload-types'
import { CenteredContent } from './CenteredContent'
import { ContentMediaHero } from './ContentMedia'
import { DefaultHero } from './Default'
import { FormHero } from './FormHero'
import { GradientHero } from './Gradient'
import { HomeHero } from './Home'
import { LivestreamHero } from './Livestream'

const heroes = {
  default: DefaultHero,
  contentMedia: ContentMediaHero,
  home: HomeHero,
  form: FormHero,
  livestream: LivestreamHero,
  centeredContent: CenteredContent,
  gradient: GradientHero,
}

export const Hero: React.FC<{
  page: Page
  firstContentBlock?: BlocksProp
}> = props => {
  const {
    page: {
      hero,
      breadcrumbs,
      hero: { type, enableBreadcrumbsBar },
    },
    firstContentBlock,
  } = props

  const HeroToRender = heroes[type] as any

  if (HeroToRender) {
    return (
      <>
        {enableBreadcrumbsBar && <BreadcrumbsBar hero={hero} breadcrumbs={breadcrumbs} />}

        <HeroToRender {...hero} firstContentBlock={firstContentBlock} breadcrumbs={breadcrumbs} />
      </>
    )
  }

  return null
}
