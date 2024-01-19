'use client'

import * as React from 'react'

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
          <div className={[classes.bg2Grid, 'grid'].filter(Boolean).join(' ')}>
            <div
              className={[classes.bg2Cell, 'cols-8 start-9 cols-m-7 start-m-2']
                .filter(Boolean)
                .join(' ')}
            >
              <div
                className={[classes.bg2, container && classes.containerize]
                  .filter(Boolean)
                  .join(' ')}
              />
            </div>
          </div>
        </Gutter>
      </div>
      <Gutter className={classes.gutter}>
        <div className={[classes.richTextGrid, 'grid'].filter(Boolean).join(' ')}>
          <div
            className={[classes.richTextCell, 'cols-8 cols-m-8 start-m-1']
              .filter(Boolean)
              .join(' ')}
          >
            {richText && <RichText content={richText} />}
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
    </BlockSpacing>
  )
}

export const FormBlock: React.FC<FormBlockProps> = props => {
  const { formFields: { container } = {} } = props

  if (container) {
    return (
      <div data-theme="dark">
        <Content {...props} />
      </div>
    )
  }

  return <Content {...props} />
}
