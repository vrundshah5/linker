import { Mail, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import AuthLayout from '../components/layouts/AuthLayout'
import InputField from '../components/ui/InputField'
import { useForgotPassword } from '../hooks/auth/useForgotPassword'

const schema = yup.object({
  email: yup.string().email('Enter a valid email address').required('Email is required'),
})

type ForgotPasswordFormData = yup.InferType<typeof schema>

export default function ForgotPassword() {
  const { mutateAsync, isSuccess } = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({ resolver: yupResolver(schema) })

  async function onSubmit(data: ForgotPasswordFormData) {
    await mutateAsync(data.email)
  }

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="mb-8 text-center lg:text-left">
        <h1
          className="text-3xl font-bold text-foreground mb-2"
        >
          Forgot password?
        </h1>
        <p className="text-base text-muted-foreground">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        {isSuccess && (
          <div className="mb-6 px-4 py-3 bg-success/10 border border-success/30 rounded-xl text-sm text-success font-medium">
            Reset instructions sent — check your inbox.
          </div>
        )}
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

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
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
