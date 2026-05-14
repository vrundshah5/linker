import { forwardRef, type ReactNode } from 'react'

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode
  error?: string
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
  { icon, error, type = 'text', ...props },
  ref,
) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div
        className={`w-full bg-input border rounded-xl text-foreground text-sm flex items-center px-4 py-3 gap-3 focus-within:border-primary transition-colors ${
          error ? 'border-danger' : 'border-border'
        }`}
      >
        <span className="text-muted-foreground shrink-0 flex items-center justify-center size-5">
          {icon}
        </span>
        <input
          ref={ref}
          type={type}
          {...props}
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
        />
      </div>
      {error && <p className="text-xs text-danger font-medium">{error}</p>}
    </div>
  )
})

export default InputField
