import { useState, useEffect } from 'react'
import { Save, Camera, Mail, Phone, MapPin, Briefcase, Globe, Loader2 } from 'lucide-react'
import AdminLayout from '../components/layouts/AdminLayout'
import ConfirmModal from '../components/ui/ConfirmModal'
import PageHeader from '../components/ui/PageHeader'
import { AvatarPickerGrid, getAvatarById } from '../components/ui/AvatarPicker'
import { useProfile, useUpdateProfile } from '../hooks/useProfile'

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

export default function AdminProfile() {
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

  function handleDiscard() {
    if (!profile) return
    setName(profile.name ?? '')
    setAvatar(profile.avatar ?? '')
    setPhone(profile.phone ?? '')
    setLocation(profile.location ?? '')
    setJobTitle(profile.jobTitle ?? '')
    setCompany(profile.company ?? '')
    setWebsite(profile.website ?? '')
    setBio(profile.bio ?? '')
  }

  function handleSave() {
    saveProfile({ name, avatar, phone, location, jobTitle, company, website, bio })
  }

  const selectedAvatar = getAvatarById(avatar)
  const isDirty = !!profile && (
    name     !== (profile.name     ?? '') ||
    avatar   !== (profile.avatar   ?? '') ||
    phone    !== (profile.phone    ?? '') ||
    location !== (profile.location ?? '') ||
    jobTitle !== (profile.jobTitle ?? '') ||
    company  !== (profile.company  ?? '') ||
    website  !== (profile.website  ?? '') ||
    bio      !== (profile.bio      ?? '')
  )

  const headerActions = (
    <>
      <button
        type="button"
        onClick={handleDiscard}
        disabled={saving || !isDirty}
        className="px-5 py-2.5 bg-surface border border-border text-foreground font-semibold text-sm rounded-full hover:bg-muted transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Discard
      </button>
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || !isDirty}
        className="flex items-center gap-2 px-5 py-2.5 bg-danger text-white font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        Save Changes
      </button>
    </>
  )

  return (
    <>
    <AdminLayout>
      <div className="h-full flex flex-col overflow-hidden">

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 pb-28">
          <PageHeader
            title="Admin Profile"
            subtitle="Manage your administrator account information."
            actions={headerActions}
          />
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <div className="flex gap-6 items-start max-w-6xl pb-10">

              {/* ── Left: Avatar + Identity (sticky) ── */}
              <div className="w-64 shrink-0 self-start sticky top-6 flex flex-col gap-4">
                <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <div className="size-20 rounded-full overflow-hidden bg-danger/10 flex items-center justify-center border-2 border-background">
                      {selectedAvatar ? (
                        <div className="w-full h-full">{selectedAvatar.node}</div>
                      ) : (
                        <span className="text-2xl font-bold text-danger">
                          {name ? getInitials(name) : '?'}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAvatarPicker((v) => !v)}
                      className="absolute bottom-0 right-0 size-7 bg-danger text-white rounded-full flex items-center justify-center border-2 border-surface hover:scale-105 transition-transform cursor-pointer"
                    >
                      <Camera className="size-3.5" />
                    </button>
                  </div>
                  <p className="text-base font-bold text-foreground">{name || '—'}</p>
                  <p className="text-sm text-muted-foreground mt-0.5 truncate w-full">{profile?.email ?? ''}</p>
                  <span className="mt-3 inline-block px-2.5 py-0.5 rounded-full bg-danger/10 text-danger text-xs font-semibold">
                    Super Admin
                  </span>
                  <div className="mt-4 flex gap-2 w-full">
                    <button
                      type="button"
                      onClick={() => setShowAvatarPicker((v) => !v)}
                      className="flex-1 px-3 py-2 bg-danger/10 text-danger rounded-xl text-sm font-bold hover:bg-danger/20 transition-colors cursor-pointer"
                    >
                      {showAvatarPicker ? 'Close' : 'Change avatar'}
                    </button>
                    {avatar && (
                      <button
                        type="button"
                        onClick={() => setAvatar('')}
                        className="px-3 py-2 text-danger rounded-xl text-sm font-bold hover:bg-danger/10 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {showAvatarPicker && (
                  <div className="bg-surface border border-border rounded-2xl p-5">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Choose Avatar</p>
                    <AvatarPickerGrid
                      selected={avatar}
                      onSelect={(id) => { setAvatar(id); setShowAvatarPicker(false) }}
                    />
                  </div>
                )}
              </div>

              {/* ── Right: Form sections ── */}
              <div className="flex-1 min-w-0 flex flex-col gap-5">

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
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-danger transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">
                        <span className="flex items-center gap-1.5"><Mail className="size-3.5 text-muted-foreground" />Email</span>
                      </label>
                      <input
                        type="email"
                        value={profile?.email ?? ''}
                        readOnly
                        className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm text-muted-foreground cursor-not-allowed"
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
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-danger transition-colors"
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
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-danger transition-colors"
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
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-danger transition-colors"
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
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-danger transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">Company</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-danger transition-colors"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-foreground mb-1.5">Bio</label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-danger transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-danger/5 border border-danger/25 rounded-2xl p-6 mb-6">
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
          )}
        </div>
      </div>
    </AdminLayout>

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
