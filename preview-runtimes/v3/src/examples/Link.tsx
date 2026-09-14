import { Link } from '@payloadcms/ui/elements/Link'

import type { ComponentRenders } from './types'

export const linkExamples: ComponentRenders = {
  basic: {
    render: () => (
      <Link className="custom-admin-link" href="#link-example">
        View posts
      </Link>
    ),
  },
}
