import Meta from '@components/Meta'
import { fetchPage } from '@graphql'

export default async ({ params }) => {
  const { slug } = params
  const { meta } = await fetchPage(slug)

  return (
    <Meta
      title={meta?.title}
      description={meta?.description}
      image={meta?.image}
      slug={`/${slug.join('/')}`}
    />
  )
}
