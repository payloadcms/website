import { Link } from '@payloadcms/ui/elements/Link'

import type { ComponentExamples } from './types'

export const linkExamples: ComponentExamples = {
  basic: {
    code: `<Link href="/admin/collections/posts">View posts</Link>`,
    render: () => <Link href="#link-example">View posts</Link>,
  },
}
