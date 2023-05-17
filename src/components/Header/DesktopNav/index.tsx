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
          <Link href="/" className={classes.logo} prefetch={false} aria-label="Full Payload Logo">
            <FullLogo />
          </Link>

          <div className={classes.navItems}>
            {(navItems || []).map((item, index) => {
              return <CMSLink className={classes.navItem} key={index} {...item.link} />
            })}
          </div>

          <div className={classes.secondaryNavItems}>
            <Link href="/new" prefetch={false}>
              New project
            </Link>

            {user ? (
              <Avatar className={classes.avatar} />
            ) : (
              <Link prefetch={false} href="/login">
                Login
              </Link>
            )}

            <div className={classes.icons}>
              <a
                className={classes.discord}
                href="https://discord.com/invite/r6sCXqVk3v"
                target="_blank"
                rel="noreferrer"
                aria-label="Payload's Discord"
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
