import { useState } from 'react'
import { Lock, Key, CheckCircle, Loader2 } from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import { useChangePassword } from '../hooks/useProfile'

export default function ChangePassword() {
  const { mutate: changePassword, isPending } = useChangePassword()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleSubmit() {
    if (!currentPassword || !newPassword || !confirmPassword) return
    changePassword(
      { currentPassword, newPassword, confirmPassword },
      {
        onSuccess: () => {
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
        },
      }
    )
  }

  return (
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* ─── Header Card ─── */}
          <div className="bg-surface rounded-2xl p-8 mb-8 shadow-sm">
            <h1
              className="text-3xl font-bold text-foreground mb-2"
              style={{ fontFamily: 'var(--font-headings)' }}
            >
              Change Password
            </h1>
            <p className="text-muted-foreground">
              Update your password to keep your account secure.
            </p>
          </div>

          <div className="max-w-lg flex flex-col gap-8">
            <div className="bg-surface p-8 rounded-2xl shadow-sm flex flex-col">
              <h2 className="text-xl font-bold text-foreground mb-6">Update Password</h2>

              <div className="flex flex-col gap-6 mb-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">Current Password</label>
                  <div className="w-full bg-input border border-border rounded-xl text-sm flex items-center px-4 py-3 gap-3 focus-within:border-primary transition-colors">
                    <Lock className="size-5 text-muted-foreground shrink-0" />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">New Password</label>
                  <div className="w-full bg-input border border-border rounded-xl text-sm flex items-center px-4 py-3 gap-3 focus-within:border-primary transition-colors">
                    <Key className="size-5 text-muted-foreground shrink-0" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create a new password"
                      className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Must be at least 8 characters.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">Confirm New Password</label>
                  <div className="w-full bg-input border border-border rounded-xl text-sm flex items-center px-4 py-3 gap-3 focus-within:border-primary transition-colors">
                    <CheckCircle className="size-5 text-muted-foreground shrink-0" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending || !currentPassword || !newPassword || !confirmPassword}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
