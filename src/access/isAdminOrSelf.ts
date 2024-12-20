import type { Access, FieldAccess } from 'payload'

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  // Need to be logged in
  if (user) {
    // If user has role of 'admin'
    if (user.roles?.includes('admin')) {
      return true
    }

    // If any other type of user, only provide access to themselves
    return {
      id: {
        equals: user.id,
      },
    }
  }

  // Reject everyone else
  return false
}

export const isAdminOrSelfFieldLevel: FieldAccess = ({ id, req: { user } }) => {
  // Return true or false based on if the user has an admin role
  if (user?.roles?.includes('admin')) {
    return true
  }
  if (user?.id === id) {
    return true
  }
  return false
}
