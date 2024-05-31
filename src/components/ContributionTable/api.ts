const headers = {
  Accept: 'application/vnd.github.v3+json.html',
  Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
}

export const getDiscussion = async (number: number): Promise<{ title: string; url: string }> => {
  const query = `
  query {
    repository(owner: "payloadcms", name: "payload") {
      discussion(number: ${number}) {
        title
        url
      }
    }
  }
  `
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query }),
  })
  const { data } = await res.json()
  return {
    title: data.repository.discussion.title,
    url: data.repository.discussion.url,
  }
}

export const getPull = async (number: number): Promise<{ title: string; url: string }> => {
  const query = `
  query {
    repository(owner: "payloadcms", name: "payload") {
      pullRequest(number: ${number}) {
        title
        url
      }
    }
  }
  `
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query }),
  })
  const { data } = await res.json()
  return {
    title: data.repository.pullRequest.title,
    url: data.repository.pullRequest.url,
  }
}

export const getIssue = async (number: number): Promise<{ title: string; url: string }> => {
  const query = `
  query {
    repository(owner: "payloadcms", name: "payload") {
      issue(number: ${number}) {
        title
        url
      }
    }
  }
  `
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query }),
  })
  const { data } = await res.json()
  return {
    title: data.repository.issue.title,
    url: data.repository.issue.url,
  }
}
