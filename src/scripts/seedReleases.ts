/**
 * One-time seed script to backfill the latest 20 GitHub releases.
 *
 * Usage:
 *   pnpm payload run src/scripts/seedReleases.ts
 *
 * This script is idempotent — re-running it will update existing records
 * rather than create duplicates.
 */
import { syncReleases } from './fetchReleases'

async function seed() {
  // eslint-disable-next-line no-console
  console.log('[seedReleases] Starting one-time seed of 20 releases...')

  try {
    const result = await syncReleases(20)
    // eslint-disable-next-line no-console
    console.log(
      `[seedReleases] Seed complete. Created: ${result.created}, Updated: ${result.updated}`,
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[seedReleases] Seed failed:', error)
    process.exit(1)
  }
}

// @ts-expect-error - top-level await required by payload run
await seed()
