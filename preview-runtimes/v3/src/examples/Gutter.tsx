import { Gutter } from '@payloadcms/ui/elements/Gutter'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

export const gutterExamples: ComponentExamples = {
  basic: {
    code: `<Gutter>
  <div>Content aligned to the Admin Panel gutter</div>
</Gutter>`,
    render: () => (
      <div className={classes.gutterFrame}>
        <Gutter>
          <div className={classes.gutterContent}>Content aligned to the Admin Panel gutter</div>
        </Gutter>
      </div>
    ),
  },
}
