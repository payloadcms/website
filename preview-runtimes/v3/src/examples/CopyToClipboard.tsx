import { CopyToClipboard } from '@payloadcms/ui/elements/CopyToClipboard'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

export const copyToClipboardExamples: ComponentExamples = {
  basic: {
    code: `<span>post_123456789</span>
<CopyToClipboard defaultMessage="Copy ID" successMessage="ID copied" value="post_123456789" />`,
    render: () => (
      <div className={classes.copyDemo}>
        <code>post_123456789</code>
        <CopyToClipboard
          defaultMessage="Copy ID"
          successMessage="ID copied"
          value="post_123456789"
        />
      </div>
    ),
  },
}
