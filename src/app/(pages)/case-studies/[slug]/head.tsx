import { fetchCaseStudy } from '@graphql'

import Meta from '@components/Meta'

export default async ({ params }) => {
  const { slug } = params
  const caseStudy = await fetchCaseStudy(slug)

  if (caseStudy) {
    const { meta } = caseStudy
    return (
      <Meta
        title={meta?.title}
        description={meta?.description}
        image={meta?.image}
        slug={`case-studies/${slug}`}
      />
    )
  }
  return null
}
