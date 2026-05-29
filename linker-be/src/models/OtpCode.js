import mongoose from 'mongoose';

const otpCodeSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, index: true },
  otp:   { type: String, required: true },
  // MongoDB TTL index — document is auto-deleted after 10 minutes
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

export default mongoose.model('OtpCode', otpCodeSchema);
