import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Link from 'next/link'

import { Avatar } from '@components/Avatar'
import { Button } from '@components/Button'
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
          {!user && (
            <React.Fragment>
              <div className={classes.github}>
                <div className={classes.githubText}>Like what we’re doing? Star us on GitHub!</div>
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
              <div className={classes.icons}>
                <Link href="/login">Log in</Link>
                <DocSearch />
              </div>
            </React.Fragment>
          )}
          {user && (
            <div className={classes.authNav}>
              <Button label="New project" appearance="primary" href="/new" size="small" el="link" />
              <Avatar />
              <DocSearch />
            </div>
          )}
        </Cell>
      </Grid>
    </Gutter>
  )
}
