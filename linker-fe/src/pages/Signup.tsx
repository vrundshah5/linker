import { useEffect, useRef, useState } from 'react'
import { User, Mail, Check, RotateCcw } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import AuthLayout from '../components/layouts/AuthLayout'
import InputField from '../components/ui/InputField'
import PasswordInput from '../components/ui/PasswordInput'
import { useSignup } from '../hooks/auth/useSignup'
import { useSendOtp } from '../hooks/auth/useSendOtp'
import { useGoogleAuth } from '../hooks/auth/useGoogleAuth'

const schema = yup.object({
  fullName: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
})

type SignupFormData = yup.InferType<typeof schema>

const OTP_LENGTH = 6
const RESEND_COOLDOWN = 60

export default function Signup() {
  const navigate = useNavigate()
  const [agreed, setAgreed] = useState(false)
  const [agreedError, setAgreedError] = useState(false)
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [pendingData, setPendingData] = useState<SignupFormData | null>(null)
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [otpError, setOtpError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const { mutateAsync: signup, isPending: isSignupPending } = useSignup()
  const { mutateAsync: sendOtp, isPending: isSendingOtp } = useSendOtp()
  const { triggerGoogleLogin, isPending: isGooglePending } = useGoogleAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({ resolver: yupResolver(schema) })

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [resendTimer])

  async function onSubmitForm(data: SignupFormData) {
    if (!agreed) {
      setAgreedError(true)
      return
    }
    await sendOtp(data.email)
    setPendingData(data)
    setOtpDigits(Array(OTP_LENGTH).fill(''))
    setOtpError('')
    setResendTimer(RESEND_COOLDOWN)
    setStep('otp')
  }

  function handleOtpInput(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const digit = value.slice(-1)
    const next = [...otpDigits]
    next[index] = digit
    setOtpDigits(next)
    setOtpError('')
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    e.preventDefault()
    const next = Array(OTP_LENGTH).fill('')
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setOtpDigits(next)
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  async function onVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    const otp = otpDigits.join('')
    if (otp.length < OTP_LENGTH) {
      setOtpError('Please enter the 6-digit code')
      return
    }
    if (!pendingData) return
    await signup({ ...pendingData, otp })
    navigate('/onboard')
  }

  async function handleResend() {
    if (!pendingData || resendTimer > 0) return
    await sendOtp(pendingData.email)
    setOtpDigits(Array(OTP_LENGTH).fill(''))
    setOtpError('')
    setResendTimer(RESEND_COOLDOWN)
    inputRefs.current[0]?.focus()
  }

  if (step === 'otp') {
    return (
      <AuthLayout>
        <div className="mb-8 text-center">
          {/* Envelope illustration */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-125" />
              <div className="relative size-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-10">
                  {/* Envelope body */}
                  <rect x="4" y="12" width="40" height="28" rx="4" fill="currentColor" className="text-primary/20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{stroke: 'rgb(var(--color-primary) / 0.8)'}} />
                  {/* Envelope flap lines */}
                  <path d="M4 16L22 28a4 4 0 004 0L44 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{stroke: 'rgb(var(--color-primary) / 0.9)'}} />
                  {/* Sparkle top-right */}
                  <path d="M38 7 l1 2.5 2.5 1-2.5 1L38 14l-1-2.5L34.5 10.5l2.5-1Z" fill="currentColor" style={{fill: 'rgb(var(--color-primary))'}} />
                  {/* Sparkle small */}
                  <circle cx="8" cy="9" r="1.2" fill="currentColor" style={{fill: 'rgb(var(--color-primary) / 0.6)'}} />
                  <circle cx="12" cy="6" r="0.8" fill="currentColor" style={{fill: 'rgb(var(--color-primary) / 0.4)'}} />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Check your email</h1>
          <p className="text-base text-muted-foreground">
            We sent a 6-digit code to{' '}
            <span className="font-semibold text-foreground">{pendingData?.email}</span>.
            Enter it below to verify your account.
          </p>
        </div>

        <form onSubmit={onVerifyOtp}>
          {/* OTP digit inputs */}
          <div className="flex gap-3 justify-center mb-6">
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpInput(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                onPaste={handleOtpPaste}
                autoFocus={i === 0}
                className={`size-12 text-center text-xl font-bold rounded-xl border bg-background text-foreground outline-none transition-colors
                  ${otpError ? 'border-danger' : digit ? 'border-primary' : 'border-border'}
                  focus:border-primary focus:ring-2 focus:ring-primary/20`}
              />
            ))}
          </div>

          {otpError && (
            <p className="text-xs text-danger font-medium text-center mb-4">{otpError}</p>
          )}

          <button
            type="submit"
            disabled={isSignupPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mb-4"
          >
            {isSignupPending && (
              <svg className="animate-spin size-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {isSignupPending ? 'Creating account...' : 'Verify & Create Account'}
          </button>
        </form>

        {/* Resend */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Didn&apos;t receive the code?{' '}
            {resendTimer > 0 ? (
              <span className="text-muted-foreground">Resend in {resendTimer}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isSendingOtp}
                className="text-primary font-bold hover:underline disabled:opacity-60 cursor-pointer inline-flex items-center gap-1"
              >
                <RotateCcw className="size-3" />
                Resend code
              </button>
            )}
          </p>
        </div>

        {/* Back link */}
        <div className="mt-4 text-center text-sm">
          <button
            type="button"
            onClick={() => setStep('form')}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            ← Back to sign up
          </button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="mb-8 text-center lg:text-left">
        <h1
          className="text-3xl font-bold text-foreground mb-2"
        >
          Create an account
        </h1>
        <p className="text-base text-muted-foreground">
          Start organizing your links today.
        </p>
      </div>

      {/* Social auth */}
      <div className="flex flex-col gap-4 mb-6">
        <button
          type="button"
          onClick={() => triggerGoogleLogin()}
          disabled={isGooglePending}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-[18px] shrink-0">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[11px] text-muted-foreground/80 font-semibold uppercase tracking-widest">
          or with email
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmitForm)}>
        {/* Full Name */}
        <div className="flex flex-col gap-2 mb-6">
          <label htmlFor="fullName" className="text-sm font-bold text-foreground">
            Full Name
          </label>
          <InputField
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            icon={<User className="size-5" />}
            error={errors.fullName?.message}
            {...register('fullName')}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2 mb-6">
          <label htmlFor="email" className="text-sm font-bold text-foreground">
            Email Address
          </label>
          <InputField
            id="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            icon={<Mail className="size-5" />}
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2 mb-6">
          <label htmlFor="password" className="text-sm font-bold text-foreground">
            Password
          </label>
          <PasswordInput
            id="password"
            placeholder="Create a password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        {/* Terms checkbox */}
        <div className="flex items-start gap-3 mb-6">
          <button
            type="button"
            role="checkbox"
            aria-checked={agreed}
            onClick={() => { setAgreed((v) => !v); setAgreedError(false) }}
            className={`size-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
              agreed ? 'bg-primary border-primary' : 'border-border bg-transparent'
            }`}
          >
            {agreed && (
              <Check className="text-primary-foreground size-3" strokeWidth={3} />
            )}
          </button>
          <span className="text-sm text-muted-foreground leading-tight">
            I agree to the{' '}
            <a href="#" className="text-foreground font-bold hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-foreground font-bold hover:underline">
              Privacy Policy
            </a>
            .
          </span>
        </div>
        {agreedError && (
          <p className="text-xs text-danger font-medium -mt-4 mb-4">You must agree to the Terms of Service and Privacy Policy.</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSendingOtp}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSendingOtp && (
            <svg className="animate-spin size-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          )}
          {isSendingOtp ? 'Sending code...' : 'Continue with Email'}
        </button>
      </form>

      {/* Login link */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
