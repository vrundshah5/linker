import { type FormEvent } from 'react'
import { Link, Sparkles, Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: wire up to auth service
  }

  return (
    <div className="flex flex-1 w-full bg-background overflow-hidden min-h-screen">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-primary p-12 text-primary-foreground relative overflow-hidden">
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="size-10 bg-surface text-primary rounded-xl flex items-center justify-center">
            <Link className="size-5" />
          </div>
          <span
            className="font-bold text-xl"
            style={{ fontFamily: 'var(--font-headings)' }}
          >
            Linker
          </span>
        </div>

        {/* Tagline */}
        <div className="relative z-10 max-w-md mt-auto">
          <h2
            className="text-4xl font-bold mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-headings)' }}
          >
            Organize your digital life with ease.
          </h2>
          <p
            className="text-lg"
            style={{
              color:
                'color-mix(in oklab, var(--color-primary-foreground) 80%, transparent)',
            }}
          >
            Join thousands of professionals who use Linker to manage their
            resources, bookmarks, and inspiration in one place.
          </p>
        </div>

        {/* Decorative blurs */}
        <div className="absolute top-[-10%] right-[-10%] size-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] size-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />
        <Sparkles
          className="absolute top-1/4 right-1/4 text-white/10 pointer-events-none"
          style={{ width: 160, height: 160 }}
        />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center p-8 lg:p-12 bg-surface overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          {/* Heading */}
          <div className="mb-8 text-center lg:text-left">
            <h1
              className="text-3xl font-bold text-foreground mb-2"
              style={{ fontFamily: 'var(--font-headings)' }}
            >
              Forgot password?
            </h1>
            <p className="text-base text-muted-foreground">
              No worries, we&apos;ll send you reset instructions.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            {/* Email */}
            <div className="flex flex-col gap-2 mb-6">
              <label
                htmlFor="email"
                className="text-sm font-bold text-foreground"
              >
                Email Address
              </label>
              <div className="w-full bg-input border border-border rounded-xl text-foreground text-sm flex items-center px-4 py-3 gap-3 focus-within:border-primary transition-colors">
                <Mail className="text-muted-foreground shrink-0 size-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full px-4 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer mt-2"
            >
              Send Reset Instructions
            </button>
          </form>

          {/* Back to login */}
          <div className="text-center text-sm text-muted-foreground">
            <a
              href="/login"
              className="font-bold hover:text-foreground flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to log in
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
