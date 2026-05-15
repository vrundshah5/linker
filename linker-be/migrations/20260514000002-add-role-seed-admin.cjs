/**
 * Migration: 003 — add role + isBanned fields, seed Super Admin account
 *
 * UP:
 *   - Back-fills all existing users with role: 'user', isBanned: false
 *   - Adds index on role field
 *   - Creates (or updates) the Super Admin account:
 *       Name:     Super Vrund
 *       Email:    vrund@yopmail.com
 *       Password: Admin@123  (bcrypt hashed)
 *       Role:     admin
 *       onboardingComplete: true  (admins skip onboarding)
 *
 * DOWN:
 *   - Removes role and isBanned fields from all users
 *   - Drops the role index
 *   - Deletes the seed admin account
 */

const bcrypt = require('bcryptjs');

const ADMIN = {
  name: 'Super Vrund',
  email: 'vrund@yopmail.com',
  password: 'Admin@123',
  role: 'admin',
  onboardingComplete: true,
  workspaceType: null,
};

module.exports = {
  async up(db) {
    const users = db.collection('users');

    // 1. Back-fill role and isBanned on existing docs
    const result = await users.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'user', isBanned: false } }
    );
    console.log(`  ✔ Back-filled ${result.modifiedCount} user(s) with role: 'user'`);

    // 2. Index on role
    await users.createIndex(
      { role: 1 },
      { name: 'role_idx', background: true }
    );
    console.log('  ✔ Index created: role_idx');

    // 3. Index on isBanned (for filtering banned users)
    await users.createIndex(
      { isBanned: 1 },
      { name: 'isBanned_idx', background: true }
    );
    console.log('  ✔ Index created: isBanned_idx');

    // 4. Seed super admin — upsert so re-running is safe
    const hashedPassword = await bcrypt.hash(ADMIN.password, 12);
    const now = new Date();

    const existing = await users.findOne({ email: ADMIN.email });
    if (existing) {
      await users.updateOne(
        { email: ADMIN.email },
        {
          $set: {
            name: ADMIN.name,
            role: 'admin',
            isBanned: false,
            onboardingComplete: true,
            updatedAt: now,
          },
        }
      );
      console.log(`  ✔ Admin account updated: ${ADMIN.email}`);
    } else {
      await users.insertOne({
        name: ADMIN.name,
        email: ADMIN.email,
        password: hashedPassword,
        role: ADMIN.role,
        isBanned: false,
        onboardingComplete: ADMIN.onboardingComplete,
        workspaceType: ADMIN.workspaceType,
        onboardingData: {
          categories: [],
          projectName: null,
          projectDescription: null,
          invitedEmails: [],
          resources: [],
        },
        resetPasswordToken: null,
        resetPasswordExpires: null,
        createdAt: now,
        updatedAt: now,
      });
      console.log(`  ✔ Admin account created: ${ADMIN.email}`);
    }
  },

  async down(db) {
    const users = db.collection('users');

    await users.updateMany({}, { $unset: { role: '', isBanned: '' } });
    console.log('  ✔ Removed role and isBanned from all users');

    try { await users.dropIndex('role_idx'); } catch { /* ignore */ }
    try { await users.dropIndex('isBanned_idx'); } catch { /* ignore */ }
    console.log('  ✔ Dropped role and isBanned indexes');

    await users.deleteOne({ email: ADMIN.email });
    console.log(`  ✔ Removed seed admin: ${ADMIN.email}`);
  },
};
