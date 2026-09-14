import { Thumbnail } from '@payloadcms/ui/elements/Thumbnail'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'

export const thumbnailExamples: ComponentRenders = {
  fallback: { render: () => <Thumbnail size="medium" /> },
  sizes: {
    render: () => (
      <div className={classes.row}>
        <Thumbnail size="small" />
        <Thumbnail size="medium" />
        <Thumbnail size="large" />
      </div>
    ),
  },
}
