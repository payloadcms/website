export const formatPagePath = (
  collection: string,
  doc: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  category?: string,
): string => {
  const { slug, breadcrumbs } = doc

  const nestedSlug = breadcrumbs?.slice(-1)?.[0]?.url

  let prefix = ''
  const slugPath = nestedSlug ?? `/${slug}`

  if (collection) {
    switch (collection) {
      case 'case-studies':
        prefix = '/case-studies'
        break
      case 'pages':
        prefix = ''
        break
      case 'partners':
        prefix = '/partners'
        break
      case 'posts':
        prefix = `/posts/${category}`
        break
      default:
        prefix = `/${collection}`
    }
  }

  return `${prefix}${slugPath}`
}
