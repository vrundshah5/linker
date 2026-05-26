import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Save, User, Mail, Phone, MapPin, Briefcase, Globe, Camera,
  Building2, Loader2, ArrowRightLeft, PlusCircle,
} from 'lucide-react'
import AppLayout from '../components/layouts/AppLayout'
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
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <PageHeader
            title="Profile Settings"
            subtitle="Manage your personal information and preferences."
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
            <div className="flex gap-6 items-start max-w-6xl pb-10">

              {/* ── Left: Avatar + Identity (sticky) ── */}
              <div className="w-64 shrink-0 self-start sticky top-6 flex flex-col gap-4">
                <div className="bg-surface p-6 rounded-2xl shadow-sm flex flex-col items-center text-center">
                  <div className="relative mb-3">
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
                  <h3 className="text-base font-bold text-foreground">{name || '—'}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5 truncate w-full">{profile?.email ?? ''}</p>
                  {(jobTitle || company) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {[jobTitle, company].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    <User className="size-3" />
                    Personal workspace
                  </span>
                  <div className="mt-4 flex gap-2 w-full">
                    <button
                      type="button"
                      onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                      className="flex-1 px-3 py-2 bg-secondary text-primary rounded-xl text-sm font-bold hover:bg-primary/10 transition-colors cursor-pointer"
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
                  <div className="bg-surface p-5 rounded-2xl shadow-sm">
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

                {/* ─── Personal Information ─── */}
                <div className="bg-surface p-6 rounded-2xl shadow-sm">
                  <h2 className="text-lg font-bold text-foreground mb-5">Personal Information</h2>
                  <div className="grid grid-cols-2 gap-4">
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

                {/* ─── Workspace Management ─── */}
                <div className="bg-surface p-6 rounded-2xl shadow-sm">
                  <h2 className="text-lg font-bold text-foreground mb-2">Workspace</h2>
                  <p className="text-sm text-muted-foreground mb-5">
                    You are currently on your <span className="font-bold text-foreground">Personal</span> workspace.
                    {profile && !profile.workspaces.includes('professional')
                      ? ' Set up a Professional workspace to manage projects and collaborate with a team.'
                      : ' Switch to your Professional workspace or stay here.'}
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 p-4 border-2 border-primary/30 bg-primary/5 rounded-2xl">
                      <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <User className="size-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-foreground">Personal Workspace</p>
                        <p className="text-xs text-muted-foreground">Organise links, categories & connections</p>
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg bg-primary text-primary-foreground">Active</span>
                    </div>

                    {profile && profile.workspaces.includes('professional') ? (
                      <div className="flex items-center gap-3 p-4 border border-border bg-background rounded-2xl">
                        <div className="size-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                          <Briefcase className="size-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-foreground">Professional Workspace</p>
                          <p className="text-xs text-muted-foreground">Projects, team chat & resources</p>
                        </div>
                        <button
                          type="button"
                          disabled={isSwitching}
                          onClick={() => switchWorkspace('professional')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-primary text-sm font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                        >
                          {isSwitching ? <Loader2 className="size-4 animate-spin" /> : <ArrowRightLeft className="size-4" />}
                          Switch
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-4 border border-dashed border-border bg-background rounded-2xl">
                        <div className="size-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                          <Briefcase className="size-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-foreground">Professional Workspace</p>
                          <p className="text-xs text-muted-foreground">Not set up yet — manage projects & teams</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate('/onboard/professional')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-primary text-sm font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer shrink-0"
                        >
                          <PlusCircle className="size-4" />
                          Set up
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ─── Email Notifications ─── */}
                <div className="bg-surface p-6 rounded-2xl shadow-sm">
                  <h2 className="text-lg font-bold text-foreground mb-5">Email Notifications</h2>
                  <div className="flex flex-col gap-3">
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
                <div className="bg-danger/5 border border-danger/10 p-6 rounded-2xl mb-6">
                  <h2 className="text-lg font-bold text-danger mb-2">Danger Zone</h2>
                  <p className="text-sm text-danger/80 mb-5 max-w-xl">
                    Permanently delete your account and all of your data. This action cannot be undone.
                  </p>
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
