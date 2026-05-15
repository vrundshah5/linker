import mongoose from 'mongoose';

const userCategorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    themeColor: {
      type: String,
      default: '#6c5dd3',
    },
    icon: {
      type: String,
      default: 'Folder', // lucide icon name
    },
    // true = was selected from global categories during onboarding
    // false = user created it manually (custom)
    isGlobal: {
      type: Boolean,
      default: false,
    },
    // Reference to the source GlobalCategory (only set when isGlobal: true)
    globalCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GlobalCategory',
      default: null,
    },
    linkCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound index: one entry per user per global category
userCategorySchema.index({ userId: 1, globalCategoryId: 1 }, { unique: false });

const UserCategory = mongoose.model('UserCategory', userCategorySchema);

export default UserCategory;
