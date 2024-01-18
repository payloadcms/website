import React from 'react'

import { CMSLink } from '@components/CMSLink'
import Code from '@components/Code'
import { Gutter } from '@components/Gutter'
import { Label } from '@components/Label'
import { PixelBackground } from '@components/PixelBackground'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'codeFeature' }>

export const CodeFeature: React.FC<Props> = ({ codeFeatureFields }) => {
  const { heading, richText, enableLink, link, code, label, disableBlockSpacing, disableIndent } =
    codeFeatureFields

  let Spacer: React.ComponentType | 'div' = React.Fragment

  const spacerProps: { className?: string } = {}

  if (!disableBlockSpacing) {
    Spacer = 'div'
    spacerProps.className = classes.blockSpacing
  }

  return (
    <div className={classes.codeFeature}>
      <Spacer {...spacerProps}>
        <Gutter>
          <div className={[classes.codeFeatureGrid, 'grid'].filter(Boolean).join(' ')}>
            <div className={'cols-8 cols-m-8'}>
              <h2 className={classes.heading}>{heading}</h2>
              <div className={[classes.innerCodeFeatureGrid, 'grid'].filter(Boolean).join(' ')}>
                <div className={`cols-6 start-${disableIndent ? 1 : 2} cols-m-8 start-m-1`}>
                  <RichText content={richText} className={classes.richText} />
                  {enableLink && <CMSLink {...link} />}
                </div>
              </div>
            </div>
            <div className={[classes.code, 'cols-8 cols-m-8'].filter(Boolean).join(' ')}>
              <div className={classes.code}>
                {label && (
                  <div className={classes.labelWrap}>
                    <Label className={classes.label}>{label}</Label>
                  </div>
                )}
                <Code>{`${code}
              `}</Code>
              </div>

              <div
                className={[classes.mobile, classes.pixelGrid, 'grid'].filter(Boolean).join(' ')}
              >
                <div
                  className={[classes.pixelCell, 'cols-16 start-m-7 cols-m-7']
                    .filter(Boolean)
                    .join(' ')}
                >
                  <PixelBackground className={classes.pixels} />
                </div>
              </div>
            </div>
          </div>

          <div className={[classes.desktop, classes.pixelGrid, 'grid'].filter(Boolean).join(' ')}>
            <div
              className={[classes.pixelCell, 'cols-7 start-10 start-m-5'].filter(Boolean).join(' ')}
            >
              <PixelBackground className={classes.pixels} />
            </div>
          </div>
        </Gutter>
      </Spacer>
    </div>
  )
}
