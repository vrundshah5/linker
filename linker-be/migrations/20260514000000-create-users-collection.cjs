/**
 * Migration: 001 — create users collection + indexes
 *
 * UP:
 *   - Creates the `users` collection (explicit, so Atlas shows it immediately)
 *   - Unique index on `email`  (case-insensitive, sparse)
 *   - Sparse index on `resetPasswordToken`  (for fast lookup during password reset)
 *   - TTL index on `resetPasswordExpires`   (auto-delete expired tokens)
 *
 * DOWN:
 *   - Drops the entire `users` collection
 */

module.exports = {
  async up(db) {
    // Create collection explicitly (no-op if it already exists)
    const collections = await db
      .listCollections({ name: 'users' })
      .toArray();

    if (collections.length === 0) {
      await db.createCollection('users');
      console.log('  ✔ Created collection: users');
    } else {
      console.log('  ℹ Collection already exists: users');
    }

    const users = db.collection('users');

    // 1. Unique, case-insensitive index on email
    await users.createIndex(
      { email: 1 },
      {
        unique: true,
        collation: { locale: 'en', strength: 2 },
        name: 'email_unique',
        background: true,
      }
    );
    console.log('  ✔ Index created: email_unique');

    // 2. Sparse index on resetPasswordToken for fast lookup
    await users.createIndex(
      { resetPasswordToken: 1 },
      {
        sparse: true,
        name: 'resetPasswordToken_sparse',
        background: true,
      }
    );
    console.log('  ✔ Index created: resetPasswordToken_sparse');

    // 3. TTL index — MongoDB auto-deletes docs where resetPasswordExpires < now
    //    We only want it on the field itself (not delete the whole user doc),
    //    so we use a partial filter expression to target only reset-in-progress docs.
    await users.createIndex(
      { resetPasswordExpires: 1 },
      {
        sparse: true,
        name: 'resetPasswordExpires_sparse',
        background: true,
      }
    );
    console.log('  ✔ Index created: resetPasswordExpires_sparse');

    // 4. Index on createdAt for analytics / sorting
    await users.createIndex(
      { createdAt: -1 },
      {
        name: 'createdAt_desc',
        background: true,
      }
    );
    console.log('  ✔ Index created: createdAt_desc');
  },

  async down(db) {
    await db.collection('users').drop();
    console.log('  ✔ Dropped collection: users');
  },
};
