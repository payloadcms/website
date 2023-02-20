import React from 'react'
import Link from 'next/link'
import GitHubButton from 'react-github-btn'
import { useTheme } from '@providers/Theme'
import { ArrowIcon } from '@root/icons/ArrowIcon'

import classes from './index.module.scss'

const gitURL = 'https://github.com/payloadcms'

const discordURL = 'https://discord.gg/FSn5QRdsbC'

const DiscordGitCTA: React.FC = () => {
  const theme = useTheme()

  return (
    <div className={classes.wrapper}>
      <div className={classes.cta}>
        <div className={classes.message}>
          Like what we're doing?
          <br />
          Star us on GitHub!
        </div>
        <div className={classes.gitButton}>
          <GitHubButton
            href="https://github.com/payloadcms/payload"
            data-color-scheme={theme}
            data-icon="octicon-star"
            data-size="large"
            data-show-count="true"
            aria-label="Star Payload on GitHub"
          >
            Star
          </GitHubButton>
        </div>
        <Link href={gitURL} className={classes.arrow}>
          <ArrowIcon />
        </Link>
      </div>

      <div className={classes.cta}>
        <div className={classes.message}>
          Connect with the
          <br />
          Payload Community
        </div>
        <img
          alt="Discord"
          className={classes.discordButton}
          src="https://img.shields.io/discord/967097582721572934?label=Discord&color=5865F2&style=flat-square"
        />
        <Link href={discordURL} className={classes.arrow}>
          <ArrowIcon />
        </Link>
      </div>
    </div>
  )
}

export default DiscordGitCTA
