import { Link } from '@payloadcms/ui/elements/Link'

import type { ComponentExamples } from './types'

export const linkExamples: ComponentExamples = {
  basic: {
    code: `<Link className="custom-admin-link" href="/admin/collections/posts">
  View posts
</Link>`,
    render: () => (
      <Link className="custom-admin-link" href="#link-example">
        View posts
      </Link>
    ),
  },
}
