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
import { HeaderObserver } from '@components/HeaderObserver'
import classes from './index.module.scss'

export type FormHeroProps = Page['hero']

export const FormHero: React.FC<FormHeroProps> = props => {
  const { richText, form } = props
  const theme = useTheme()

  return (
    <HeaderObserver color={theme} pullUp>
      <ThemeProvider theme="dark">
        <div className={classes.formHero}>
          <div className={classes.bgWrapper}>
            <Gutter disableMobile className={classes.bgGutter}>
              <div className={classes.bg1}>
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
                  <div className={classes.bg2} />
                </Cell>
              </Grid>
            </Gutter>
          </div>
          <Gutter className={classes.gutter}>
            <Grid>
              <Cell cols={6} colsM={8} startM={1} className={classes.richTextCell}>
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
              <Cell cols={6} start={8} colsM={8} startM={1} className={classes.formCell}>
                <div className={classes.formCellContent}>
                  <CMSForm form={form} />
                </div>
              </Cell>
            </Grid>
          </Gutter>
        </div>
      </ThemeProvider>
    </HeaderObserver>
  )
}
