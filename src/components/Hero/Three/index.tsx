'use client'

import type { BlocksProp } from '@components/RenderBlocks/index'
import type { Page } from '@root/payload-types'

import BackgroundGradient from '@components/BackgroundGradient/index'
import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { CMSLink } from '@components/CMSLink/index'
import CreatePayloadApp from '@components/CreatePayloadApp'
import { Gutter } from '@components/Gutter/index'
import { MediaStack } from '@components/MediaStack'
import { NewsletterSignUp } from '@components/NewsletterSignUp'
import { RichText } from '@components/RichText/index'

import classes from './index.module.scss'

export const ThreeHero: React.FC<
  {
    firstContentBlock?: BlocksProp
  } & Pick<
    Page['hero'],
    | 'announcementLink'
    | 'buttons'
    | 'description'
    | 'enableAnnouncement'
    | 'images'
    | 'newsletter'
    | 'richText'
    | 'theme'
    | 'threeCTA'
  >
> = ({
  announcementLink,
  buttons,
  enableAnnouncement,
  images,
  newsletter,
  richText,
  theme,
  threeCTA,
}) => {
  return (
    <>
      <BlockWrapper
        className={classes.blockWrapper}
        hero
        padding={{ bottom: 'large', top: 'small' }}
        settings={{ theme }}
      >
        <BackgroundGrid zIndex={1} />
        <Gutter>
          <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
            <div className={[classes.sidebar, 'cols-4 cols-m-8 start-1'].filter(Boolean).join(' ')}>
              {enableAnnouncement && (
                <div className={classes.announcementLink}>
                  <CMSLink {...announcementLink} />
                </div>
              )}
              <RichText
                className={[classes.richText].filter(Boolean).join(' ')}
                content={richText}
              />
              {threeCTA === 'buttons' &&
                buttons &&
                Array.isArray(buttons) &&
                buttons.length > 0 && (
                  <div className={classes.linksWrapper}>
                    {Array.isArray(buttons) &&
                      buttons.map((button, i) => {
                        if (button.blockType === 'command') {
                          return (
                            <CreatePayloadApp
                              background={false}
                              className={classes.createPayloadApp}
                              key={i + button.command}
                              label={button.command}
                            />
                          )
                        }
                        if (button.blockType === 'link' && button.link) {
                          return (
                            <CMSLink
                              key={i + button.link.label}
                              {...button.link}
                              appearance="default"
                              buttonProps={{
                                hideBorders: true,
                              }}
                              className={classes.link}
                            />
                          )
                        }
                      })}
                  </div>
                )}
              {threeCTA === 'newsletter' && (
                <NewsletterSignUp
                  description={newsletter?.description ?? undefined}
                  placeholder={newsletter?.placeholder ?? undefined}
                />
              )}
            </div>
            <div className={[classes.graphicWrapper, 'cols-8 start-8'].join(' ')}>
              {/* <BigThree /> */}
              {images && Array.isArray(images) && images.length > 0 && (
                <MediaStack media={images} />
              )}
            </div>
          </div>
        </Gutter>
      </BlockWrapper>
      <BackgroundGradient className={classes.backgroundGradient} />
    </>
  )
}
