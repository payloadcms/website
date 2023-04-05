export const COMMUNITY_HELPS = `
  query CommunityHelps($communityHelpType: CommunityHelp_communityHelpType_Input) {
    CommunityHelps(limit: 0, where: { communityHelpType: { equals: $communityHelpType} }) {
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
