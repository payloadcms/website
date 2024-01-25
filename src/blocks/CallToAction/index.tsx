import React, { Fragment } from 'react'
import { ArrowIcon } from '@icons/ArrowIcon'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BackgroundScanline } from '@components/BackgroundScanline'
import { BlockSpacing } from '@components/BlockSpacing'
import { CMSLink } from '@components/CMSLink'
import CreatePayloadApp from '@components/CreatePayloadApp'
import { Gutter } from '@components/Gutter'
import { Label } from '@components/Label'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type CallToActionProps = Extract<Page['layout'][0], { blockType: 'cta' }>

export const CallToAction: React.FC<CallToActionProps> = props => {
  const {
    ctaFields: { richText, feature, links },
  } = props

  const hasLinks = links && links.length > 0

  return (
    <BlockSpacing>
      <Gutter className={classes.callToAction}>
        <div className={[classes.wrapper].filter(Boolean).join(' ')}>
          <BackgroundGrid ignoreGutter />
          <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
            <div className={[classes.contentWrapper, 'cols-7 cols-m-8'].filter(Boolean).join(' ')}>
              <RichText content={richText} className={classes.content} />
            </div>
            <div
              className={[classes.linksContainer, 'cols-8 start-9 cols-m-8 start-m-1 grid']
                .filter(Boolean)
                .join(' ')}
            >
              <BackgroundScanline
                className={[classes.scanline, 'cols-16 start-4 start-l-3 cols-m-8 start-m-1']
                  .filter(Boolean)
                  .join(' ')}
              />
              {/* Double printing the BackgroundGrid component here so that it displays above the scanline */}
              <BackgroundGrid ignoreGutter />
              {feature === 'cpa' && (
                <Fragment>
                  <Label className={classes.label}>Get started in one line</Label>
                  <CreatePayloadApp background={false} className={classes.cpa} />
                </Fragment>
              )}
              {hasLinks && (
                <div className={[classes.links, 'cols-16 cols-m-8'].filter(Boolean).join(' ')}>
                  {links.map(({ link }, index) => (
                    <CMSLink
                      {...link}
                      key={index}
                      appearance={'default'}
                      buttonProps={{
                        appearance: 'default',
                        hideBorders: true,
                      }}
                      className={[classes.button].filter(Boolean).join(' ')}
                    >
                      <ArrowIcon className={classes.buttonIcon} />
                    </CMSLink>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Gutter>
    </BlockSpacing>
  )
}
