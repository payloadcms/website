import BackgroundGradient from '@components/BackgroundGradient'
import { BackgroundGrid } from '@components/BackgroundGrid'
import BigThree from '@components/BigThree'
import { BlockWrapper } from '@components/BlockWrapper'
import { CMSLink } from '@components/CMSLink'
import CreatePayloadApp from '@components/CreatePayloadApp'
import { Gutter } from '@components/Gutter'
import { BlocksProp } from '@components/RenderBlocks'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export const ThreeHero: React.FC<
  Pick<Page['hero'], 'richText' | 'media' | 'buttons' | 'description' | 'theme'> & {
    breadcrumbs?: Page['breadcrumbs']
    firstContentBlock?: BlocksProp
  }
> = ({ richText, buttons, theme, firstContentBlock }) => {
  return (
    <>
      <BlockWrapper settings={{ theme }} className={classes.blockWrapper}>
        <BackgroundGrid zIndex={1} />
        <Gutter>
          <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
            <div className={[classes.sidebar, 'cols-4 cols-m-8 start-1'].filter(Boolean).join(' ')}>
              <RichText
                content={richText}
                className={[classes.richText].filter(Boolean).join(' ')}
              />

              <div className={classes.linksWrapper}>
                {Array.isArray(buttons) &&
                  buttons.map((button, i) => {
                    if (button.blockType === 'command') {
                      return (
                        <CreatePayloadApp
                          key={i + button.command}
                          label={button.command}
                          background={false}
                          className={classes.createPayloadApp}
                        />
                      )
                    }
                    if (button.blockType === 'link' && button.link) {
                      return (
                        <CMSLink
                          key={i + button.link.label}
                          {...button.link}
                          className={classes.link}
                          appearance="default"
                          buttonProps={{
                            hideBorders: true,
                          }}
                        />
                      )
                    }
                  })}
              </div>
            </div>
            <div className={[classes.graphicWrapper, 'cols-8 start-8'].join(' ')}>
              <BigThree />
            </div>
          </div>
        </Gutter>
      </BlockWrapper>
      <BackgroundGradient className={classes.backgroundGradient} />
    </>
  )
}
