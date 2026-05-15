import { useState } from 'react'
import { Camera, Mail, Phone, MapPin, Briefcase, Globe } from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import ConfirmModal from '../components/ui/ConfirmModal'
import PageHeader from '../components/ui/PageHeader'

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
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  return (
    <>
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">

        <PageHeader
          title="My Profile"
          subtitle="Manage your personal information and preferences."
          searchValue={search}
          onSearch={setSearch}
        />

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
                onClick={() => setShowDeleteModal(true)}
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

    <ConfirmModal
      open={showDeleteModal}
      title="Delete Account"
      description="Are you sure you want to delete your account? All your data, links, and categories will be permanently removed. This action cannot be undone."
      confirmLabel="Delete Account"
      onConfirm={() => setShowDeleteModal(false)}
      onCancel={() => setShowDeleteModal(false)}
    />
    </>
  )
}
