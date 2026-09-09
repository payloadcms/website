import { Hamburger } from '@payloadcms/ui/elements/Hamburger'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

export const hamburgerExamples: ComponentExamples = {
  states: {
    code: `<Hamburger />
<Hamburger isActive />
<Hamburger closeIcon="collapse" isActive />`,
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
