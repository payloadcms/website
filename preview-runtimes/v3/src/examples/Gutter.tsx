import { Gutter } from '@payloadcms/ui/elements/Gutter'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'

export const gutterExamples: ComponentRenders = {
  basic: {
    render: () => (
      <div className={classes.gutterFrame}>
        <Gutter>
          <div className={classes.gutterContent}>Content aligned to the Admin Panel gutter</div>
        </Gutter>
      </div>
    ),
  },
}
