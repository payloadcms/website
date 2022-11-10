import Meta from '@components/Meta'
import { getDoc } from '../../api'

export default async ({ params }) => {
  const { topic, doc: docSlug } = params
  const doc = await getDoc({ topic, doc: docSlug })

  return (
    <Meta
      title={`${doc.title} | Documentation`}
      description={doc.desc}
      slug={`/docs/${topic}/${docSlug}`}
    />
  )
}
