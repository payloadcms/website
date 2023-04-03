import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Link from 'next/link'

import { Avatar } from '@components/Avatar'
import { Gutter } from '@components/Gutter'
import { DiscordIcon } from '@root/graphics/DiscordIcon'
import { MainMenu } from '@root/payload-types'
import { useAuth } from '@root/providers/Auth'
import { FullLogo } from '../../../graphics/FullLogo'
import { CMSLink } from '../../CMSLink'
import { DocSearch } from '../Docsearch'

import classes from './index.module.scss'

export const DesktopNav: React.FC<Pick<MainMenu, 'navItems'>> = ({ navItems }) => {
  const { user } = useAuth()

  return (
    <Gutter className={classes.desktopNav}>
      <Grid className={classes.grid}>
        <Cell className={classes.content}>
          <Link href="/" className={classes.logo}>
            <FullLogo />
          </Link>
          <div className={classes.navItems}>
            {(navItems || []).map((item, index) => {
              return <CMSLink className={classes.navItem} key={index} {...item.link} />
            })}
          </div>
          <div className={classes.secondaryNavItems}>
            <Link href="/new">New project</Link>
            {user && (
              <div className={[classes.github, classes.githubLoggedIn].filter(Boolean).join(' ')}>
                <div className={classes.starsWrap}>
                  <a
                    id="github-star-count"
                    href="https://github.com/payloadcms/payload"
                    className={classes.payload}
                    target="_blank"
                  />
                  <iframe
                    className={classes.iframe}
                    src="https://ghbtns.com/github-btn.html?user=payloadcms&repo=payload&type=star&count=true"
                    frameBorder="0"
                    scrolling="0"
                    width="108"
                    height="20"
                    title="GitHub Stars"
                  />
                </div>
              </div>
            )}
            {user ? <Avatar className={classes.avatar} /> : <Link href="/login">Login</Link>}
            {!user && (
              <div className={[classes.github, classes.githubLoggedOut].filter(Boolean).join(' ')}>
                <div className={classes.starsWrap}>
                  <a
                    id="github-star-count"
                    href="https://github.com/payloadcms/payload"
                    className={classes.payload}
                    target="_blank"
                  />
                  <iframe
                    className={classes.iframe}
                    src="https://ghbtns.com/github-btn.html?user=payloadcms&repo=payload&type=star&count=true"
                    frameBorder="0"
                    scrolling="0"
                    width="108"
                    height="20"
                    title="GitHub Stars"
                  />
                </div>
              </div>
            )}
            <div className={classes.icons}>
              <a
                className={classes.discord}
                href="https://discord.com/invite/r6sCXqVk3v"
                target="_blank"
                rel="noreferrer"
              >
                <DiscordIcon />
              </a>
              <DocSearch />
            </div>
          </div>
        </Cell>
      </Grid>
    </Gutter>
  )
}
