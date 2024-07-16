export const formatPagePath = (
  collection: string,
  doc: any, // eslint-disable-line @typescript-eslint/no-explicit-any
): string => {
  const { slug, breadcrumbs } = doc

  const nestedSlug = breadcrumbs?.slice(-1)?.[0]?.url

  let prefix = ''
  const slugPath = nestedSlug ?? `/${slug}`

  if (collection) {
    switch (collection) {
      case 'pages':
        prefix = ''
        break
      case 'posts':
        prefix = '/blog'
        break
      default:
        prefix = `/${collection}`
    }
  }

  return `${prefix}${slugPath}`
}
