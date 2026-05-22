import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, Camera, Mail, Phone, MapPin, Briefcase, Globe, Loader2, User, ArrowRightLeft, PlusCircle } from 'lucide-react'
import WorkspaceLayout from '../components/layouts/WorkspaceLayout'
import PageHeader from '../components/ui/PageHeader'
import ConfirmModal from '../components/ui/ConfirmModal'
import { AvatarPickerGrid, getAvatarById } from '../components/ui/AvatarPicker'
import { useProfile, useUpdateProfile, useSwitchWorkspace } from '../hooks/useProfile'

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

export default function ProfessionalProfile() {
  const navigate = useNavigate()
  const { data: profile, isLoading } = useProfile()
  const { mutate: saveProfile, isPending: saving } = useUpdateProfile()
  const { mutate: switchWorkspace, isPending: isSwitching } = useSwitchWorkspace()

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  return (
    <>
    <WorkspaceLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <PageHeader
            title="My Profile"
            subtitle="Manage your professional information and preferences."
            actions={
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
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  Save Changes
                </button>
              </>
            }
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 text-muted-foreground animate-spin" />
            </div>
          ) : (
          <div className="max-w-2xl flex flex-col gap-5">

            {/* Avatar card */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="flex items-center gap-5 mb-4">
                <div className="relative shrink-0">
                  <div className="size-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border-2 border-background">
                    {selectedAvatar ? (
                      <div className="w-full h-full">{selectedAvatar.node}</div>
                    ) : (
                      <span className="text-xl font-bold text-primary">
                        {name ? getInitials(name) : '?'}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAvatarPicker((v) => !v)}
                    className="absolute bottom-0 right-0 size-6 bg-primary text-white rounded-full flex items-center justify-center border-2 border-surface hover:scale-105 transition-transform cursor-pointer"
                  >
                    <Camera className="size-3" />
                  </button>
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">{name || '—'}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {[jobTitle, company].filter(Boolean).join(' · ') || 'No title set'}
                  </p>
                  <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    Professional workspace
                  </span>
                </div>
              </div>

              {/* Avatar picker (collapsible) */}
              {showAvatarPicker && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Choose Avatar</p>
                  <AvatarPickerGrid
                    selected={avatar}
                    onSelect={(id) => { setAvatar(id); setShowAvatarPicker(false) }}
                  />
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className="mt-3 text-xs text-danger font-semibold hover:underline cursor-pointer"
                    >
                      Remove avatar
                    </button>
                  )}
                </div>
              )}
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
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-warning transition-colors"
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
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-warning transition-colors"
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
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-warning transition-colors"
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
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-warning transition-colors"
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
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-warning transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-warning transition-colors"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Bio</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-warning transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Workspace Management */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-base font-bold text-foreground mb-1.5">Workspace</h2>
              <p className="text-sm text-muted-foreground mb-4">
                You are currently on your <span className="font-bold text-foreground">Professional</span> workspace.
                {profile && !profile.workspaces.includes('personal')
                  ? ' Set up a Personal workspace for your own link library.'
                  : ' Switch to your Personal workspace or stay here.'}
              </p>
              <div className="flex flex-col gap-3">
                {/* Active workspace badge */}
                <div className="flex items-center gap-3 p-4 border-2 border-primary/30 bg-primary/5 rounded-2xl">
                  <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Briefcase className="size-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">Professional Workspace</p>
                    <p className="text-xs text-muted-foreground">Projects, team chat & resources</p>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg bg-primary text-primary-foreground">Active</span>
                </div>

                {/* Personal workspace card */}
                {profile && profile.workspaces.includes('personal') ? (
                  <div className="flex items-center gap-3 p-4 border border-border bg-background rounded-2xl">
                    <div className="size-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                      <User className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">Personal Workspace</p>
                      <p className="text-xs text-muted-foreground">Organise links, categories & connections</p>
                    </div>
                    <button
                      type="button"
                      disabled={isSwitching}
                      onClick={() => switchWorkspace('personal')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-primary text-sm font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                    >
                      {isSwitching ? <Loader2 className="size-4 animate-spin" /> : <ArrowRightLeft className="size-4" />}
                      Switch
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 border border-dashed border-border bg-background rounded-2xl">
                    <div className="size-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                      <User className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">Personal Workspace</p>
                      <p className="text-xs text-muted-foreground">Not set up yet — your personal link library</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/onboard/personal')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-primary text-sm font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer shrink-0"
                    >
                      <PlusCircle className="size-4" />
                      Set up
                    </button>
                  </div>
                )}
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
          )}
        </div>
      </div>
    </WorkspaceLayout>

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
