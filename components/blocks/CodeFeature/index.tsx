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
  const { richText, enableLink, link, code, label } = codeFeatureFields

  return (
    <div className={classes.codeFeature}>
      <Gutter>
        <Grid className={classes.grid}>
          <Cell cols={6}>
            <RichText content={richText} />
            {enableLink && <CMSLink {...link} />}
          </Cell>
          <Cell cols={6} className={classes.code}>
            <PixelBackground className={classes.pixels} />
            {label && (
              <div className={classes.labelWrap}>
                <Label className={classes.label}>{label}</Label>
              </div>
            )}
            <Code>{code}</Code>
          </Cell>
        </Grid>
      </Gutter>
    </div>
  )
}
