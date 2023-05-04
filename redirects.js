const permalink = require('./src/utilities/formatPermalink')
const { formatPermalink } = permalink

module.exports = async () => {
  const staticRedirects = [
    {
      source: '/docs',
      destination: '/docs/getting-started/what-is-payload',
      permanent: true,
    },
    {
      source: '/roadmap',
      destination: 'https://github.com/payloadcms/payload/discussions/categories/roadmap',
      permanent: true,
    },
  ]

  const internetExplorerRedirect = {
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    destination: '/ie-incompatible.html',
  }

  const redirectsRes = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/redirects?limit=1000&depth=1`,
  )
  const redirectsData = await redirectsRes.json()

  const { docs } = redirectsData

  let dynamicRedirects = []

  if (docs) {
    docs.forEach(doc => {
      const { from, to: { type, url, reference } = {} } = doc

      let source = from.replace(process.env.NEXT_PUBLIC_SITE_URL, '').split('?')[0].toLowerCase()

      if (source.endsWith('/')) source = source.slice(0, -1) // a trailing slash will break this redirect

      let destination = '/'

      if (type === 'custom' && url) {
        destination = url.replace(process.env.NEXT_PUBLIC_SITE_URL, '')
      }

      if (
        type === 'reference' &&
        typeof reference.value === 'object' &&
        reference?.value?._status === 'published'
      ) {
        destination = `${process.env.NEXT_PUBLIC_SITE_URL}/${formatPermalink(reference)}`
      }

      const redirect = {
        source,
        destination,
        permanent: true,
      }

      if (source.startsWith('/') && destination && source !== destination) {
        return dynamicRedirects.push(redirect)
      }

      return
    })
  }

  const redirects = [...staticRedirects, internetExplorerRedirect, ...dynamicRedirects]

  return redirects
}
