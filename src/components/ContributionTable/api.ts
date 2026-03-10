const headers = {
  Accept: 'application/vnd.github.v3+json.html',
  Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
}

const contributionType = {
  discussion: 'discussion',
  issue: 'issue',
  pr: 'pullRequest',
}

export const getContribution = async (
  type: 'discussion' | 'issue' | 'pr',
  number: number,
  repo: string,
): Promise<{ title: string | null; url: string | null }> => {
  const query = `
  query {
    repository(owner: "payloadcms", name: "${repo}") {
      ${contributionType[type]}(number: ${number}) {
        title
        url
      }
    }
  }
  `

  const res = await fetch('https://api.github.com/graphql', {
    body: JSON.stringify({ query }),
    headers,
    method: 'POST',
  })
  const { data } = await res.json()
  const item = data?.repository?.[contributionType[type]]
  if (!item) {
    return { title: null, url: null }
  }
  return {
    title: item.title,
    url: item.url,
  }
}
