import BackgroundGradient from '@components/BackgroundGradient/index.js'
import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import BigThree from '@components/BigThree/index.js'
import { BlockWrapper } from '@components/BlockWrapper/index.js'
import { CMSLink } from '@components/CMSLink/index.js'
import CreatePayloadApp from '@components/CreatePayloadApp/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { BlocksProp } from '@components/RenderBlocks/index.js'
import { RichText } from '@components/RichText/index.js'
import { Page } from '@root/payload-types.js'

import classes from './index.module.scss'
import { MediaStack } from '@components/MediaStack'

export const ThreeHero: React.FC<
  Pick<
    Page['hero'],
    | 'richText'
    | 'images'
    | 'buttons'
    | 'description'
    | 'theme'
    | 'enableAnnouncement'
    | 'announcementLink'
  > & {
    breadcrumbs?: Page['breadcrumbs']
    firstContentBlock?: BlocksProp
  }
> = ({ richText, buttons, theme, breadcrumbs, images, enableAnnouncement, announcementLink }) => {
  const hasBreadcrumbs = Array.isArray(breadcrumbs) && breadcrumbs.length > 0
  return (
    <>
      <BlockWrapper
        settings={{ theme }}
        className={[classes.blockWrapper, hasBreadcrumbs ? classes.hasBreadcrumbs : ''].join(' ')}
        padding={{ top: 'hero', bottom: 'large' }}
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
                content={richText}
                className={[classes.richText].filter(Boolean).join(' ')}
              />

              <div className={classes.linksWrapper}>
                {Array.isArray(buttons) &&
                  buttons.map((button, i) => {
                    if (button.blockType === 'command') {
                      return (
                        <CreatePayloadApp
                          key={i + button.command}
                          label={button.command}
                          background={false}
                          className={classes.createPayloadApp}
                        />
                      )
                    }
                    if (button.blockType === 'link' && button.link) {
                      return (
                        <CMSLink
                          key={i + button.link.label}
                          {...button.link}
                          className={classes.link}
                          appearance="default"
                          buttonProps={{
                            hideBorders: true,
                          }}
                        />
                      )
                    }
                  })}
              </div>
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
