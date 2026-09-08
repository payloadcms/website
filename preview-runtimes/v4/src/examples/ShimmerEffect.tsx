import { ShimmerEffect } from '@payloadcms/ui/elements/ShimmerEffect'

import type { PreviewExamples } from './types.js'

export const shimmerEffectExamples: PreviewExamples = {
  basic: (
    <div className="payload-v4-preview__component-width">
      <ShimmerEffect height={60} width="100%" />
    </div>
  ),
  shapes: (
    <div className="payload-v4-preview__skeleton-layout">
      <ShimmerEffect height={48} style={{ borderRadius: '50%' }} width={48} />
      <div className="payload-v4-preview__skeleton-lines">
        <ShimmerEffect height={16} width="75%" />
        <ShimmerEffect height={16} width="50%" />
      </div>
    </div>
  ),
}
