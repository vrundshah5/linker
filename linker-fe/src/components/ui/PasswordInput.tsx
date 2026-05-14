import { useState, forwardRef } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { error, ...props },
  ref,
) {
  const [show, setShow] = useState(false)

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div
        className={`w-full bg-input border rounded-xl text-foreground text-sm flex items-center px-4 py-3 gap-3 focus-within:border-primary transition-colors ${
          error ? 'border-danger' : 'border-border'
        }`}
      >
        <Lock className="text-muted-foreground shrink-0 size-5" />
        <input
          ref={ref}
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          {...props}
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-danger font-medium">{error}</p>}
    </div>
  )
})

export default PasswordInput
