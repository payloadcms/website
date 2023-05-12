'use client'

import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { ThemeProvider, useTheme } from '@providers/Theme'

import { BlockSpacing } from '@components/BlockSpacing'
import { CMSForm } from '@components/CMSForm'
import { Gutter } from '@components/Gutter'
import { PixelBackground } from '@components/PixelBackground'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type FormBlockProps = Extract<Page['layout'][0], { blockType: 'form' }>

const Content: React.FC<FormBlockProps> = props => {
  const { formFields: { container, richText, form } = {} } = props

  const theme = useTheme()

  if (typeof form === 'string') return null

  return (
    <BlockSpacing className={classes.formBlock}>
      <div className={classes.bgWrapper}>
        <Gutter disableMobile className={classes.bgGutter}>
          <div
            className={[classes.bg1, container && classes.containerize].filter(Boolean).join(' ')}
          >
            <div className={classes.pixelBG}>
              <PixelBackground />
            </div>
          </div>
        </Gutter>
      </div>
      <div className={classes.bg2Wrapper}>
        <Gutter className={classes.bgGutter}>
          <Grid className={classes.bg2Grid}>
            <Cell start={7} cols={6} startM={2} colsM={7} className={classes.bg2Cell}>
              <div
                className={[
                  classes.bg2,
                  container && classes.containerize,
                  theme === 'dark' && classes.dark,
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            </Cell>
          </Grid>
        </Gutter>
      </div>
      <Gutter className={classes.gutter}>
        <Grid className={classes.richTextGrid}>
          <Cell cols={6} colsM={8} startM={1} className={classes.richTextCell}>
            {richText && <RichText content={richText} />}
          </Cell>
          <Cell cols={6} start={8} colsM={8} startM={1} className={classes.formCell}>
            <div className={classes.formCellContent}>
              <CMSForm form={form} />
            </div>
          </Cell>
        </Grid>
      </Gutter>
    </BlockSpacing>
  )
}

export const FormBlock: React.FC<FormBlockProps> = props => {
  const { formFields: { container } = {} } = props

  if (container) {
    return (
      <ThemeProvider theme="dark">
        <Content {...props} />
      </ThemeProvider>
    )
  }

  return <Content {...props} />
}
