import { Button } from '@payloadcms/ui/elements/Button'
import { Card } from '@payloadcms/ui/elements/Card'
import { PlusIcon } from '@payloadcms/ui/icons/Plus'

import type { PreviewExamples } from './types.js'

export const cardExamples: PreviewExamples = {
  actions: (
    <div className="payload-v4-preview__card">
      <Card
        actions={
          <Button
            aria-label="Create new Post"
            buttonStyle="ghost"
            icon={<PlusIcon size={16} />}
            margin={false}
            onClick={() => undefined}
            round
          />
        }
        title="Posts"
      />
    </div>
  ),
  basic: (
    <div className="payload-v4-preview__card">
      <Card title="Posts" />
    </div>
  ),
}
