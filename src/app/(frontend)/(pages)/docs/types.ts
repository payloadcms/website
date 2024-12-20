export type GithubAPIResponse = {
  _links: {
    git: string
    html: string
    self: string
  }
  content: string
  download_url: string
  encoding: string
  git_url: string
  html_url: string
  name: string
  path: string
  sha: string
  size: number
  type: string
  url: string
}
export type Heading = { anchor: string; id: string; level: number; text: string }

export type ParsedDoc = {
  content: string
  desc: string
  headings: Heading[]
  keywords: string
  label: string
  order: number
  slug: string
  title: string
}

export type Topic = { docs: ParsedDoc[]; slug: string }

export type TopicGroup = {
  groupLabel: string
  topics: Topic[]
}
