'use client'

import BackgroundGradient from '@components/BackgroundGradient'
import { BlockWrapper } from '@components/BlockWrapper/index.js'
import { ChangeHeaderTheme } from '@components/ChangeHeaderTheme/index.js'
import { CMSLink } from '@components/CMSLink/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { LogoShowcase } from '@components/Hero/HomeNew/LogoShowcase/index.js'
import { Media } from '@components/Media/index.js'
import { BlocksProp } from '@components/RenderBlocks/index.js'
import { RichText } from '@components/RichText/index.js'
import { Page } from '@root/payload-types.js'

import classes from './index.module.scss'
import { BackgroundGrid } from '@components/BackgroundGrid'
import { CommandLine } from '@components/CommandLine'
import { Button } from '@components/Button'

export const HomeNewHero: React.FC<
  Page['hero'] & {
    firstContentBlock?: BlocksProp
  }
> = ({
  enableAnnouncement,
  announcementLink,
  richText,
  description,
  secondaryHeading,
  secondaryButtons,
  featureVideo,
  logoShowcase,
}) => {
  const filteredLogos = logoShowcase?.filter(logo => typeof logo !== 'string')

  return (
    <ChangeHeaderTheme theme="dark">
      <BlockWrapper
        settings={{ theme: 'dark' }}
        padding={{ top: 'large', bottom: 'large' }}
        className={classes.heroWrapper}
      >
        <Gutter className={[classes.heroContent, 'grid'].join(' ')}>
          {enableAnnouncement && (
            <div className="cols-16">
              <div className={classes.announcementLink}>
                <CMSLink {...announcementLink} />
              </div>
            </div>
          )}
          <div className="cols-10 cols-m-8">
            <RichText content={richText} />
          </div>
          <div className="cols-4 start-13 cols-m-8 start-m-1">
            <RichText content={description} />
            <CommandLine command="create-payload-app@latest" />
          </div>
        </Gutter>
        <Gutter>
          {featureVideo && typeof featureVideo !== 'string' && (
            <Media resource={featureVideo} className={classes.featureVideo} />
          )}
        </Gutter>
        <Gutter className={[classes.secondaryContentWrapper, 'grid'].join(' ')}>
          <div className={['cols-6 cols-m-8', classes.secondaryContent].join(' ')}>
            {secondaryHeading && <RichText content={secondaryHeading} />}

            {Array.isArray(secondaryButtons) && (
              <ul className={classes.secondaryButtons}>
                {secondaryButtons.map(({ link }, i) => {
                  return (
                    <li key={i}>
                      <CMSLink
                        {...link}
                        appearance="default"
                        fullWidth
                        buttonProps={{
                          icon: 'arrow',
                          hideHorizontalBorders: true,
                        }}
                      />
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          <div className="cols-8 start-9 start-m-1">
            {filteredLogos && <LogoShowcase logos={filteredLogos} />}
          </div>
        </Gutter>
        <BackgroundGrid zIndex={-2} />
      </BlockWrapper>
      <BackgroundGradient className={classes.backgroundGradient} />
    </ChangeHeaderTheme>
  )
}
