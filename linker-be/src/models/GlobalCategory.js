import mongoose from 'mongoose';

const globalCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    icon: {
      type: String,
      default: 'Folder', // lucide icon name
    },
    color: {
      type: String,
      default: '#6c5dd3',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const GlobalCategory = mongoose.model('GlobalCategory', globalCategorySchema);

export default GlobalCategory;
