'use client'

import { RichText } from '@components/RichText'
import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Gutter } from '@components/Gutter'
import { ThemeProvider, useTheme } from '@components/providers/Theme'
import { CMSForm } from '@components/CMSForm'
import { Page } from '@root/payload-types'
import { PixelBackground } from '@components/PixelBackground'
import { CheckmarkIcon } from '@components/graphics/CheckmarkIcon'
import classes from './index.module.scss'

export const FormHero: React.FC<
  Page['hero'] & {
    pageTitle: string
  }
> = props => {
  const { pageTitle, richText, form } = props

  const theme = useTheme()

  return (
    <div className={classes.formHero}>
      <ThemeProvider theme={theme === 'dark' ? 'light' : 'dark'}>
        <div className={classes.bgWrapper}>
          <Gutter left="half" right="half" disableMobile className={classes.bgGutter}>
            <div className={classes.bg1}>
              <PixelBackground className={classes.pixelBG} />
            </div>
          </Gutter>
        </div>
        <div className={classes.bg2Wrapper}>
          <Gutter className={classes.bgGutter}>
            <Grid className={classes.bg2Grid}>
              <Cell start={7} cols={6} startM={2} colsM={7} className={classes.bg2Cell}>
                <div className={classes.bg2} />
              </Cell>
            </Grid>
          </Gutter>
        </div>
        <Gutter className={classes.gutter}>
          <Grid>
            <Cell cols={5} startL={2} colsM={8} startM={1} className={classes.richTextCell}>
              {pageTitle && <div className={classes.leader}>{pageTitle}</div>}
              {richText && (
                <RichText
                  className={classes.richText}
                  content={richText}
                  customRenderers={{
                    li: ({ node: { children }, Serialize, index }) => {
                      return (
                        <li key={`list-item-${index}`} className={classes.li}>
                          <div className={classes.bullet}>
                            <CheckmarkIcon />
                          </div>
                          <Serialize content={children} />
                        </li>
                      )
                    },
                  }}
                />
              )}
            </Cell>
            <Cell cols={6} start={8} colsL={4} colsM={8} startM={1} className={classes.formCell}>
              <div className={classes.formCellContent}>
                <CMSForm form={form} />
              </div>
            </Cell>
          </Grid>
        </Gutter>
      </ThemeProvider>
    </div>
  )
}
