import * as migration_20241116_194708_migration from './20241116_194708_migration';

export const migrations = [
  {
    up: migration_20241116_194708_migration.up,
    down: migration_20241116_194708_migration.down,
    name: '20241116_194708_migration'
  },
];
