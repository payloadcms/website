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
): Promise<{ title: string; url: string }> => {
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
  return {
    title: data.repository[contributionType[type]].title,
    url: data.repository[contributionType[type]].url,
  }
}
