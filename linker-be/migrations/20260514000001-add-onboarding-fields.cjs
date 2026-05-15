/**
 * Migration: 002 — add onboarding fields to users collection
 *
 * UP:
 *   - Back-fills all existing users with default onboarding fields
 *     (onboardingComplete: false, workspaceType: null, onboardingData: {})
 *   - Adds a sparse index on `workspaceType` for filtered queries
 *   - Adds a sparse index on `onboardingComplete` for dashboard redirect lookups
 *
 * DOWN:
 *   - Removes the onboarding fields from all users
 *   - Drops the two new indexes
 */

module.exports = {
  async up(db) {
    const users = db.collection('users');

    // 1. Back-fill existing docs that don't have the new fields yet
    const result = await users.updateMany(
      { onboardingComplete: { $exists: false } },
      {
        $set: {
          onboardingComplete: false,
          workspaceType: null,
          onboardingData: {
            categories: [],
            projectName: null,
            projectDescription: null,
            invitedEmails: [],
            resources: [],
          },
        },
      }
    );
    console.log(`  ✔ Back-filled ${result.modifiedCount} existing user(s) with onboarding defaults`);

    // 2. Sparse index on workspaceType — fast lookup by workspace
    await users.createIndex(
      { workspaceType: 1 },
      {
        sparse: true,
        name: 'workspaceType_sparse',
        background: true,
      }
    );
    console.log('  ✔ Index created: workspaceType_sparse');

    // 3. Index on onboardingComplete — used when redirecting after login
    await users.createIndex(
      { onboardingComplete: 1 },
      {
        name: 'onboardingComplete_idx',
        background: true,
      }
    );
    console.log('  ✔ Index created: onboardingComplete_idx');
  },

  async down(db) {
    const users = db.collection('users');

    // Remove onboarding fields from all docs
    await users.updateMany(
      {},
      {
        $unset: {
          onboardingComplete: '',
          workspaceType: '',
          onboardingData: '',
        },
      }
    );
    console.log('  ✔ Removed onboarding fields from all users');

    // Drop the indexes added in up()
    try {
      await users.dropIndex('workspaceType_sparse');
      console.log('  ✔ Dropped index: workspaceType_sparse');
    } catch {
      console.log('  ℹ Index workspaceType_sparse not found — skipping');
    }

    try {
      await users.dropIndex('onboardingComplete_idx');
      console.log('  ✔ Dropped index: onboardingComplete_idx');
    } catch {
      console.log('  ℹ Index onboardingComplete_idx not found — skipping');
    }
  },
};
