import { useState } from 'react'
import AdminLayout from '../components/layouts/AdminLayout'
import PageHeader from '../components/ui/PageHeader'

export default function AdminPlatformSettings() {
  const [search, setSearch] = useState('')
  const [platformName, setPlatformName] = useState('Linker')
  const [supportEmail, setSupportEmail] = useState('support@linker.com')
  const [requireEmailVerification, setRequireEmailVerification] = useState(true)
  const [enforce2FA, setEnforce2FA] = useState(true)

  function handleDiscard() {
    setPlatformName('Linker')
    setSupportEmail('support@linker.com')
    setRequireEmailVerification(true)
    setEnforce2FA(true)
  }

  return (
    <AdminLayout>
      <div className="h-full flex flex-col overflow-hidden">

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 pb-28">
          <PageHeader
            title="Platform Settings"
            subtitle="Configure global application settings and security rules."
            searchValue={search}
            onSearch={setSearch}
          />

          {/* General Information */}
          <div className="bg-surface border border-border rounded-2xl p-7 mb-5 max-w-3xl">
            <h2 className="text-base font-bold text-foreground mb-6">General Information</h2>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Support Email
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Security Policies */}
          <div className="bg-surface border border-border rounded-2xl p-7 max-w-3xl">
            <h2 className="text-base font-bold text-foreground mb-2">Security Policies</h2>

            <div className="flex flex-col divide-y divide-border mt-4">
              {[
                {
                  label: 'Require Email Verification',
                  description: 'New users must verify their email before logging in.',
                  value: requireEmailVerification,
                  onChange: setRequireEmailVerification,
                },
                {
                  label: 'Enforce 2FA for Admins',
                  description: 'All admin accounts must use Two-Factor Authentication.',
                  value: enforce2FA,
                  onChange: setEnforce2FA,
                },
              ].map(({ label, description, value, onChange }) => (
                <div key={label} className="flex items-center justify-between py-5 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={value}
                    onClick={() => onChange(!value)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${
                      value ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <span
                      className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 mt-0.5 ${
                        value ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 bg-background border-t border-border px-8 py-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleDiscard}
            className="px-6 py-2.5 bg-surface border border-border text-foreground font-semibold text-sm rounded-full hover:bg-muted transition-colors cursor-pointer"
          >
            Discard Changes
          </button>
          <button
            type="button"
            className="px-6 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
