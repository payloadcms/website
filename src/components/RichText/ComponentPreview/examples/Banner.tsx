import { Banner } from '@payloadcms/ui/elements/Banner'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

export const bannerExamples: ComponentExamples = {
  basic: {
    code: `<Banner>Changes saved successfully.</Banner>`,
    render: () => (
      <div className={classes.stack}>
        <Banner>Changes saved successfully.</Banner>
      </div>
    ),
  },
  variants: {
    code: `<Banner type="default">Default message</Banner>
<Banner type="success">Changes saved successfully.</Banner>
<Banner type="info">Additional context is available.</Banner>
<Banner type="error">Something went wrong.</Banner>`,
    render: () => (
      <div className={classes.stack}>
        <Banner type="default">Default message</Banner>
        <Banner type="success">Changes saved successfully.</Banner>
        <Banner type="info">Additional context is available.</Banner>
        <Banner type="error">Something went wrong.</Banner>
      </div>
    ),
  },
}
