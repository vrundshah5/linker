/**
 * Migration: Add allowedExtensions field to globalcategories
 * Sets an empty array for existing documents that don't have the field.
 */
module.exports = {
  async up(db) {
    const result = await db.collection('globalcategories').updateMany(
      { allowedExtensions: { $exists: false } },
      { $set: { allowedExtensions: [] } }
    );
    console.log(`✅ Added allowedExtensions to ${result.modifiedCount} global categories`);
  },

  async down(db) {
    const result = await db.collection('globalcategories').updateMany(
      {},
      { $unset: { allowedExtensions: '' } }
    );
    console.log(`🗑  Removed allowedExtensions from ${result.modifiedCount} global categories`);
  },
};
