import { Collapsible } from '@payloadcms/ui/elements/Collapsible'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'

export const collapsibleExamples: ComponentRenders = {
  basic: {
    render: () => (
      <div className={classes.collapsibleDemo}>
        <Collapsible header="Collapsible header">Collapsible content</Collapsible>
      </div>
    ),
  },
  error: {
    render: () => (
      <div className={classes.collapsibleDemo}>
        <Collapsible collapsibleStyle="error" header="Collapsible header">
          Correct the invalid fields in this section.
        </Collapsible>
      </div>
    ),
  },
}
