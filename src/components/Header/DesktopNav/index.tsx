import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Link from 'next/link'

import { Avatar } from '@components/Avatar'
import { Gutter } from '@components/Gutter'
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
<<<<<<< HEAD
          <React.Fragment>
            <div className={classes.github}>
              <div className={classes.githubText}>Like what we’re doing? Star us on GitHub!</div>
=======

          <div className={classes.github}>
            <div className={classes.githubText}>Like what we’re doing? Star us on GitHub!</div>
            <div className={classes.starsWrap}>
              <a
                id="github-star-count"
                href="https://github.com/payloadcms/payload"
                className={classes.payload}
                target="_blank"
              ></a>
>>>>>>> main
              <iframe
                className={classes.stars}
                src="https://ghbtns.com/github-btn.html?user=payloadcms&repo=payload&type=star&count=true"
                frameBorder="0"
                scrolling="0"
                width="108"
                height="20"
                title="GitHub Stars"
              />
            </div>
<<<<<<< HEAD
            <div className={classes.icons}>
              <Link href="/new">New project</Link>
              {user && <Avatar />}
              <DocSearch />
            </div>
          </React.Fragment>
=======
          </div>

          <div className={classes.icons}>
            <a href="https://discord.com/invite/r6sCXqVk3v" target="_blank" rel="noreferrer">
              <DiscordIcon />
            </a>
            <DocSearch />
          </div>
>>>>>>> main
        </Cell>
      </Grid>
    </Gutter>
  )
}
