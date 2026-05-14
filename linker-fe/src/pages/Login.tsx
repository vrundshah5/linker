import { useState, type FormEvent } from 'react'
import { Globe, Mail, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/layouts/AuthLayout'
import InputField from '../components/ui/InputField'
import PasswordInput from '../components/ui/PasswordInput'

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: wire up to auth service
  }

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="mb-8 text-center lg:text-left">
        <h1
          className="text-3xl font-bold text-foreground mb-2"
          style={{ fontFamily: 'var(--font-headings)' }}
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
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <Globe className="size-[18px]" />
          Log in with Google
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
          Or with email
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
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
            name="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            icon={<Mail className="size-5" />}
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
            name="password"
            autoComplete="current-password"
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
              className={`size-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
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
            <span className="text-sm text-muted-foreground">Remember me</span>
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
          className="w-full px-4 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          Sign In
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
