import { unstable_cache } from 'next/cache'

export async function fetchAllBranches(): Promise<
  {
    commit: {
      sha: string
      url: string
    }
    name: string
    protected: boolean
  }[]
> {
  const branches: any[] = []
  let url: null | string = 'https://api.github.com/repos/payloadcms/payload/branches'

  while (url) {
    const response = await fetch(url, {
      headers: {
        accept: 'application/vnd.github+json',
        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch branches: ${response.statusText}`)
    }

    const data = await response.json()
    branches.push(...data)

    // Check if there is a next page
    const linkHeader = response.headers.get('link')
    if (linkHeader) {
      const links = parseLinkHeader(linkHeader)
      url = links.next // Set url to the next page if available
    } else {
      url = null // No more pages
    }
  }

  return branches
}

function parseLinkHeader(header: string) {
  const links: { [key: string]: string } = {}
  const parts = header.split(',')

  parts.forEach((part) => {
    const section = part.split(';')
    if (section.length !== 2) {
      return
    }
    const url = section[0].replace(/<(.*)>/, '$1').trim()
    const name = section[1].replace(/rel="(.*)"/, '$1').trim()
    links[name] = url
  })

  return links
}

export const fetchAllBranchesCached = unstable_cache(fetchAllBranches, ['fetchAllBranches'], {
  revalidate: 60, // Revalidate every 60 seconds
})
