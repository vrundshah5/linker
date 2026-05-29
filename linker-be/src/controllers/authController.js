import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import OtpCode from '../models/OtpCode.js';
import { createNotification } from './notificationController.js';

const SALT_ROUNDS = 12;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Send an email.
 * Priority:
 *   1. Brevo HTTP API  — works on Render (no SMTP port blocking)
 *   2. Resend HTTP API — alternative HTTP provider
 *   3. SMTP (nodemailer) — works locally; blocked on most cloud hosts
 *   4. Console fallback — dev only
 */
const sendEmail = async ({ to, subject, html }) => {
  // 1. Brevo HTTP API — recommended for Render/cloud deployments
  if (process.env.BREVO_API_KEY) {
    const senderEmail = process.env.SMTP_USER?.trim() || 'noreply@linker.app';
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Linker', email: senderEmail },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Brevo API error: ${err}`);
    }
    return;
  }

  // 2. Resend HTTP API
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM_EMAIL || 'Linker <onboarding@resend.dev>';
    await resend.emails.send({ from, to, subject, html });
    return;
  }

  // 3. SMTP via nodemailer — works locally, blocked on most cloud hosts
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const port = Number(process.env.SMTP_PORT) || 465;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port,
      secure: port === 465,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user: process.env.SMTP_USER.trim(),
        pass: process.env.SMTP_PASS.replace(/\s/g, ''),
      },
    });
    await transporter.sendMail({
      from: `"Linker" <${process.env.SMTP_USER.trim()}>`,
      to,
      subject,
      html,
    });
    return;
  }

  // 4. Dev console fallback
  console.warn('\n⚠️  No email provider configured — email was NOT sent.');
  const codeMatch = html.match(/\b(\d{6})\b/);
  if (codeMatch) console.log(`🔑 OTP for ${to}: ${codeMatch[1]}\n`);
};

// POST /api/auth/send-otp
export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, data: null, message: 'Email is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, data: null, message: 'Invalid email format' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ success: false, data: null, message: 'Email already in use' });
  }

  // Generate 6-digit OTP and persist to MongoDB (survives server restarts)
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  await OtpCode.findOneAndUpdate(
    { email: email.toLowerCase() },
    { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    { upsert: true },
  );

  try {
    await sendEmail({
      to: email.toLowerCase(),
      subject: 'Your Linker verification code',

      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px">
          <h2 style="color:#1f2937;margin-bottom:8px">Verify your email</h2>
          <p style="color:#6b7280;margin-bottom:24px">Use the code below to complete your Linker account registration. It expires in <strong>10 minutes</strong>.</p>
          <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px">
            <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#4f46e5">${otp}</span>
          </div>
          <p style="color:#9ca3af;font-size:13px">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });
  } catch (emailErr) {
    await OtpCode.deleteOne({ email: email.toLowerCase() });
    console.error('Email send error:', emailErr.message);
    return res.status(500).json({ success: false, data: null, message: `Failed to send verification email: ${emailErr.message}` });
  }

  return res.status(200).json({ success: true, data: null, message: 'Verification code sent to your email' });
};

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// POST /api/auth/signup
export const signup = async (req, res) => {
  const { fullName, email, password, otp } = req.body;

  if (!fullName || !email || !password || !otp) {
    return res.status(400).json({ success: false, data: null, message: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, data: null, message: 'Invalid email format' });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, data: null, message: 'Password must be at least 8 characters' });
  }

  // Verify OTP from MongoDB
  const stored = await OtpCode.findOne({ email: email.toLowerCase() });
  if (!stored) {
    return res.status(400).json({ success: false, data: null, message: 'Please verify your email first' });
  }
  if (new Date() > stored.expiresAt) {
    await OtpCode.deleteOne({ email: email.toLowerCase() });
    return res.status(400).json({ success: false, data: null, message: 'Verification code has expired. Please request a new one.' });
  }
  if (stored.otp !== String(otp)) {
    return res.status(400).json({ success: false, data: null, message: 'Invalid verification code' });
  }
  await OtpCode.deleteOne({ email: email.toLowerCase() });

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ success: false, data: null, message: 'Email already in use' });
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name: fullName.trim(), email: email.toLowerCase(), password: hashed });

  const token = generateToken(user._id);

  // Notify all admins about the new user
  const admins = await User.find({ role: 'admin' }).select('_id');
  await Promise.all(
    admins.map((admin) =>
      createNotification({
        userId: admin._id,
        type: 'new_user',
        title: 'New user registered',
        body: `${fullName.trim()} (${email.toLowerCase()}) just signed up.`,
        meta: { fromUserId: user._id },
      })
    )
  );

  return res.status(201).json({
    success: true,
    data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role, onboardingComplete: user.onboardingComplete, workspaceType: user.workspaceType, workspaces: user.workspaces } },
    message: 'Account created successfully',
  });
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, data: null, message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ success: false, data: null, message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, data: null, message: 'Invalid credentials' });
  }

  if (user.isBanned) {
    return res.status(403).json({ success: false, data: null, message: 'Your account has been suspended. Please contact support.' });
  }

  const token = generateToken(user._id);

  return res.status(200).json({
    success: true,
    data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role, onboardingComplete: user.onboardingComplete, workspaceType: user.workspaceType, workspaces: user.workspaces } },
    message: 'Logged in successfully',
  });
};

// POST /api/auth/google
export const googleAuth = async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ success: false, data: null, message: 'Google access token is required' });
  }

  let googleUser;
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error('Invalid token');
    googleUser = await response.json();
  } catch {
    return res.status(401).json({ success: false, data: null, message: 'Invalid Google access token' });
  }

  const { email, name, sub: googleId } = googleUser;

  if (!email) {
    return res.status(400).json({ success: false, data: null, message: 'Google account has no email' });
  }

  let user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    if (user.isBanned) {
      return res.status(403).json({ success: false, data: null, message: 'Your account has been suspended. Please contact support.' });
    }
  } else {
    // Create new Google user (no password)
    user = await User.create({
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      googleId,
    });

    const admins = await User.find({ role: 'admin' }).select('_id');
    await Promise.all(
      admins.map((admin) =>
        createNotification({
          userId: admin._id,
          type: 'new_user',
          title: 'New user registered',
          body: `${user.name} (${user.email}) just signed up via Google.`,
          meta: { fromUserId: user._id },
        })
      )
    );
  }

  const token = generateToken(user._id);

  return res.status(200).json({
    success: true,
    data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role, onboardingComplete: user.onboardingComplete, workspaceType: user.workspaceType, workspaces: user.workspaces } },
    message: user.createdAt === user.updatedAt ? 'Account created successfully' : 'Logged in successfully',
  });
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, data: null, message: 'Email is required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  // Return same response whether user exists or not to prevent email enumeration
  if (!user) {
    return res.status(200).json({
      success: true,
      data: null,
      message: 'If that email is registered, a reset link has been sent',
    });
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <p>You requested a password reset for your Linker account.</p>
      <p>Click the link below to reset your password. This link expires in <strong>1 hour</strong>.</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });

  return res.status(200).json({
    success: true,
    data: null,
    message: 'If that email is registered, a reset link has been sent',
  });
};

// POST /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, data: null, message: 'New password is required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, data: null, message: 'Password must be at least 6 characters' });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    return res.status(400).json({ success: false, data: null, message: 'Reset token is invalid or has expired' });
  }

  user.password = await bcrypt.hash(password, SALT_ROUNDS);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  return res.status(200).json({
    success: true,
    data: null,
    message: 'Password reset successfully',
  });
};
