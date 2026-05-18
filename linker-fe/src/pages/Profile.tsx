import { useState, useEffect } from 'react'
import {
  Save, User, Mail, Phone, MapPin, Briefcase, Globe, Camera,
  Building2, Loader2,
} from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
import ConfirmModal from '../components/ui/ConfirmModal'
import { AvatarPickerGrid, getAvatarById } from '../components/ui/AvatarPicker'
import { useProfile, useUpdateProfile } from '../hooks/useProfile'

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
        enabled ? 'bg-primary shadow-inner' : 'bg-border'
      }`}
    >
      <div
        className={`absolute top-1 size-4 rounded-full transition-all ${
          enabled ? 'right-1 bg-surface shadow-sm' : 'left-1 bg-muted-foreground'
        }`}
      />
    </button>
  )
}

export default function Profile() {
  const { data: profile, isLoading } = useProfile()
  const { mutate: saveProfile, isPending: saving } = useUpdateProfile()

  const [name, setName]         = useState('')
  const [avatar, setAvatar]     = useState('')
  const [phone, setPhone]       = useState('')
  const [location, setLocation] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany]   = useState('')
  const [website, setWebsite]   = useState('')
  const [bio, setBio]           = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  // Notification toggles (UI only)
  const [weeklyNewsletter, setWeeklyNewsletter] = useState(true)
  const [teamActivity, setTeamActivity] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '')
      setAvatar(profile.avatar ?? '')
      setPhone(profile.phone ?? '')
      setLocation(profile.location ?? '')
      setJobTitle(profile.jobTitle ?? '')
      setCompany(profile.company ?? '')
      setWebsite(profile.website ?? '')
      setBio(profile.bio ?? '')
    }
  }, [profile])

  function handleSave() {
    saveProfile({ name, avatar, phone, location, jobTitle, company, website, bio })
  }

  const selectedAvatar = getAvatarById(avatar)

  return (
    <>
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 text-muted-foreground animate-spin" />
            </div>
          ) : (
          <>
            {/* ─── Header Card ─── */}
            <div className="bg-surface rounded-2xl p-8 mb-8 shadow-sm flex items-center justify-between">
              <div>
                <h1
                  className="text-3xl font-bold text-foreground mb-2"
                  style={{ fontFamily: 'var(--font-headings)' }}
                >
                  Profile Settings
                </h1>
                <p className="text-muted-foreground">
                  Manage your personal information and preferences.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
              >
                {saving ? <Loader2 className="size-[18px] animate-spin" /> : <Save className="size-[18px]" />}
                Save Changes
              </button>
            </div>

            <div className="max-w-4xl flex flex-col gap-8">
              {/* ─── Personal Information ─── */}
              <div className="bg-surface p-8 rounded-2xl shadow-sm flex flex-col">
                <h2 className="text-xl font-bold text-foreground mb-6">Personal Information</h2>

                {/* Avatar section */}
                <div className="flex items-center gap-8 mb-8 pb-8 border-b border-border">
                  <div className="relative shrink-0">
                    <div className="size-24 rounded-full border-4 border-background overflow-hidden bg-primary/10 flex items-center justify-center">
                      {selectedAvatar ? (
                        <div className="w-full h-full">{selectedAvatar.node}</div>
                      ) : (
                        <span className="text-2xl font-bold text-primary">
                          {name ? getInitials(name) : '?'}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                      className="absolute bottom-0 right-0 size-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-2 border-surface hover:scale-105 transition-transform cursor-pointer"
                    >
                      <Camera className="size-[14px]" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-1">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Choose an avatar that represents you.
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                        className="px-5 py-2.5 bg-secondary text-primary rounded-xl text-sm font-bold hover:bg-primary/10 transition-colors cursor-pointer"
                      >
                        Change
                      </button>
                      {avatar && (
                        <button
                          type="button"
                          onClick={() => setAvatar('')}
                          className="px-5 py-2.5 text-danger rounded-xl text-sm font-bold hover:bg-danger/10 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Avatar picker (collapsible) */}
                {showAvatarPicker && (
                  <div className="mb-8 pb-8 border-b border-border">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Choose Avatar</p>
                    <AvatarPickerGrid
                      selected={avatar}
                      onSelect={(id) => { setAvatar(id); setShowAvatarPicker(false) }}
                    />
                  </div>
                )}

                {/* Form fields */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-bold text-foreground">Full Name</label>
                    <div className="w-full bg-input border border-border rounded-xl text-sm flex items-center px-4 py-3 gap-3 focus-within:border-primary transition-colors">
                      <User className="size-5 text-muted-foreground shrink-0" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                      />
                    </div>
                  </div>

                  <div className="col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-bold text-foreground">Email Address</label>
                    <div className="w-full bg-input border border-border rounded-xl text-sm flex items-center px-4 py-3 gap-3">
                      <Mail className="size-5 text-muted-foreground shrink-0" />
                      <input
                        type="email"
                        value={profile?.email ?? ''}
                        readOnly
                        className="flex-1 bg-transparent outline-none text-muted-foreground cursor-not-allowed min-w-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-foreground">Phone</label>
                    <div className="w-full bg-input border border-border rounded-xl text-sm flex items-center px-4 py-3 gap-3 focus-within:border-primary transition-colors">
                      <Phone className="size-5 text-muted-foreground shrink-0" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Your phone number"
                        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-foreground">Location</label>
                    <div className="w-full bg-input border border-border rounded-xl text-sm flex items-center px-4 py-3 gap-3 focus-within:border-primary transition-colors">
                      <MapPin className="size-5 text-muted-foreground shrink-0" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, Country"
                        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-foreground">Job Title / Role</label>
                    <div className="w-full bg-input border border-border rounded-xl text-sm flex items-center px-4 py-3 gap-3 focus-within:border-primary transition-colors">
                      <Briefcase className="size-5 text-muted-foreground shrink-0" />
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Your role"
                        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-foreground">Company</label>
                    <div className="w-full bg-input border border-border rounded-xl text-sm flex items-center px-4 py-3 gap-3 focus-within:border-primary transition-colors">
                      <Building2 className="size-5 text-muted-foreground shrink-0" />
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Your company"
                        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                      />
                    </div>
                  </div>

                  <div className="col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-bold text-foreground">Website</label>
                    <div className="w-full bg-input border border-border rounded-xl text-sm flex items-center px-4 py-3 gap-3 focus-within:border-primary transition-colors">
                      <Globe className="size-5 text-muted-foreground shrink-0" />
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                      />
                    </div>
                  </div>

                  <div className="col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-bold text-foreground">Bio</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself"
                      className="w-full bg-input border border-border rounded-xl text-sm text-foreground px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* ─── Email Notifications ─── */}
              <div className="bg-surface p-8 rounded-2xl shadow-sm flex flex-col">
                <h2 className="text-xl font-bold text-foreground mb-6">Email Notifications</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 bg-background rounded-2xl">
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-1">Weekly Newsletter</h4>
                      <p className="text-xs text-muted-foreground">
                        Get a weekly digest of top saved links in your network.
                      </p>
                    </div>
                    <Toggle enabled={weeklyNewsletter} onToggle={() => setWeeklyNewsletter((v) => !v)} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background rounded-2xl">
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-1">Team Activity</h4>
                      <p className="text-xs text-muted-foreground">
                        Receive emails when someone mentions you or shares a link.
                      </p>
                    </div>
                    <Toggle enabled={teamActivity} onToggle={() => setTeamActivity((v) => !v)} />
                  </div>

                  <div className={`flex items-center justify-between p-4 rounded-2xl ${marketingEmails ? 'bg-background' : 'bg-surface border border-border'}`}>
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-1">Marketing Emails</h4>
                      <p className="text-xs text-muted-foreground">
                        Receive updates about new features and promotions.
                      </p>
                    </div>
                    <Toggle enabled={marketingEmails} onToggle={() => setMarketingEmails((v) => !v)} />
                  </div>
                </div>
              </div>

              {/* ─── Danger Zone ─── */}
              <div className="bg-danger/5 border border-danger/10 p-8 rounded-2xl flex flex-col mb-10">
                <h2 className="text-xl font-bold text-danger mb-2">Danger Zone</h2>
                <p className="text-sm text-danger/80 mb-6 max-w-xl">
                  Permanently delete your account and all of your data. This action cannot be undone.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-3 bg-danger text-primary-foreground rounded-xl text-sm font-bold hover:bg-danger/90 transition-colors shadow-sm cursor-pointer"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </>
          )}
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
