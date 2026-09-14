import { Pill } from '@payloadcms/ui/elements/Pill'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'

export const pillExamples: ComponentRenders = {
  shapes: {
    render: () => (
      <div className={classes.row}>
        <Pill>Default</Pill>
        <Pill rounded>Rounded</Pill>
      </div>
    ),
  },
  sizes: {
    render: () => (
      <div className={classes.row}>
        <Pill size="small">Small</Pill>
        <Pill size="medium">Medium</Pill>
      </div>
    ),
  },
  styles: {
    render: () => (
      <div className={classes.row}>
        <Pill>Default</Pill>
        <Pill pillStyle="dark">Dark</Pill>
        <Pill pillStyle="success">Success</Pill>
        <Pill pillStyle="warning">Warning</Pill>
        <Pill pillStyle="error">Error</Pill>
      </div>
    ),
  },
}
