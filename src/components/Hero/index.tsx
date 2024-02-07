import React from 'react'

import { BlocksProp } from '@components/RenderBlocks'
import { Page } from '@root/payload-types'
import { CenteredCarouselHero } from './CenteredCarousel'
import { CenteredContent } from './CenteredContent'
import { ContentMediaHero } from './ContentMedia'
import { DefaultHero } from './Default'
import { FormHero } from './FormHero'
import { HomeHero } from './Home'
import { LivestreamHero } from './Livestream'

const heroes = {
  default: DefaultHero,
  contentMedia: ContentMediaHero,
  home: HomeHero,
  form: FormHero,
  livestream: LivestreamHero,
  centeredCarousel: CenteredCarouselHero,
  centeredContent: CenteredContent,
}

export const Hero: React.FC<{
  page: Page
  firstContentBlock: BlocksProp
}> = props => {
  const {
    page: {
      hero,
      breadcrumbs,
      hero: { type },
    },
    firstContentBlock,
  } = props

  const HeroToRender = heroes[type] as any

  if (HeroToRender) {
    return (
      <HeroToRender {...hero} firstContentBlock={firstContentBlock} breadcrumbs={breadcrumbs} />
    )
  }

  return null
}
