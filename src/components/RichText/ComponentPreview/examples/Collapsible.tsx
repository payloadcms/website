import { Collapsible } from '@payloadcms/ui/elements/Collapsible'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

export const collapsibleExamples: ComponentExamples = {
  basic: {
    code: `<Collapsible header="Collapsible header">
  Collapsible content
</Collapsible>`,
    render: () => (
      <div className={classes.collapsibleDemo}>
        <Collapsible header="Collapsible header">Collapsible content</Collapsible>
      </div>
    ),
  },
  error: {
    code: `<Collapsible collapsibleStyle="error" header="Collapsible header">
  Correct the invalid fields in this section.
</Collapsible>`,
    render: () => (
      <div className={classes.collapsibleDemo}>
        <Collapsible collapsibleStyle="error" header="Collapsible header">
          Correct the invalid fields in this section.
        </Collapsible>
      </div>
    ),
  },
}
