import { Hamburger } from '@payloadcms/ui/elements/Hamburger'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'

export const hamburgerExamples: ComponentRenders = {
  states: {
    render: () => (
      <div className={classes.iconStates}>
        <div className={classes.iconState}>
          <Hamburger />
          <span>Closed</span>
        </div>
        <div className={classes.iconState}>
          <Hamburger isActive />
          <span>Open</span>
        </div>
        <div className={classes.iconState}>
          <Hamburger closeIcon="collapse" isActive />
          <span>Collapse</span>
        </div>
      </div>
    ),
  },
}
