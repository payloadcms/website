'use client'

import { ME_QUERY, USER } from '@data/me'
import React, { createContext, use, useCallback, useEffect, useRef, useState } from 'react'

import type { User } from '../../payload-cloud-types'

type ResetPassword = (args: {
  password: string
  passwordConfirm: string
  token: string
}) => Promise<void>

type ForgotPassword = (args: { email: string }) => Promise<void>

type Create = (args: { email: string; password: string; passwordConfirm: string }) => Promise<void>

type Login = (args: { email: string; password: string }) => Promise<User>

type Logout = () => Promise<void>

type AuthContext = {
  forgotPassword: ForgotPassword
  login: Login
  logout: Logout
  resetPassword: ResetPassword
  setUser: (user: null | User) => void
  updateUser: (user: Partial<User>) => void
  user?: null | User
}

const Context = createContext({} as AuthContext)

const CLOUD_CONNECTION_ERROR = 'An error occurred while attempting to connect to Payload Cloud'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<null | undefined | User>(undefined)
  const fetchedMe = useRef(false)

  const login = useCallback<Login>(async (args) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
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
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const { data, errors } = await res.json()

      if (res.ok) {
        if (errors) {
          throw new Error(errors[0].message)
        }
        setUser(data?.loginUser?.user)
        return data?.loginUser?.user
      }

      throw new Error(errors?.[0]?.message || 'An error occurred while attempting to login.')
    } catch (e) {
      throw new Error(`${CLOUD_CONNECTION_ERROR}: ${e.message}`)
    }
  }, [])

  const logout = useCallback<Logout>(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
        body: JSON.stringify({
          query: `mutation {
            logoutUser
          }`,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (res.ok) {
        setUser(null)
      } else {
        throw new Error('An error occurred while attempting to logout.')
      }
    } catch (e) {
      throw new Error(`${CLOUD_CONNECTION_ERROR}: ${e.message}`)
    }
  }, [])

  useEffect(() => {
    if (fetchedMe.current) {
      return
    }
    fetchedMe.current = true

    const fetchMe = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
          body: JSON.stringify({
            query: ME_QUERY,
          }),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        })

        const { data, errors } = await res.json()

        if (res.ok) {
          setUser(data?.meUser?.user || null)
        } else {
          throw new Error(
            errors?.[0]?.message || 'An error occurred while attempting to fetch user.',
          )
        }
      } catch (e) {
        setUser(null)
        if (process.env.NEXT_PUBLIC_OMIT_CLOUD_ERRORS === 'true') {
          return
        }
        throw new Error(`${CLOUD_CONNECTION_ERROR}: ${e.message}`)
      }
    }

    fetchMe()
  }, [])

  const forgotPassword = useCallback<ForgotPassword>(async (args) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
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
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const { data, errors } = await res.json()

      if (res.ok) {
        if (errors) {
          throw new Error(errors[0].message)
        }
        setUser(data?.loginUser?.user)
      } else {
        throw new Error(
          errors?.[0]?.message || 'An error occurred while attempting to reset your password.',
        )
      }
    } catch (e) {
      throw new Error(`${CLOUD_CONNECTION_ERROR}: ${e.message}`)
    }
  }, [])

  const resetPassword = useCallback<ResetPassword>(async (args) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
        body: JSON.stringify({
          query: `mutation {
              resetPasswordUser(password: "${args.password}", token: "${args.token}") {
                user {
                  ${USER}
                }
              }
            }`,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const { data, errors } = await res.json()

      if (res.ok) {
        if (errors) {
          throw new Error(errors[0].message)
        }
        setUser(data?.resetPasswordUser?.user)
      } else {
        throw new Error(errors?.[0]?.message || 'Invalid login')
      }
    } catch (e) {
      throw new Error(`${CLOUD_CONNECTION_ERROR}: ${e.message}`)
    }
  }, [])

  const updateUser = useCallback(
    async (incomingUser: Partial<User>) => {
      try {
        if (!user || !incomingUser) {
          throw new Error('No user found to update.')
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
          body: JSON.stringify({
            query: `mutation {
              updateUser(
                id: "${user?.id}",
                data: {
                  ${Object.entries(incomingUser)
                    .filter(([key, value]) => value !== undefined)
                    .map(([key, value]) => `${key}: "${value}"`)
                    .join(', ')}
                }
              ) {
                ${USER}
              }
            }`,
          }),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        })

        const { data, errors } = await res.json()

        if (res.ok) {
          if (errors) {
            throw new Error(errors[0].message)
          }
          setUser(data?.updateUser)
        } else {
          throw new Error(errors?.[0]?.message || 'An error occurred while updating your account.')
        }
      } catch (e) {
        throw new Error(`${CLOUD_CONNECTION_ERROR}: ${e.message}`)
      }
    },
    [user],
  )

  return (
    <Context
      value={{
        forgotPassword,
        login,
        logout,
        resetPassword,
        setUser,
        updateUser,
        user,
      }}
    >
      {children}
    </Context>
  )
}

type UseAuth<T = User> = () => AuthContext

export const useAuth: UseAuth = () => use(Context)
