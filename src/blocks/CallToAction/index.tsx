import React, { Fragment } from 'react'
import { ArrowIcon } from '@icons/ArrowIcon'

import { BlockSpacing } from '@components/BlockSpacing'
import { CMSLink } from '@components/CMSLink'
import CreatePayloadApp from '@components/CreatePayloadApp'
import { Gutter } from '@components/Gutter'
import { Label } from '@components/Label'
import { PixelBackground } from '@components/PixelBackground'
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
        <div data-theme="dark">
          <div className={classes.bgWrapper}>
            <Gutter disableMobile className={classes.bgGutter}>
              <div className={classes.bg1}>
                {/* <div className={classes.pixelBG}>
              <PixelBackground />
            </div> */}
              </div>
            </Gutter>
          </div>
          <div className={[classes.contentWrap, 'grid'].filter(Boolean).join(' ')}>
            <div className={'cols-8 cols-m-8'}>
              <RichText content={richText} className={classes.content} />
            </div>
            <div className={'cols-7 start-11 start-l-10 cols-m-8 start-m-1'}>
              {feature === 'cpa' && (
                <Fragment>
                  <Label className={classes.label}>Get started in one line</Label>
                  <CreatePayloadApp background={false} className={classes.cpa} />
                </Fragment>
              )}
              {hasLinks && (
                <div className={classes.links}>
                  <PixelBackground className={classes.pixelBG} />
                  {links.map(({ link }, index) => (
                    <CMSLink {...link} key={index} className={classes.button}>
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
