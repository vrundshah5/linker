import { type ReactNode } from 'react'
import { Link, Sparkles } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
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
        <div className="w-full max-w-md my-auto">{children}</div>
      </div>
    </div>
  )
}
