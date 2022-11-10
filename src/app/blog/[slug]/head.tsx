import Meta from '@components/Meta'
import { fetchBlogPost } from '@graphql'

export default async ({ params }) => {
  const { slug } = params
  const { meta, image, title } = await fetchBlogPost(slug)

  return (
    <Meta title={meta?.title || title} description={meta?.description} image={image} slug={slug} />
  )
}
