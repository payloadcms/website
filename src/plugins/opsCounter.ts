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
const benchmarkPoolTraceWindowMs = 15_000
const mongoPoolSummaryIntervalMs = 5_000
const slowMongoConnectionMs = 100

type MongoPoolWindowStats = {
  checkoutFailures: number
  checkouts: number
  clears: number
  connectionsCreated: number
  connectionsReady: number
  currentCheckedOut: number
  lastSummaryAt: number
  maxCheckedOut: number
  maxCheckoutMs: number
  slowCheckouts: number
}

export const opsCounterPlugin =
  (args?: Args): Plugin =>
  (config) => {
    const max = args?.max || 50
    const warnAt = args?.warnAt || 10
    const tracedMongoClients = new WeakSet<object>()
    const mongoPoolStats = new Map<string, MongoPoolWindowStats>()
    let benchmarkPoolTraceUntil = 0

    const isBenchmarkPoolTraceActive = () => Date.now() <= benchmarkPoolTraceUntil

    const getMongoPoolStats = (address: string): MongoPoolWindowStats => {
      const existingStats = mongoPoolStats.get(address)

      if (existingStats) {
        return existingStats
      }

      const newStats: MongoPoolWindowStats = {
        checkoutFailures: 0,
        checkouts: 0,
        clears: 0,
        connectionsCreated: 0,
        connectionsReady: 0,
        currentCheckedOut: 0,
        lastSummaryAt: Date.now(),
        maxCheckedOut: 0,
        maxCheckoutMs: 0,
        slowCheckouts: 0,
      }

      mongoPoolStats.set(address, newStats)
      return newStats
    }

    const maybeLogMongoPoolSummary = (
      address: string,
      logger: { warn: (message: string) => void },
    ) => {
      const stats = getMongoPoolStats(address)
      const now = Date.now()

      if (now - stats.lastSummaryAt < mongoPoolSummaryIntervalMs) {
        return
      }

      logger.warn(
        JSON.stringify({
          address,
          checkoutFailures: stats.checkoutFailures,
          checkouts: stats.checkouts,
          clears: stats.clears,
          connectionsCreated: stats.connectionsCreated,
          connectionsReady: stats.connectionsReady,
          currentCheckedOut: stats.currentCheckedOut,
          event: 'mongodb-pool-window-summary',
          maxCheckedOut: stats.maxCheckedOut,
          maxCheckoutMs: stats.maxCheckoutMs,
          slowCheckouts: stats.slowCheckouts,
          windowMs: now - stats.lastSummaryAt,
        }),
      )

      stats.checkoutFailures = 0
      stats.checkouts = 0
      stats.clears = 0
      stats.connectionsCreated = 0
      stats.connectionsReady = 0
      stats.lastSummaryAt = now
      stats.maxCheckedOut = stats.currentCheckedOut
      stats.maxCheckoutMs = 0
      stats.slowCheckouts = 0
    }

    const enableBenchmarkMongoPoolTracing = (
      req: Parameters<CollectionBeforeOperationHook>[0]['req'],
    ) => {
      benchmarkPoolTraceUntil = Date.now() + benchmarkPoolTraceWindowMs

      const client = req.payload.db.connection.getClient()

      if (tracedMongoClients.has(client)) {
        return
      }

      tracedMongoClients.add(client)
      const logger = req.payload.logger

      client.on('connectionCheckedOut', (event) => {
        const stats = getMongoPoolStats(event.address)
        stats.currentCheckedOut += 1

        if (!isBenchmarkPoolTraceActive()) {
          return
        }

        stats.checkouts += 1
        stats.maxCheckedOut = Math.max(stats.maxCheckedOut, stats.currentCheckedOut)
        stats.maxCheckoutMs = Math.max(stats.maxCheckoutMs, Math.round(event.durationMS))

        if (event.durationMS >= slowMongoConnectionMs) {
          stats.slowCheckouts += 1
          logger.warn(
            JSON.stringify({
              address: event.address,
              currentCheckedOut: stats.currentCheckedOut,
              durationMs: Math.round(event.durationMS),
              event: 'mongodb-pool-checkout-slow',
            }),
          )
        }

        maybeLogMongoPoolSummary(event.address, logger)
      })

      client.on('connectionCheckedIn', (event) => {
        const stats = getMongoPoolStats(event.address)
        stats.currentCheckedOut = Math.max(0, stats.currentCheckedOut - 1)
      })

      client.on('connectionCheckOutFailed', (event) => {
        if (!isBenchmarkPoolTraceActive()) {
          return
        }

        const stats = getMongoPoolStats(event.address)
        stats.checkoutFailures += 1
        logger.warn(
          JSON.stringify({
            address: event.address,
            durationMs: Math.round(event.durationMS),
            event: 'mongodb-pool-checkout-failed',
            reason: event.reason,
          }),
        )
        maybeLogMongoPoolSummary(event.address, logger)
      })

      client.on('connectionPoolCleared', (event) => {
        if (!isBenchmarkPoolTraceActive()) {
          return
        }

        const stats = getMongoPoolStats(event.address)
        stats.clears += 1
        logger.warn(
          JSON.stringify({
            address: event.address,
            event: 'mongodb-pool-cleared',
          }),
        )
        maybeLogMongoPoolSummary(event.address, logger)
      })

      client.on('connectionCreated', (event) => {
        if (!isBenchmarkPoolTraceActive()) {
          return
        }

        getMongoPoolStats(event.address).connectionsCreated += 1
      })

      client.on('connectionReady', (event) => {
        if (!isBenchmarkPoolTraceActive()) {
          return
        }

        const stats = getMongoPoolStats(event.address)
        stats.connectionsReady += 1

        if (event.durationMS >= slowMongoConnectionMs) {
          logger.warn(
            JSON.stringify({
              address: event.address,
              durationMs: Math.round(event.durationMS),
              event: 'mongodb-connection-ready-slow',
            }),
          )
        }
      })
    }

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

        enableBenchmarkMongoPoolTracing(req)

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
