import { useState } from 'react'
import { Mail, Check } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import AuthLayout from '../components/layouts/AuthLayout'
import InputField from '../components/ui/InputField'
import PasswordInput from '../components/ui/PasswordInput'
import { useLogin } from '../hooks/auth/useLogin'
import { useGoogleAuth } from '../hooks/auth/useGoogleAuth'

const schema = yup.object({
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

type LoginFormData = yup.InferType<typeof schema>

export default function Login() {
  const navigate = useNavigate()
  const [rememberMe, setRememberMe] = useState(false)
  const { mutateAsync: login, isPending } = useLogin()
  const { triggerGoogleLogin, isPending: isGooglePending } = useGoogleAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: yupResolver(schema) })

  async function onSubmit(data: LoginFormData): Promise<void> {
    const res = await login({ email: data.email, password: data.password })
    const { role, onboardingComplete, workspaceType } = res.data.user
    if (role === 'admin') {
      navigate('/admin/overview')
    } else if (!onboardingComplete) {
      navigate('/onboard')
    } else if (workspaceType === 'professional') {
      navigate('/professional-dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="mb-8 text-center lg:text-left">
        <h1
          className="text-3xl font-bold text-foreground mb-2"
        >
          Welcome back
        </h1>
        <p className="text-base text-muted-foreground">
          Please enter your details to sign in.
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
          Log in with Google
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
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div className="flex flex-col gap-2 mb-6">
          <label
            htmlFor="email"
            className="text-sm font-bold text-foreground"
              >
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
          <label
            htmlFor="password"
            className="text-sm font-bold text-foreground"
          >
            Password
          </label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between mb-8 -mt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              role="checkbox"
              aria-checked={rememberMe}
              onClick={() => setRememberMe((v) => !v)}
              className={`size-4 rounded border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                rememberMe
                  ? 'bg-primary border-primary'
                  : 'bg-input border-border'
              }`}
            >
              {rememberMe && (
                <Check
                  className="text-primary-foreground size-3"
                  strokeWidth={3}
                />
              )}
            </button>
            <span className="text-sm text-muted-foreground cursor-pointer" onClick={() => setRememberMe((v) => !v)}>Remember me</span>
          </div>
          <Link
            to="/forgot-password"
            className="text-sm text-primary font-bold hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending && (
            <svg className="animate-spin size-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          )}
          {isPending ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Sign up link */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-primary font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
