import { DocSearch } from '@docsearch/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

import classes from './index.module.scss'

const storedQueryKey = 'payload-docsearch-query'

const getInternalURL = (url: string | undefined): null | string => {
  if (!url) {
    return null
  }

  let parsedURL: URL

  try {
    parsedURL = new URL(url, window.location.origin)
  } catch {
    return null
  }

  if (parsedURL.origin !== window.location.origin && parsedURL.hostname !== 'payloadcms.com') {
    return null
  }

  return `${parsedURL.pathname}${parsedURL.search}${parsedURL.hash}`
}

function Hit({ children, hit, path }) {
  const blog = hit?.url?.includes('/blog/') || false

  let url = hit?.url

  const docsVersion = path.match(/^\/docs\/(beta|v2)(?=\/)/)?.[1]

  if (docsVersion) {
    url = url.replace('/docs/', `/docs/${docsVersion}/`)
  }

  const internalURL = getInternalURL(url)

  return internalURL ? (
    <Link className={blog ? classes.blogResult : ''} href={internalURL}>
      {children}
    </Link>
  ) : (
    <a className={blog ? classes.blogResult : ''} href={url}>
      {children}
    </a>
  )
}

function Component() {
  const path = usePathname()
  const router = useRouter()
  const [initialQuery, setInitialQuery] = React.useState('')

  React.useEffect(() => {
    setInitialQuery(sessionStorage.getItem(storedQueryKey) || '')
  }, [])

  React.useEffect(() => {
    let hasExplicitKeyboardSelection = false

    const isSearchInput = (target: EventTarget | null): target is HTMLInputElement =>
      target instanceof HTMLInputElement && target.classList.contains('DocSearch-Input')

    const handleInput = (event: Event) => {
      if (!isSearchInput(event.target)) {
        return
      }

      hasExplicitKeyboardSelection = false
      const query = event.target.value
      setInitialQuery(query)
      sessionStorage.setItem(storedQueryKey, query)
    }

    const handleFocus = (event: FocusEvent) => {
      if (isSearchInput(event.target)) {
        hasExplicitKeyboardSelection = false
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isSearchInput(event.target)) {
        return
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        hasExplicitKeyboardSelection = true
        return
      }

      if (event.key === 'Enter' && !hasExplicitKeyboardSelection) {
        event.preventDefault()
        event.stopImmediatePropagation()
      }
    }

    document.addEventListener('input', handleInput, true)
    document.addEventListener('focusin', handleFocus, true)
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      document.removeEventListener('input', handleInput, true)
      document.removeEventListener('focusin', handleFocus, true)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [])

  return (
    <DocSearch
      apiKey={process.env.NEXT_PUBLIC_ALGOLIA_DOCSEARCH_KEY || ''}
      appId="9MJY7K9GOW"
      hitComponent={({ children, hit }) => Hit({ children, hit, path })}
      indexName="payloadcms"
      initialQuery={initialQuery}
      navigator={{
        navigate: ({ itemUrl }) => {
          const internalURL = getInternalURL(itemUrl)

          if (internalURL) {
            router.push(internalURL)
          } else {
            window.location.assign(itemUrl)
          }
        },
      }}
    />
  )
}

export default Component
