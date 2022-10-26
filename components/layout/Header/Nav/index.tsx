import { Cell, Grid } from '@faceless-ui/css-grid'
import { MainMenu } from '../../../../payload-types'
import { GridWrap } from '../../GridWrap'
import { FullLogo } from '../../../graphics/FullLogo'
import { SearchIcon } from '../../../graphics/SearchIcon'
import { DiscordIcon } from '../../../graphics/DiscordIcon'
import { CMSLink } from '../../../elements/CMSLink'
import { Button } from '../../../elements/Button'

import classes from './styles.module.scss'

export const Nav: React.FC<Pick<MainMenu, 'navItems'>> = ({ navItems }) => {
  return (
    <div className={classes.nav}>
      <GridWrap className={classes.container}>
        <div className={classes.logo}>
          <FullLogo />
        </div>
        <Grid>
          <Cell className={classes.content}>
            <div className={classes.navItems}>
              {(navItems || []).map((item, index) => {
                return <CMSLink className={classes.navItem} key={index} {...item.link} />
              })}
            </div>

            <div className={classes.github}>
              <div>Like what we’re doing? Star us on GitHub!</div>
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
          </Cell>
        </Grid>
        <div className={classes.icons}>
          <Button el="a" href="https://discord.com" newTab>
            <DiscordIcon />
          </Button>

          <SearchIcon />
        </div>
      </GridWrap>
    </div>
  )
}
