import { CopyToClipboard } from '@payloadcms/ui/elements/CopyToClipboard'

import type { PreviewExamples } from './types.js'

export const copyToClipboardExamples: PreviewExamples = {
  basic: (
    <div className="payload-v4-preview__copy">
      <code>post_123456789</code>
      <CopyToClipboard defaultMessage="Copy ID" successMessage="ID copied" value="post_123456789" />
    </div>
  ),
}
