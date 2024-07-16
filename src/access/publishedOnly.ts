import type { Access } from 'payload/config'

export const publishedOnly: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('admin')) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
