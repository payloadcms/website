import { Cell, Grid } from '@faceless-ui/css-grid'
import { MainMenu } from '../../../../payload-types'
import { GridWrap } from '../../GridWrap'
import { FullLogo } from '../../../graphics/FullLogo'

import classes from './styles.module.scss'
import { Hyperlink } from '../../../elements/Hyperlink'
import { SearchIcon } from '../../../graphics/SearchIcon'
import { DiscordIcon } from '../../../graphics/DiscordIcon'

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
              {navItems.map((item, index) => {
                return (
                  <Hyperlink className={classes.navItem} key={index} linkFromCMS={item.link}>
                    {item.link.label}
                  </Hyperlink>
                )
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
          <SearchIcon />

          <DiscordIcon />
        </div>
      </GridWrap>
    </div>
  )
}
