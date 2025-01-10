import * as migration_20241116_194708_migration from './20241116_194708_migration'

export const migrations = [
  {
    name: '20241116_194708_migration',
    down: migration_20241116_194708_migration.down,
    up: migration_20241116_194708_migration.up,
  },
]
