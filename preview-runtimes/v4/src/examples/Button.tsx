import { Button } from '@payloadcms/ui/elements/Button'

import type { PreviewExamples } from './types.js'

export const buttonExamples: PreviewExamples = {
  disabled: (
    <Button disabled margin={false}>
      Save changes
    </Button>
  ),
  primary: <Button margin={false}>Save changes</Button>,
  sizes: (
    <div className="payload-v4-preview__row">
      <Button margin={false} size="medium">
        Medium
      </Button>
      <Button margin={false} size="large">
        Large
      </Button>
    </div>
  ),
  styles: (
    <div className="payload-v4-preview__row">
      <Button margin={false}>Primary</Button>
      <Button buttonStyle="secondary" margin={false}>
        Secondary
      </Button>
      <Button buttonStyle="destructive" margin={false}>
        Delete
      </Button>
      <Button buttonStyle="dashed" margin={false}>
        Dashed
      </Button>
      <Button buttonStyle="ghost" margin={false}>
        Ghost
      </Button>
      <Button buttonStyle="pill" margin={false}>
        Pill
      </Button>
    </div>
  ),
}
