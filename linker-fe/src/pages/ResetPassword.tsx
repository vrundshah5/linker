import { type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AuthLayout from '../components/layouts/AuthLayout'
import PasswordInput from '../components/ui/PasswordInput'

export default function ResetPassword() {
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
          Set new password
        </h1>
        <p className="text-base text-muted-foreground">
          Your new password must be different from previously used passwords.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        {/* New Password */}
        <div className="flex flex-col gap-2 mb-6">
          <label htmlFor="password" className="text-sm font-bold text-foreground">
            New Password
          </label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2 mb-6">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-bold text-foreground"
          >
            Confirm Password
          </label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full px-4 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer mt-2"
        >
          Reset Password
        </button>
      </form>

      {/* Back to login */}
      <div className="text-center text-sm text-muted-foreground">
        <Link
          to="/login"
          className="font-bold hover:text-foreground flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to log in
        </Link>
      </div>
    </AuthLayout>
  )
}
