import { Pill } from '@payloadcms/ui/elements/Pill'

import type { PreviewExamples } from './types.js'

export const pillExamples: PreviewExamples = {
  shapes: (
    <div className="payload-v4-preview__row">
      <Pill>Default</Pill>
      <Pill rounded>Rounded</Pill>
    </div>
  ),
  sizes: (
    <div className="payload-v4-preview__row">
      <Pill size="small">Small</Pill>
      <Pill size="medium">Medium</Pill>
    </div>
  ),
  styles: (
    <div className="payload-v4-preview__row">
      <Pill>Default</Pill>
      <Pill pillStyle="dark">Dark</Pill>
      <Pill pillStyle="success">Success</Pill>
      <Pill pillStyle="warning">Warning</Pill>
      <Pill pillStyle="error">Error</Pill>
    </div>
  ),
}
