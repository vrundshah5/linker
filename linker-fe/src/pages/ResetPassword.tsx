import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import AuthLayout from '../components/layouts/AuthLayout'
import PasswordInput from '../components/ui/PasswordInput'
import { useResetPassword } from '../hooks/auth/useResetPassword'

const schema = yup.object({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
})

type ResetPasswordFormData = yup.InferType<typeof schema>

export default function ResetPassword() {
  const navigate = useNavigate()
  const { token } = useParams<{ token: string }>()
  const { mutateAsync } = useResetPassword()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({ resolver: yupResolver(schema) })

  async function onSubmit(data: ResetPasswordFormData) {
    if (!token) return
    await mutateAsync({ token, password: data.password })
    navigate('/login')
  }

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="mb-8 text-center lg:text-left">
        <h1
          className="text-3xl font-bold text-foreground mb-2"
        >
          Set new password
        </h1>
        <p className="text-base text-muted-foreground">
          Your new password must be different from previously used passwords.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        {/* New Password */}
        <div className="flex flex-col gap-2 mb-6">
          <label htmlFor="password" className="text-sm font-bold text-foreground">
            New Password
          </label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
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
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
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
