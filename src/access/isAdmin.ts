import type { Access, FieldAccess } from 'payload'

import type { User } from '../payload-types'

export const isAdmin: Access<
  any, // eslint-disable-line @typescript-eslint/no-explicit-any
  User
> = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.roles?.includes('admin'))
}

export const isAdminFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({
  req: { user },
}) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.roles?.includes('admin'))
}
