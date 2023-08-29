export const ANNOUNCEMENT_FIELDS = `
  query Announcements {
    Announcements(limit: 20) {
      docs {
        name
        content
      }
    }
  }
`
