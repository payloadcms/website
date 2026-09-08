import { Collapsible } from '@payloadcms/ui/elements/Collapsible'

import type { PreviewExamples } from './types.js'

export const collapsibleExamples: PreviewExamples = {
  basic: (
    <div className="payload-v4-preview__collapsible">
      <Collapsible header="Collapsible header">Collapsible content</Collapsible>
    </div>
  ),
  error: (
    <div className="payload-v4-preview__collapsible">
      <Collapsible collapsibleStyle="error" header="Collapsible header">
        Correct the invalid fields in this section.
      </Collapsible>
    </div>
  ),
}
