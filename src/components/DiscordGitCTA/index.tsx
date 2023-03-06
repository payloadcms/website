import React from 'react'
import Link from 'next/link'
import GitHubButton from 'react-github-btn'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { PixelBackground } from '@components/PixelBackground'

import classes from './index.module.scss'

const gitURL = 'https://github.com/payloadcms'

const discordURL = 'https://discord.gg/FSn5QRdsbC'

const DiscordGitCTA: React.FC = () => {
  return (
    <div className={classes.container}>
      <div className={classes.ctaWrap}>
        <button onClick={() => window.open(gitURL, '_blank')} className={classes.cta}>
          <div className={classes.message}>
            Like what we're doing?
            <br />
            Star us on GitHub!
          </div>
          <div className={classes.gitButton}>
            <GitHubButton
              href="https://github.com/payloadcms/payload"
              data-color-scheme="dark"
              data-icon="octicon-star"
              data-size="large"
              data-show-count="true"
              aria-label="Star Payload on GitHub"
            >
              Star
            </GitHubButton>
            <ArrowIcon className={classes.arrow} />
          </div>
        </button>

        <button
          onClick={() => window.open(discordURL, '_blank')}
          aria-label="Connect with the Payload Community on Discord"
          className={classes.cta}
        >
          <div className={classes.message}>Connect with the Payload Community on Discord</div>
          <div className={classes.discordButton}>
            <img
              alt="Discord"
              src="https://img.shields.io/discord/967097582721572934?label=Discord&color=5865F2&style=flat-square"
            />
            <ArrowIcon className={classes.arrow} />
          </div>
        </button>

        <div className={classes.enterpriseCTA}>
          <strong>Can&apos;t find what you&apos;re looking for?</strong>
          <br />
          Get help straight from the Payload team with an Enterprise License.
          <Link className={classes.button} href="/for-enterprise">
            Learn More
            <ArrowIcon />
          </Link>
        </div>

        <PixelBackground className={classes.bg} />
      </div>
    </div>
  )
}

export default DiscordGitCTA
