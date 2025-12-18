'use client'

import type { CollectionSlug } from 'payload'

import { useEffect, useState } from 'react'

type UsePopulateDocumentOptions<T> = {
  /** Payload collection slug */
  collection: CollectionSlug
  /** Relationship population depth (default: 1) */
  depth?: number
  /** Whether to fetch (default: true) */
  enabled?: boolean
  /** Fallback value if fetch fails or is disabled */
  fallback?: T
  /** Document ID to fetch */
  id?: string
}

/**
 * Fetches a Payload document by ID from the REST API.
 * @returns The document data and loading state
 */
export function usePopulateDocument<T>({
  id,
  collection,
  depth = 0,
  enabled = true,
  fallback,
}: UsePopulateDocumentOptions<T>): { data: T | undefined; loading: boolean } {
  const [data, setData] = useState<T | undefined>(fallback)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!enabled || !id) {
      setData(fallback)
      return
    }

    const fetchDocument = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/${collection}/${id}?depth=${depth}`, {
          credentials: 'include',
          method: 'GET',
        })
        if (!res.ok) {
          setData(fallback)
          return
        }
        const json = await res.json()
        setData(json as T)
      } catch {
        setData(fallback)
      } finally {
        setLoading(false)
      }
    }

    void fetchDocument()
  }, [collection, depth, enabled, fallback, id])

  return { data, loading }
}
