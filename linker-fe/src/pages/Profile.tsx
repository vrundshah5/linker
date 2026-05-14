import { useState } from 'react'
import { Camera, Mail, Phone, MapPin, Briefcase, Globe, Bell } from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'

export default function Profile() {
  const [name, setName] = useState('Jason Doe')
  const [email, setEmail] = useState('jason@example.com')
  const [phone, setPhone] = useState('+1 (555) 234-5678')
  const [location, setLocation] = useState('San Francisco, CA')
  const [jobTitle, setJobTitle] = useState('Product Designer')
  const [company, setCompany] = useState('Acme Corp')
  const [website, setWebsite] = useState('https://jasondoe.com')
  const [bio, setBio] = useState('Passionate about building beautiful products and sharing useful resources with the world.')
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(false)
  const [search, setSearch] = useState('')

  return (
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-8 py-4 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground leading-tight">My Profile</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your personal information and preferences.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl w-52 focus-within:border-primary transition-colors">
              <svg className="size-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground text-sm min-w-0"
              />
            </div>
            <button type="button" className="size-10 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors cursor-pointer">
              <Bell className="size-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-7 pb-28">
          <div className="max-w-2xl flex flex-col gap-5">

            {/* Avatar card */}
            <div className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-6">
              <div className="relative shrink-0">
                <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">JD</span>
                </div>
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                >
                  <Camera className="size-3.5" />
                </button>
              </div>
              <div>
                <p className="text-base font-bold text-foreground">{name || 'Jason Doe'}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{jobTitle} · {company}</p>
                <button type="button" className="mt-2 text-xs font-semibold text-primary hover:opacity-75 transition-opacity cursor-pointer">
                  Change avatar
                </button>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-base font-bold text-foreground mb-5">Personal Information</h2>
              <div className="grid grid-cols-2 gap-4">

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    <span className="flex items-center gap-1.5"><Mail className="size-3.5 text-muted-foreground" />Email</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    <span className="flex items-center gap-1.5"><Phone className="size-3.5 text-muted-foreground" />Phone</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    <span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-muted-foreground" />Location</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    <span className="flex items-center gap-1.5"><Globe className="size-3.5 text-muted-foreground" />Website</span>
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    <span className="flex items-center gap-1.5"><Briefcase className="size-3.5 text-muted-foreground" />Job Title</span>
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Bio</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-base font-bold text-foreground mb-1">Notification Preferences</h2>
              <div className="flex flex-col divide-y divide-border mt-3">
                {[
                  { label: 'Email Notifications', description: 'Receive updates and alerts via email.', value: emailNotifs, onChange: setEmailNotifs },
                  { label: 'Push Notifications', description: 'Get in-app push notifications.', value: pushNotifs, onChange: setPushNotifs },
                ].map(({ label, description, value, onChange }) => (
                  <div key={label} className="flex items-center justify-between py-4 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={value}
                      onClick={() => onChange(!value)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${value ? 'bg-primary' : 'bg-border'}`}
                    >
                      <span className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 mt-0.5 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-danger/5 border border-danger/25 rounded-2xl p-6">
              <h2 className="text-base font-bold text-danger mb-1.5">Danger Zone</h2>
              <p className="text-sm text-danger/70 mb-4">
                Once you delete your account, there is no going back. All your data will be permanently removed.
              </p>
              <button
                type="button"
                className="px-5 py-2.5 bg-danger text-white font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
              >
                Delete Account
              </button>
            </div>

          </div>
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 bg-background border-t border-border px-8 py-4 flex items-center justify-end gap-3">
          <button type="button" className="px-6 py-2.5 bg-surface border border-border text-foreground font-semibold text-sm rounded-full hover:bg-muted transition-colors cursor-pointer">
            Discard Changes
          </button>
          <button type="button" className="px-6 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer">
            Save Changes
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
