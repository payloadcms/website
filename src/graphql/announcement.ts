export const ANNOUNCEMENT_FIELDS = `
  query Announcements {
    Announcements(limit: 1) {
      docs {
        name
        content
      }
    }
  }
`
