import { useState, type FormEvent } from 'react'
import { Link, Sparkles, GitFork, Globe, Mail, Lock, Check } from 'lucide-react'

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false)

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
              <GitFork className="size-[18px]" />
              Log in with GitHub
            </button>
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

            {/* Password */}
            <div className="flex flex-col gap-2 mb-6">
              <label
                htmlFor="password"
                className="text-sm font-bold text-foreground"
              >
                Password
              </label>
              <div className="w-full bg-input border border-border rounded-xl text-foreground text-sm flex items-center px-4 py-3 gap-3 focus-within:border-primary transition-colors">
                <Lock className="text-muted-foreground shrink-0 size-5" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                />
              </div>
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
                <span className="text-sm text-muted-foreground">
                  Remember me
                </span>
              </div>
              <a
                href="/forgot-password"
                className="text-sm text-primary font-bold hover:underline"
              >
                Forgot password?
              </a>
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
              <a href="/signup" className="text-primary font-bold hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
