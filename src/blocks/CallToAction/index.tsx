import React, { Fragment } from 'react'
import { BlockSpacing } from '@components/BlockSpacing'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { CMSLink } from '@components/CMSLink'
import CreatePayloadApp from '@components/CreatePayloadApp'
import { Label } from '@components/Label'
import { PixelBackground } from '@components/PixelBackground'
import { ArrowIcon } from '@icons/ArrowIcon'
import { RichText } from '@components/RichText'
import { Gutter } from '@components/Gutter'
import { Page } from '@root/payload-types'
import { ThemeProvider } from '@root/providers/Theme'
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
        <ThemeProvider theme="dark">
          <div className={classes.bgWrapper}>
            <Gutter disableMobile className={classes.bgGutter}>
              <div className={classes.bg1}>
                {/* <div className={classes.pixelBG}>
              <PixelBackground />
            </div> */}
              </div>
            </Gutter>
          </div>
          <Grid className={classes.content}>
            <Cell cols={6} colsM={8}>
              <RichText content={richText} />
            </Cell>
            <Cell cols={5} start={8} colsM={8} startM={1}>
              {feature === 'cpa' && (
                <Fragment>
                  <Label>Get started in one line</Label>
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
            </Cell>
          </Grid>
        </ThemeProvider>
      </Gutter>
    </BlockSpacing>
  )
}
