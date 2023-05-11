'use client'

import React from 'react'
import Marquee from 'react-fast-marquee'
import { ThemeProvider } from '@providers/Theme'
import Image from 'next/image'

import { CMSLink } from '@components/CMSLink'
import CreatePayloadApp from '@components/CreatePayloadApp'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export const HomeHero: React.FC<Page['hero']> = ({
  richText,
  adjectives,
  actions,
  // buttons,
  media,
}) => {
  return (
    <div className={classes.homeHero}>
      <ThemeProvider theme="dark" className={classes.wrap} affectsHeader>
        <div className={classes.bg}>
          <Marquee gradient={false}>
            <div className={classes.bgImage}>
              <Image
                priority
                src="/images/home-bg.png"
                fill
                alt="Screenshots of Payload"
                sizes="191vh" // aspect ratio of png, translates to 100vh
              />
            </div>
          </Marquee>
        </div>
        <div className={classes.contentWrap}>
          <Gutter>
            <div className={classes.content}>
              <RichText className={classes.richText} content={richText} />
              <div className={classes.sidebar}>
                {Array.isArray(actions) && (
                  <ul className={classes.actions}>
                    {actions.map(({ link }, i) => {
                      return (
                        <li key={i}>
                          <CMSLink {...link} appearance="default" fullWidth />
                        </li>
                      )
                    })}
                  </ul>
                )}
                <CreatePayloadApp />
                {/* Not going to render buttons until Payload Cloud */}
                {/* {Array.isArray(buttons) && (
                    <ul className={classes.buttons}>
                      {buttons.map(({ link }, i) => {
                        return (
                          <li key={i}>
                            <CMSLink {...link} />
                          </li>
                        )
                      })}
                    </ul>
                  )} */}
              </div>
            </div>
            <hr />
          </Gutter>
          {Array.isArray(adjectives) && (
            <Marquee gradient={false} speed={70} className={classes.adjectives}>
              {adjectives.map(({ adjective }, i) => (
                <span key={i} className={classes.adjective}>
                  {adjective}
                </span>
              ))}
            </Marquee>
          )}
          {typeof media === 'object' && media !== null && (
            <Gutter>
              <div className={classes.padForMedia} />
            </Gutter>
          )}
        </div>
      </ThemeProvider>

      {typeof media === 'object' && media !== null && (
        <Gutter className={classes.mediaGutter}>
          <Media resource={media} className={classes.media} />
        </Gutter>
      )}
    </div>
  )
}
