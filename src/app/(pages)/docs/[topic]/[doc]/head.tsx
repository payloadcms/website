import Meta from '@components/Meta'
import { getDoc } from '../../api'

export default async ({ params }) => {
  const { topic, doc: docSlug } = params
  const doc = await getDoc({ topic, doc: docSlug })

  if (doc)
    return (
      <Meta
        title={`${doc.title} | Documentation | Payload CMS`}
        description={doc.desc}
        slug={`docs/${topic}/${docSlug}`}
        image={`${process.env.NEXT_PUBLIC_SITE_URL}/api/og?topic=${topic}&title=${doc?.title}`}
      />
    )
  return null
}
