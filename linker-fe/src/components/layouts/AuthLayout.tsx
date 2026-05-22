import { type ReactNode } from 'react'
import { Link, Sparkles, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { theme, toggle: toggleTheme } = useTheme()
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-primary p-12 text-primary-foreground relative overflow-hidden">
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="size-10 bg-white text-primary rounded-xl flex items-center justify-center">
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
        <div className="w-full flex justify-end mb-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="size-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </button>
        </div>
        <div className="w-full max-w-md my-auto">{children}</div>
      </div>
    </div>
  )
}
