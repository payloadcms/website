import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Link from 'next/link'
import { MainMenu } from '../../../payload-types'
import { FullLogo } from '../../graphics/FullLogo'
import { DiscordIcon } from '../../graphics/DiscordIcon'
import { CMSLink } from '../../CMSLink'
import { Gutter } from '../../Gutter'
import { DocSearch } from '../Docsearch'

import classes from './index.module.scss'

export const DesktopNav: React.FC<Pick<MainMenu, 'navItems'>> = ({ navItems }) => {
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

          <div className={classes.github}>
            <div className={classes.githubText}>Like what we’re doing? Star us on GitHub!</div>
            <iframe
              className={classes.stars}
              src="https://ghbtns.com/github-btn.html?user=payloadcms&repo=payload&type=star&count=true"
              frameBorder="0"
              scrolling="0"
              width="100"
              height="20"
              title="GitHub Stars"
            />
          </div>

          <div className={classes.icons}>
            <a href="https://discord.com" target="_blank" rel="noreferrer">
              <DiscordIcon />
            </a>
            <DocSearch />
          </div>
        </Cell>
      </Grid>
    </Gutter>
  )
}
