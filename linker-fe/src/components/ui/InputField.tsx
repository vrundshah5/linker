import { type ReactNode } from 'react'

interface InputFieldProps {
  id: string
  name: string
  type?: string
  placeholder?: string
  autoComplete?: string
  icon: ReactNode
}

export default function InputField({
  id,
  name,
  type = 'text',
  placeholder,
  autoComplete,
  icon,
}: InputFieldProps) {
  return (
    <div className="w-full bg-input border border-border rounded-xl text-foreground text-sm flex items-center px-4 py-3 gap-3 focus-within:border-primary transition-colors">
      <span className="text-muted-foreground shrink-0 flex items-center justify-center size-5">
        {icon}
      </span>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
      />
    </div>
  )
}
