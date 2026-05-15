/**
 * Migration: Seed global categories
 * Creates the initial set of platform-wide categories available to all users
 * during onboarding and as a base for their personal workspace.
 */

const GLOBAL_CATEGORIES = [
  {
    name: 'Design Inspiration',
    description: 'UI/UX design references, portfolios, and creative inspiration.',
    icon: 'Palette',
    color: '#6c5dd3',
    isActive: true,
  },
  {
    name: 'Dev Tools',
    description: 'Developer tools, libraries, frameworks, and resources.',
    icon: 'Code2',
    color: '#3eac68',
    isActive: true,
  },
  {
    name: 'Marketing',
    description: 'Marketing strategies, campaigns, and analytics resources.',
    icon: 'TrendingUp',
    color: '#ff9b26',
    isActive: true,
  },
  {
    name: 'Project Ideas',
    description: 'Side project concepts, experiments, and startup ideas.',
    icon: 'Lightbulb',
    color: '#ff6a55',
    isActive: true,
  },
  {
    name: 'Read Later',
    description: 'Articles, blog posts, and content saved for later reading.',
    icon: 'BookOpen',
    color: '#6c5dd3',
    isActive: true,
  },
  {
    name: 'Recipes',
    description: 'Cooking recipes, food blogs, and culinary inspiration.',
    icon: 'Coffee',
    color: '#3eac68',
    isActive: true,
  },
  {
    name: 'Finance',
    description: 'Personal finance, investing, and money management resources.',
    icon: 'DollarSign',
    color: '#ff9b26',
    isActive: true,
  },
  {
    name: 'Travel Plans',
    description: 'Travel destinations, itineraries, and trip planning links.',
    icon: 'Map',
    color: '#ff6a55',
    isActive: true,
  },
];

module.exports = {
  async up(db) {
    const now = new Date();

    // Skip if categories already exist (idempotent)
    const existing = await db.collection('globalcategories').countDocuments();
    if (existing > 0) {
      console.log(`⏭  Skipping seed — ${existing} global categories already exist`);
      return;
    }

    const docs = GLOBAL_CATEGORIES.map((cat) => ({
      ...cat,
      createdAt: now,
      updatedAt: now,
    }));

    const result = await db.collection('globalcategories').insertMany(docs);
    console.log(`✅ Seeded ${result.insertedCount} global categories`);
  },

  async down(db) {
    const result = await db.collection('globalcategories').deleteMany({
      name: { $in: GLOBAL_CATEGORIES.map((c) => c.name) },
    });
    console.log(`🗑  Removed ${result.deletedCount} seeded global categories`);
  },
};
