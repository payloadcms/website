export const COMMUNITY_HELPS = `
  query CommunityHelps {
    CommunityHelps(limit: 0) {
      docs {
        slug
      }
    }
  }
`

export const COMMUNITY_HELP = `
  query CommunityHelp($slug: String ) {
    CommunityHelps(where: { slug: { equals: $slug} }) {
      docs {
        id
        title
        communityHelpType
        githubID
        discordID
        communityHelpJSON
        slug
      }
    }
  }
`
