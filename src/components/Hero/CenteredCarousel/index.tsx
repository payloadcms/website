'use client'

import Marquee from 'react-fast-marquee'

import { Button } from '@components/Button'
import { CopyToClipboard } from '@components/CopyToClipboard'
import { Gutter } from '@components/Gutter'
import { Label } from '@components/Label'
import { Media } from '@components/Media'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export const CenteredCarouselHero: React.FC<Page['hero']> = ({
  commandLine,
  richText,
  links,
  logoGroup,
  carousel,
}) => {
  return (
    <div className={classes.centeredCarouselHero}>
      <Gutter>
        <div className={classes.wrap}>
          {commandLine && (
            <div className={classes.commandLine}>
              {commandLine?.command} <CopyToClipboard value={commandLine?.command ?? ''} />
            </div>
          )}
          <RichText className={classes.richText} content={richText} />
          {Array.isArray(links) && (
            <ul className={classes.actions}>
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <Button {...link} appearance={link.appearance} />
                  </li>
                )
              })}
            </ul>
          )}
          <div className={classes.logoGroup}>
            <Label>{logoGroup?.label}</Label>
            {Array.isArray(logoGroup?.logos) && (
              <ul className={classes.logos}>
                {logoGroup?.logos.map(({ logo }, i) => {
                  return (
                    typeof logo !== 'string' && (
                      <li key={i}>
                        <Media resource={logo} />
                      </li>
                    )
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </Gutter>
      <div className={classes.carousel}>
        {Array.isArray(carousel) && (
          <Marquee className={classes.slides} speed={35} style={{ overflowY: 'visible' }}>
            {carousel.map((slide, i) => {
              return typeof slide.image !== 'string' && <Media key={i} resource={slide.image} />
            })}
          </Marquee>
        )}
      </div>
    </div>
  )
}
