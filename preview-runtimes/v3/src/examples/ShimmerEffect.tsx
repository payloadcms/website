import { ShimmerEffect } from '@payloadcms/ui/elements/ShimmerEffect'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

export const shimmerEffectExamples: ComponentExamples = {
  basic: {
    code: `<ShimmerEffect height={60} width="100%" />`,
    render: () => (
      <div className={classes.componentWidth}>
        <ShimmerEffect height={60} width="100%" />
      </div>
    ),
  },
  shapes: {
    code: `<ShimmerEffect height={48} style={{ borderRadius: '50%' }} width={48} />
<ShimmerEffect height={16} width="75%" />
<ShimmerEffect height={16} width="50%" />`,
    render: () => (
      <div className={classes.skeletonLayout}>
        <ShimmerEffect height={48} style={{ borderRadius: '50%' }} width={48} />
        <div className={classes.skeletonLines}>
          <ShimmerEffect height={16} width="75%" />
          <ShimmerEffect height={16} width="50%" />
        </div>
      </div>
    ),
  },
}
