import { useState, type FormEvent } from 'react'
import { Globe, User, Mail, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/layouts/AuthLayout'
import InputField from '../components/ui/InputField'
import PasswordInput from '../components/ui/PasswordInput'

export default function Signup() {
  const [agreed, setAgreed] = useState(false)

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
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <Globe className="size-[18px]" />
          Sign up with Google
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
        {/* Full Name */}
        <div className="flex flex-col gap-2 mb-6">
          <label htmlFor="fullName" className="text-sm font-bold text-foreground">
            Full Name
          </label>
          <InputField
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            icon={<User className="size-5" />}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2 mb-6">
          <label htmlFor="email" className="text-sm font-bold text-foreground">
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
          <label htmlFor="password" className="text-sm font-bold text-foreground">
            Password
          </label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="Create a password"
            autoComplete="new-password"
          />
        </div>

        {/* Terms checkbox */}
        <div className="flex items-start gap-3 mb-6">
          <button
            type="button"
            role="checkbox"
            aria-checked={agreed}
            onClick={() => setAgreed((v) => !v)}
            className={`size-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full px-4 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          Create Account
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
