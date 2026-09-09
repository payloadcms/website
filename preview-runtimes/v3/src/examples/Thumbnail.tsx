import { Thumbnail } from '@payloadcms/ui/elements/Thumbnail'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

export const thumbnailExamples: ComponentExamples = {
  fallback: { code: `<Thumbnail size="medium" />`, render: () => <Thumbnail size="medium" /> },
  sizes: {
    code: `<Thumbnail size="small" />
<Thumbnail size="medium" />
<Thumbnail size="large" />`,
    render: () => (
      <div className={classes.row}>
        <Thumbnail size="small" />
        <Thumbnail size="medium" />
        <Thumbnail size="large" />
      </div>
    ),
  },
}
