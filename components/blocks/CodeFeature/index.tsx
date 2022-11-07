import React from 'react'
import { Page } from '@root/payload-types'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Code from '@components/Code'
import { Label } from '@components/Label'
import { PixelBackground } from '@components/PixelBackground'
import { CMSLink } from '@components/CMSLink'
import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'codeFeature' }>

export const CodeFeature: React.FC<Props> = ({ codeFeatureFields }) => {
  const { heading, richText, enableLink, link, code, label } = codeFeatureFields

  return (
    <div className={classes.codeFeature}>
      <Gutter>
        <Grid className={classes.grid}>
          <Cell cols={6} colsM={8}>
            <h2 className={classes.heading}>{heading}</h2>
            <Grid>
              <Cell cols={4} start={2} colsM={8} startM={1}>
                <RichText content={richText} className={classes.richText} />
                {enableLink && <CMSLink {...link} />}
              </Cell>
            </Grid>
          </Cell>
          <Cell cols={6} colsM={8} className={classes.code}>
            <div className={classes.code}>
              {label && (
                <div className={classes.labelWrap}>
                  <Label className={classes.label}>{label}</Label>
                </div>
              )}
              <Code>{code}</Code>
            </div>

            <Grid className={[classes.mobile, classes.pixelGrid].filter(Boolean).join(' ')}>
              <Cell className={classes.pixelCell} startM={5} colsM={5}>
                <PixelBackground className={classes.pixels} />
              </Cell>
            </Grid>
          </Cell>
        </Grid>

        <Grid className={[classes.desktop, classes.pixelGrid].filter(Boolean).join(' ')}>
          <Cell className={classes.pixelCell} cols={5} start={8}>
            <PixelBackground className={classes.pixels} />
          </Cell>
        </Grid>
      </Gutter>
    </div>
  )
}
