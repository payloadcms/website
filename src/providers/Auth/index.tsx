import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { User } from '../../payload-cloud-types'

// eslint-disable-next-line no-unused-vars
type ResetPassword = (args: {
  password: string
  passwordConfirm: string
  token: string
}) => Promise<void>

type ForgotPassword = (args: { email: string }) => Promise<void> // eslint-disable-line no-unused-vars

type Create = (args: { email: string; password: string; passwordConfirm: string }) => Promise<void> // eslint-disable-line no-unused-vars

type Login = (args: { email: string; password: string }) => Promise<User> // eslint-disable-line no-unused-vars

type Logout = () => Promise<void>

type AuthContext = {
  user?: User | null
  setUser: (user: User | null) => void // eslint-disable-line no-unused-vars
  logout: Logout
  login: Login
  create: Create
  resetPassword: ResetPassword
  forgotPassword: ForgotPassword
}

const USER = `
  id
  email
  defaultTeam {
    id
    name
    slug
  }
  teams {
    team {
      id
      name
      slug
    }
    roles
  }
`

const Context = createContext({} as AuthContext)

const CLOUD_CONNECTION_ERROR = 'An error occurred while attempting to connect to Cloud CMS.'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const fetchedMe = useRef(false)

  const create = useCallback<Create>(async args => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation {
              createUser(data: { email: "${args.email}", password: "${args.password}" }) {
                email
              }
            }`,
        }),
      })

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
      } else {
        throw new Error('Invalid login')
      }
    } catch (e) {
      throw new Error(CLOUD_CONNECTION_ERROR)
    }
  }, [])

  const login = useCallback<Login>(async args => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation {
              loginUser(email: "${args.email}", password: "${args.password}") {
                user {
                  ${USER}
                }
                exp
              }
            }`,
        }),
      })

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
        return data?.loginUser?.user
      }

      throw new Error('Invalid login')
    } catch (e) {
      throw new Error(CLOUD_CONNECTION_ERROR)
    }
  }, [])

  const logout = useCallback<Logout>(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation {
            logoutUser
          }`,
        }),
      })

      if (res.ok) {
        setUser(null)
      } else {
        throw new Error('An error occurred while attempting to logout.')
      }
    } catch (e) {
      throw new Error(CLOUD_CONNECTION_ERROR)
    }
  }, [])

  useEffect(() => {
    if (fetchedMe.current) return
    fetchedMe.current = true

    const fetchMe = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `query {
              meUser {
                user {
                  ${USER}
                }
                exp
              }
            }`,
          }),
        })

        if (res.ok) {
          const { data } = await res.json()
          setUser(data?.meUser?.user || null)
        } else {
          throw new Error('An error occurred while fetching your account.')
        }
      } catch (e) {
        setUser(null)
        throw new Error(CLOUD_CONNECTION_ERROR)
      }
    }

    fetchMe()
  }, [])

  const forgotPassword = useCallback<ForgotPassword>(async args => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation {
              forgotPasswordUser(email: "${args.email}") {
                user {
                  ${USER}
                }
                exp
              }
            }`,
        }),
      })

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
      } else {
        throw new Error('Invalid login')
      }
    } catch (e) {
      throw new Error(CLOUD_CONNECTION_ERROR)
    }
  }, [])

  const resetPassword = useCallback<ResetPassword>(async args => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation {
              resetPasswordUser(password: "${args.password}", passwordConfirm: "${args.passwordConfirm}", token: "${args.token}") {
                user {
                  ${USER}
                }
                exp
              }
            }`,
        }),
      })

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
      } else {
        throw new Error('Invalid login')
      }
    } catch (e) {
      throw new Error(CLOUD_CONNECTION_ERROR)
    }
  }, [])

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        create,
        resetPassword,
        forgotPassword,
      }}
    >
      {children}
    </Context.Provider>
  )
}

type UseAuth<T = User> = () => AuthContext // eslint-disable-line no-unused-vars

export const useAuth: UseAuth = () => useContext(Context)
