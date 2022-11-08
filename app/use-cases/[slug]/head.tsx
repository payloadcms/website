import Meta from '@components/Meta'
import { fetchCaseStudy } from '@root/graphql'

export default async ({ params }) => {
  const { slug } = params
  const { meta } = await fetchCaseStudy(slug)

  return (
    <Meta
      title={meta?.title}
      description={meta?.description}
      image={meta?.image}
      slug={`/use-cases/${slug}`}
    />
  )
}
