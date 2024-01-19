'use client'

import * as React from 'react'

import { CMSForm } from '@components/CMSForm'
import { Gutter } from '@components/Gutter'
import { PixelBackground } from '@components/PixelBackground'
import { RichText } from '@components/RichText'
import { CheckIcon } from '@root/icons/CheckIcon'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type FormHeroProps = Page['hero']

export const FormHero: React.FC<FormHeroProps> = props => {
  const { richText, form } = props

  if (typeof form === 'string') return null

  return (
    <div data-theme="dark">
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
            <div className={[classes.bg2Grid, 'grid'].filter(Boolean).join(' ')}>
              <div
                className={[classes.bg2Cell, 'cols-8 start-9 cols-m-7 start-m-2']
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className={classes.bg2} />
              </div>
            </div>
          </Gutter>
        </div>
        <Gutter className={classes.gutter}>
          <div className={['grid'].filter(Boolean).join(' ')}>
            <div
              className={[classes.richTextCell, 'cols-8 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
            >
              {richText && (
                <RichText
                  className={classes.richText}
                  content={richText}
                  customRenderers={{
                    li: ({ node: { children }, Serialize, index }) => {
                      return (
                        <li key={`list-item-${index}`} className={classes.li}>
                          <div className={classes.bullet}>
                            <CheckIcon size="medium" bold />
                          </div>
                          <Serialize content={children} />
                        </li>
                      )
                    },
                  }}
                />
              )}
            </div>
            <div
              className={[classes.formCell, 'cols-8 start-10 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
            >
              <div className={classes.formCellContent}>
                <CMSForm form={form} />
              </div>
            </div>
          </div>
        </Gutter>
      </div>
    </div>
  )
}
