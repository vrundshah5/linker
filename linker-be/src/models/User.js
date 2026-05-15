import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    // Role
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // Account status
    isBanned: {
      type: Boolean,
      default: false,
    },
    // Onboarding
    onboardingComplete: {
      type: Boolean,
      default: false,
    },
    workspaceType: {
      type: String,
      enum: ['personal', 'professional'],
      default: null,
    },
    onboardingData: {
      // Personal: selected category IDs
      categories: { type: [String], default: [] },
      // Professional: first project details
      projectName: { type: String, default: null },
      projectDescription: { type: String, default: null },
      invitedEmails: { type: [String], default: [] },
      resources: { type: [String], default: [] },
    },
    // Profile fields
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    company: { type: String, default: '' },
    website: { type: String, default: '' },
    bio: { type: String, default: '' },
    // Array of workspace types the user has set up
    workspaces: { type: [String], enum: ['personal', 'professional'], default: [] },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
