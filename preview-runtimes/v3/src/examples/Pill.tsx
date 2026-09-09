import { Pill } from '@payloadcms/ui/elements/Pill'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

export const pillExamples: ComponentExamples = {
  shapes: {
    code: `<Pill>Default</Pill>
<Pill rounded>Rounded</Pill>`,
    render: () => (
      <div className={classes.row}>
        <Pill>Default</Pill>
        <Pill rounded>Rounded</Pill>
      </div>
    ),
  },
  sizes: {
    code: `<Pill size="small">Small</Pill>
<Pill size="medium">Medium</Pill>`,
    render: () => (
      <div className={classes.row}>
        <Pill size="small">Small</Pill>
        <Pill size="medium">Medium</Pill>
      </div>
    ),
  },
  styles: {
    code: `<Pill>Default</Pill>
<Pill pillStyle="dark">Dark</Pill>
<Pill pillStyle="success">Success</Pill>
<Pill pillStyle="warning">Warning</Pill>
<Pill pillStyle="error">Error</Pill>`,
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
