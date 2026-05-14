require('dotenv').config();

// Derive just the DB name from the Atlas URI
const uri = process.env.MONGO_URI || '';

module.exports = {
  mongodb: {
    url: uri,
    // Atlas URI already contains the db name; this is a fallback for local
    databaseName: 'linker',
  },

  // Directory that holds the migration files
  migrationsDir: 'migrations',

  // Collection that records which migrations have been applied
  changelogCollectionName: 'migrations_changelog',

  // Use .cjs extension so Node respects "type":"module" in package.json
  migrationFileExtension: '.cjs',

  // Tell migrate-mongo to treat migration files as CommonJS
  moduleSystem: 'commonjs',

  useFileHash: false,
};
