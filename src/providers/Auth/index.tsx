'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { ME_QUERY, USER } from '@data/me.js'
import { User } from '../../payload-cloud-types.js'

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
  updateUser: (user: Partial<User>) => void // eslint-disable-line no-unused-vars
  setUser: (user: User | null) => void // eslint-disable-line no-unused-vars
  logout: Logout
  login: Login
  resetPassword: ResetPassword
  forgotPassword: ForgotPassword
}

const Context = createContext({} as AuthContext)

const CLOUD_CONNECTION_ERROR = 'An error occurred while attempting to connect to Payload Cloud'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const fetchedMe = useRef(false)

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

      const { data, errors } = await res.json()

      if (res.ok) {
        if (errors) throw new Error(errors[0].message)
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
      throw new Error(`${CLOUD_CONNECTION_ERROR}: ${e.message}`)
    }
  }, [])

  // useEffect(() => {
  //   if (fetchedMe.current) return
  //   fetchedMe.current = true

  //   const fetchMe = async () => {
  //     try {
  //       const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
  //         method: 'POST',
  //         credentials: 'include',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           query: ME_QUERY,
  //         }),
  //       })

  //       const { data, errors } = await res.json()

  //       if (res.ok) {
  //         setUser(data?.meUser?.user || null)
  //       } else {
  //         throw new Error(
  //           errors?.[0]?.message || 'An error occurred while attempting to fetch user.',
  //         )
  //       }
  //     } catch (e) {
  //       setUser(null)
  //       throw new Error(`${CLOUD_CONNECTION_ERROR}: ${e.message}`)
  //     }
  //   }

  //   fetchMe()
  // }, [])

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

      const { data, errors } = await res.json()

      if (res.ok) {
        if (errors) throw new Error(errors[0].message)
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
              resetPasswordUser(password: "${args.password}", token: "${args.token}") {
                user {
                  ${USER}
                }
              }
            }`,
        }),
      })

      const { data, errors } = await res.json()

      if (res.ok) {
        if (errors) throw new Error(errors[0].message)
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
        if (!user || !incomingUser) throw new Error('No user found to update.')

        const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
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
        })

        const { data, errors } = await res.json()

        if (res.ok) {
          if (errors) throw new Error(errors[0].message)
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
    <Context.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        resetPassword,
        forgotPassword,
        updateUser,
      }}
    >
      {children}
    </Context.Provider>
  )
}

type UseAuth<T = User> = () => AuthContext // eslint-disable-line no-unused-vars

export const useAuth: UseAuth = () => useContext(Context)
