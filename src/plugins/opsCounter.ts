import type { CollectionAfterOperationHook, CollectionBeforeOperationHook, Plugin } from 'payload'

import { APIError } from 'payload'

type Args = {
  max?: number
  warnAt?: number
}

type BenchmarkOperationTrace = {
  depth: null | string
  id: string
  limit: null | string
  startedAt: number
  timer?: ReturnType<typeof setTimeout>
}

const benchmarkTraceContextKey = 'benchmarkPostsOperationTrace'

export const opsCounterPlugin =
  (args?: Args): Plugin =>
  (config) => {
    const max = args?.max || 50
    const warnAt = args?.warnAt || 10

    const beforeOperationHook: CollectionBeforeOperationHook = ({ collection, operation, req }) => {
      const currentCount = req.context.opsCount

      if (typeof currentCount === 'number') {
        req.context.opsCount = currentCount + 1

        if (warnAt && currentCount >= warnAt) {
          req.payload.logger.error(
            `Detected a ${operation} in the "${collection.slug}" collection which has run ${warnAt} times or more.`,
          )
        }

        if (currentCount > max) {
          throw new APIError(`Maximum operations of ${max} detected.`)
        }
      } else {
        req.context.opsCount = 1
      }

      const isPotentialBenchmarkPostsRead =
        collection.slug === 'posts' &&
        operation === 'read' &&
        req.headers.get('user-agent')?.startsWith('Payload-RFP-Read-Benchmark/')

      if (isPotentialBenchmarkPostsRead && !req.context[benchmarkTraceContextKey]) {
        const url = req.url ? new URL(req.url) : undefined

        if (url?.pathname !== '/api/posts') {
          return
        }

        const trace: BenchmarkOperationTrace = {
          id: crypto.randomUUID(),
          depth: url?.searchParams.get('depth') ?? null,
          limit: url?.searchParams.get('limit') ?? null,
          startedAt: performance.now(),
        }

        trace.timer = setTimeout(() => {
          req.payload.logger.warn(
            JSON.stringify({
              id: trace.id,
              depth: trace.depth,
              durationMs: Math.round(performance.now() - trace.startedAt),
              event: 'payload-posts-operation-still-running',
              limit: trace.limit,
            }),
          )
        }, 500)

        req.context[benchmarkTraceContextKey] = trace
      }
    }

    const afterOperationHook: CollectionAfterOperationHook = ({ collection, req, result }) => {
      const trace = req.context[benchmarkTraceContextKey] as BenchmarkOperationTrace | undefined

      if (collection.slug !== 'posts' || !trace) {
        return result
      }

      if (trace.timer) {
        clearTimeout(trace.timer)
      }
      const durationMs = Math.round(performance.now() - trace.startedAt)

      if (durationMs >= 500) {
        req.payload.logger.warn(
          JSON.stringify({
            id: trace.id,
            depth: trace.depth,
            durationMs,
            event: 'payload-posts-operation-slow-complete',
            limit: trace.limit,
          }),
        )
      }

      delete req.context[benchmarkTraceContextKey]
      return result
    }

    ;(config.collections || []).forEach((collection) => {
      if (!collection.hooks) {
        collection.hooks = {}
      }
      if (!collection.hooks.beforeOperation) {
        collection.hooks.beforeOperation = []
      }
      if (!collection.hooks.afterOperation) {
        collection.hooks.afterOperation = []
      }

      collection.hooks.beforeOperation.push(beforeOperationHook)
      collection.hooks.afterOperation.push(afterOperationHook)
    })
    return config
  }
