import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Briefcase, Globe, Loader2, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layouts/AppLayout'
import ConfirmModal from '../components/ui/ConfirmModal'
import PageHeader from '../components/ui/PageHeader'
import { useProfile, useUpdateProfile, useSwitchWorkspace } from '../hooks/useProfile'

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

export default function Profile() {
  const navigate = useNavigate()
  const { data: profile, isLoading } = useProfile()
  const { mutate: saveProfile, isPending: saving } = useUpdateProfile()
  const { mutate: switchWorkspace, isPending: switching } = useSwitchWorkspace()

  const [name, setName]         = useState('')
  const [phone, setPhone]       = useState('')
  const [location, setLocation] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany]   = useState('')
  const [website, setWebsite]   = useState('')
  const [bio, setBio]           = useState('')
  const [search, setSearch]     = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Populate form once profile loads
  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '')
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
    setPhone(profile.phone ?? '')
    setLocation(profile.location ?? '')
    setJobTitle(profile.jobTitle ?? '')
    setCompany(profile.company ?? '')
    setWebsite(profile.website ?? '')
    setBio(profile.bio ?? '')
  }

  function handleSave() {
    saveProfile({ name, phone, location, jobTitle, company, website, bio })
  }

  const isPersonal = profile?.workspaceType === 'personal'
  const hasPro     = profile?.hasProfessionalWorkspace === true

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
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 text-muted-foreground animate-spin" />
            </div>
          ) : (
          <div className="max-w-2xl flex flex-col gap-5">

            {/* Avatar card */}
            <div className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-6">
              <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-primary">
                  {name ? getInitials(name) : '?'}
                </span>
              </div>
              <div>
                <p className="text-base font-bold text-foreground">{name || '—'}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {[jobTitle, company].filter(Boolean).join(' · ') || 'No title set'}
                </p>
                <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  Personal workspace
                </span>
              </div>
            </div>

            {/* Professional workspace prompt — only for personal users who haven't set up pro yet */}
            {isPersonal && !hasPro && (
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-foreground">Want a Professional workspace?</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Collaborate with teams, manage projects, and share resources professionally.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/onboard/professional')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                >
                  Set up <ArrowRight className="size-4" />
                </button>
              </div>
            )}

            {/* Switch workspace — only show if user has both workspaces */}
            {hasPro && isPersonal && (
              <div className="bg-surface border border-border rounded-2xl p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-foreground">Switch to Professional</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    You have a professional workspace set up.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={switching}
                  onClick={() => switchWorkspace('professional')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {switching ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                  Switch
                </button>
              </div>
            )}

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

        {/* Sticky footer */}
        {!isLoading && (
          <div className="sticky bottom-0 bg-background border-t border-border px-8 py-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={saving}
              className="px-6 py-2.5 bg-surface border border-border text-foreground font-semibold text-sm rounded-full hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        )}
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
