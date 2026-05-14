import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps {
  id: string
  name: string
  placeholder?: string
  autoComplete?: string
}

export default function PasswordInput({
  id,
  name,
  placeholder = '••••••••',
  autoComplete,
}: PasswordInputProps) {
  const [show, setShow] = useState(false)

  return (
    <div className="w-full bg-input border border-border rounded-xl text-foreground text-sm flex items-center px-4 py-3 gap-3 focus-within:border-primary transition-colors">
      <Lock className="text-muted-foreground shrink-0 size-5" />
      <input
        id={id}
        name={name}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        autoComplete={autoComplete}
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
  )
}
