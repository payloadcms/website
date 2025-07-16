'use client'

import type { BlocksProp } from '@components/RenderBlocks/index'
import type { Page } from '@root/payload-types'

import BackgroundGradient from '@components/BackgroundGradient'
import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { Button } from '@components/Button'
import { ChangeHeaderTheme } from '@components/ChangeHeaderTheme/index'
import { CMSLink } from '@components/CMSLink/index'
import { CommandLine } from '@components/CommandLine'
import { Gutter } from '@components/Gutter/index'
import { LogoShowcase } from '@components/Hero/HomeNew/LogoShowcase/index'
import { Media } from '@components/Media/index'
import { MediaStack } from '@components/MediaStack'
import { RichText } from '@components/RichText/index'

import classes from './index.module.scss'

export const HomeNewHero: React.FC<
  {
    firstContentBlock?: BlocksProp
  } & Page['hero']
> = ({
  announcementLink,
  description,
  enableAnnouncement,
  featureVideo,
  images,
  logoShowcase,
  logoShowcaseLabel,
  primaryButtons,
  richText,
  secondaryButtons,
  secondaryHeading,
}) => {
  const filteredLogos = logoShowcase?.filter((logo) => typeof logo !== 'string')

  return (
    <ChangeHeaderTheme theme="dark">
      <BlockWrapper
        className={classes.heroWrapper}
        hero
        padding={{ bottom: 'small', top: 'small' }}
        settings={{ theme: 'dark' }}
      >
        <Gutter className={[classes.heroContentWrapper, 'grid'].join(' ')}>
          <div className={['cols-4 cols-m-8', classes.heroContent].filter(Boolean).join(' ')}>
            {enableAnnouncement && (
              <div className={classes.announcementLink}>
                <CMSLink {...announcementLink} />
              </div>
            )}
            <RichText className={classes.heroText} content={richText} />
            {Array.isArray(primaryButtons) && (
              <ul className={classes.primaryButtons}>
                {primaryButtons.map((button, i) => {
                  if (button.type === 'link') {
                    return (
                      <li key={i}>
                        <CMSLink
                          {...button.link}
                          appearance="default"
                          buttonProps={{
                            hideHorizontalBorders: true,
                            icon: 'arrow',
                          }}
                          fullWidth
                        />
                      </li>
                    )
                  } else if (button.type === 'npmCta' && button.npmCta?.label) {
                    return (
                      <li className={classes.command} key={i}>
                        <CommandLine command={button.npmCta?.label} inLinkGroup />
                      </li>
                    )
                  }
                })}
              </ul>
            )}
          </div>
          <div className={[classes.graphicWrapper, 'cols-8 start-8 start-m-1'].join(' ')}>
            {images && Array.isArray(images) && images.length > 0 && <MediaStack media={images} />}
          </div>
        </Gutter>
        <Gutter className={[classes.logoShowcaseWrapper, 'grid'].join(' ')}>
          {logoShowcaseLabel && <RichText content={logoShowcaseLabel} />}
          {filteredLogos && <LogoShowcase logos={filteredLogos} />}
        </Gutter>
        <BackgroundGrid
          gridLineStyles={[
            {
              background:
                'linear-gradient(to bottom, transparent 80px, var(--theme-border-color) 240px)',
            },
            {
              background:
                'linear-gradient(to bottom, transparent 160px, var(--theme-border-color) 240px)',
            },
            {
              background:
                'linear-gradient(to bottom, transparent 200px, var(--theme-border-color) 240px)',
            },
            {
              background:
                'linear-gradient(to bottom, transparent 160px, var(--theme-border-color) 240px)',
            },
            {
              background:
                'linear-gradient(to bottom, transparent 80px, var(--theme-border-color) 240px)',
            },
          ]}
          zIndex={-2}
        />
      </BlockWrapper>
      <BackgroundGradient className={classes.backgroundGradient} />
    </ChangeHeaderTheme>
  )
}
