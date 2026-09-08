import { Banner } from '@payloadcms/ui/elements/Banner'

import type { PreviewExamples } from './types.js'

export const bannerExamples: PreviewExamples = {
  basic: (
    <div className="payload-v4-preview__stack">
      <Banner>Review these changes before publishing.</Banner>
    </div>
  ),
  variants: (
    <div className="payload-v4-preview__stack">
      <Banner type="default">Default message</Banner>
      <Banner type="brand">Additional product context</Banner>
      <Banner type="success">Changes saved successfully.</Banner>
      <Banner type="warning">Review this setting before continuing.</Banner>
      <Banner type="danger">Something went wrong.</Banner>
    </div>
  ),
}
