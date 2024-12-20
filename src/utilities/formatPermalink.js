// cannot use ts here, for nodejs sitemap and redirects module
// this means we have to send through the 'currentCategory' which is a url param not accessible within node

export const formatPermalink = (reference) => {
  let permalink = ''

  const { relationTo, value } = reference

  if (typeof value === 'object' && value !== null) {
    const { slug: referenceSlug, breadcrumbs } = value

    // pages could be nested, so use breadcrumbs
    if (relationTo === 'pages') {
      if (breadcrumbs) {
        const { url: lastCrumbURL = '' } = breadcrumbs?.[breadcrumbs.length - 1] || {} // last crumb
        permalink = lastCrumbURL
      } else {
        permalink = referenceSlug
      }
    }

    if (relationTo !== 'pages') {
      permalink = `/${relationTo}/${referenceSlug}`

      if (relationTo === 'media') {
        permalink = value.url
      }
    }
  }

  return permalink
}
