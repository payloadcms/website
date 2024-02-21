import React from 'react'
import Link from 'next/link'

import { DiscordUsersPill } from '@components/DiscordUsersPill'
import { GithubStarsPill } from '@components/GithubStarsPill'
import { PixelBackground } from '@components/PixelBackground'
import { ArrowIcon } from '@root/icons/ArrowIcon'

import classes from './index.module.scss'

const gitURL = 'https://github.com/payloadcms/payload'

const discordURL = 'https://discord.gg/FSn5QRdsbC'

const DiscordGitCTA: React.FC<{ style?: 'minimal' | 'default' }> = ({ style }) => {
  if (style === 'default')
    return (
      <div className={classes.container}>
        <div className={classes.ctaWrap}>
          <Link href={gitURL} target="_blank" className={classes.cta}>
            <div className={classes.message}>
              Like what we're doing?
              <br />
              Star us on GitHub!
            </div>
            <div className={classes.gitButton}>
              <GithubStarsPill className={classes.ctaPill} />
              <ArrowIcon className={classes.arrow} />
            </div>
          </Link>

          <Link
            href={discordURL}
            target="_blank"
            aria-label="Connect with the Payload Community on Discord"
            className={classes.cta}
          >
            <div className={classes.message}>Connect with the Payload Community on Discord</div>
            <div className={classes.discordButton}>
              <DiscordUsersPill className={classes.ctaPill} />
              <ArrowIcon className={classes.arrow} />
            </div>
          </Link>

          <div className={classes.enterpriseCTA}>
            <strong>Can&apos;t find what you&apos;re looking for?</strong>
            <br />
            <p className={classes.license}>
              Get help straight from the Payload team with an{' '}
              <Link className={classes.button} href="/for-enterprise" prefetch={false}>
                Enterprise License
              </Link>
              .
            </p>
          </div>
          <PixelBackground className={classes.bg} />
        </div>
      </div>
    )
  if (style === 'minimal')
    return (
      <div className={classes.minimal}>
        <Link href={gitURL} target="_blank" className={classes.cta}>
          <div className={classes.message}>
            Star on GitHub
            <ArrowIcon className={classes.arrow} />
          </div>
          <div className={classes.gitButton}>
            <GithubStarsPill className={classes.ctaPill} />
          </div>
        </Link>

        <Link
          href={discordURL}
          target="_blank"
          aria-label="Chat on Discord"
          className={classes.cta}
        >
          <div className={classes.message}>
            Chat on Discord
            <ArrowIcon className={classes.arrow} />
          </div>
          <div className={classes.discordButton}>
            <DiscordUsersPill className={classes.ctaPill} />
          </div>
        </Link>
      </div>
    )
}

export default DiscordGitCTA
