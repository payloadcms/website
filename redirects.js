import { formatPermalink } from './src/utilities/formatPermalink.js'

export const redirects = async () => {
  const staticRedirects = [
    {
      source: '/docs',
      destination: '/docs/getting-started/what-is-payload',
      permanent: true,
    },
    {
      source: '/docs/beta',
      destination: '/docs/beta/getting-started/what-is-payload',
      permanent: false,
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

  const redirects = [...staticRedirects, internetExplorerRedirect]

  return redirects
}
