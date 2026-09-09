import { Gutter } from '@payloadcms/ui/elements/Gutter'

import type { PreviewExamples } from './types.js'

export const gutterExamples: PreviewExamples = {
  basic: (
    <div className="payload-v4-preview__gutter-frame">
      <Gutter>
        <div className="payload-v4-preview__gutter-content">
          Content aligned to the Admin Panel gutter
        </div>
      </Gutter>
    </div>
  ),
}
