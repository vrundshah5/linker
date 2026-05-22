import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link, Mail, Link2, Plus, Trash2, X, User, Pencil, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useCompleteProfessionalOnboard } from '../hooks/onboard/useCompleteProfessionalOnboard'
import OnboardSplash from '../components/ui/OnboardSplash'
import { useCurrentUser } from '../hooks/useCurrentUser'

const schema = yup.object({
  projectName: yup
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .notRequired()
    .min(2, 'Project name must be at least 2 characters'),
  description: yup.string().optional(),
})

type ProfessionalFormData = yup.InferType<typeof schema>

interface InvitedMember {
  id: string
  email: string
  initials: string
  color: string
  pending: boolean
}

interface Resource {
  id: string
  title: string
  url: string
  editing?: boolean
  editTitle?: string
  editUrl?: string
}

export default function OnboardProfessional() {
  const navigate = useNavigate()
  const user = useCurrentUser()
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteEmailError, setInviteEmailError] = useState('')
  const [members, setMembers] = useState<InvitedMember[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [resourceError, setResourceError] = useState('')
  const [showSplash, setShowSplash] = useState(false)
  const { mutateAsync: completeOnboard, isPending } = useCompleteProfessionalOnboard()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfessionalFormData>({
    resolver: yupResolver(schema),
    defaultValues: { projectName: '' },
  })

  function handleInvite() {
    const email = inviteEmail.trim()
    if (!email) return
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setInviteEmailError('Enter a valid email address')
      return
    }
    if (members.some((m) => m.email === email)) {
      setInviteEmailError('This email has already been invited')
      return
    }
    setInviteEmailError('')
    const initials = email
      .split('@')[0]
      .split(/[._-]/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? '')
      .join('')
    setMembers((prev) => [
      ...prev,
      { id: email, email, initials, color: 'bg-primary/10 text-primary', pending: true },
    ])
    setInviteEmail('')
  }

  function handleAddResource() {
    const title = newTitle.trim()
    const url = newUrl.trim()
    if (!title || !url) {
      setResourceError('Both title and URL are required')
      return
    }
    setResourceError('')
    setResources((prev) => [...prev, { id: crypto.randomUUID(), title, url }])
    setNewTitle('')
    setNewUrl('')
  }

  function startEditResource(id: string) {
    setResources((prev) =>
      prev.map((r) => r.id === id ? { ...r, editing: true, editTitle: r.title, editUrl: r.url } : r)
    )
  }

  function saveEditResource(id: string) {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id !== id || !r.editing) return r
        const title = (r.editTitle ?? '').trim()
        const url = (r.editUrl ?? '').trim()
        if (!title || !url) return r
        return { ...r, title, url, editing: false }
      })
    )
  }

  async function onSubmit(data: ProfessionalFormData) {
    const projectName = data.projectName?.trim()
    await completeOnboard({
      ...(projectName ? {
        projectName,
        projectDescription: data.description,
        invitedEmails: members.map((m) => m.email),
        resources: resources.map((r) => r.url),
      } : {}),
    })
    setShowSplash(true)
  }

  async function handleSkip() {
    await completeOnboard({})
    setShowSplash(true)
  }

  return (
    <div className="min-h-screen w-full bg-background flex items-start justify-center py-16 px-6">
      {showSplash && (
        <OnboardSplash
          userName={user.name}
          workspaceType="professional"
          onDone={() => navigate('/professional-dashboard')}
        />
      )}

      {/* Two-column layout: form + character */}
      <div className="w-full max-w-5xl flex items-start gap-10">

        {/* ── Character illustration (desktop only) ── */}
        <div className="hidden lg:flex flex-col items-center justify-start pt-16 shrink-0">
          <svg width="180" height="280" viewBox="0 0 180 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {/* Body */}
            <ellipse cx="90" cy="200" rx="48" ry="60" fill="#6366f1" />
            {/* Head */}
            <circle cx="90" cy="100" r="44" fill="#fbbf24" />
            {/* Hair */}
            <ellipse cx="90" cy="62" rx="36" ry="18" fill="#1e1b4b" />
            <ellipse cx="62" cy="75" rx="14" ry="22" fill="#1e1b4b" />
            <ellipse cx="118" cy="75" rx="14" ry="22" fill="#1e1b4b" />
            {/* Eyes */}
            <circle cx="76" cy="98" r="7" fill="white" />
            <circle cx="104" cy="98" r="7" fill="white" />
            <circle cx="78" cy="100" r="4" fill="#1e1b4b" />
            <circle cx="106" cy="100" r="4" fill="#1e1b4b" />
            <circle cx="79" cy="98" r="1.5" fill="white" />
            <circle cx="107" cy="98" r="1.5" fill="white" />
            {/* Smile */}
            <path d="M78 116 Q90 128 102 116" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Left arm (raised thumbs up) */}
            <path d="M42 175 Q20 155 22 130" stroke="#6366f1" strokeWidth="20" strokeLinecap="round" fill="none" />
            {/* Hand */}
            <circle cx="22" cy="126" r="14" fill="#fbbf24" />
            {/* Thumb up */}
            <path d="M22 118 Q26 108 30 112 Q34 116 28 122" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Right arm */}
            <path d="M138 175 Q158 160 155 140" stroke="#6366f1" strokeWidth="20" strokeLinecap="round" fill="none" />
            <circle cx="156" cy="136" r="14" fill="#fbbf24" />
            {/* Watch */}
            <rect x="148" y="132" width="16" height="8" rx="3" fill="#1e1b4b" />
            <rect x="152" y="133" width="8" height="6" rx="1.5" fill="#6366f1" />
            {/* Legs */}
            <path d="M68 255 Q65 270 60 278" stroke="#1e1b4b" strokeWidth="18" strokeLinecap="round" fill="none" />
            <path d="M112 255 Q115 270 120 278" stroke="#1e1b4b" strokeWidth="18" strokeLinecap="round" fill="none" />
            {/* Shoes */}
            <ellipse cx="58" cy="278" rx="16" ry="6" fill="#1e1b4b" />
            <ellipse cx="122" cy="278" rx="16" ry="6" fill="#1e1b4b" />
          </svg>
          <p className="text-sm font-bold text-muted-foreground text-center mt-2">Let's get you set up!</p>
        </div>

        {/* ── Form card ── */}
        <div className="flex-1">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="size-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-sm">
              <Link className="size-5" />
            </div>
            <span className="font-bold text-2xl text-foreground" style={{ fontFamily: 'var(--font-headings)' }}>
              Linker
            </span>
          </div>

          <div className="bg-surface border border-border rounded-3xl p-10 shadow-sm">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Set up your Professional Workspace
            </h1>
            <p className="text-base text-muted-foreground mb-10">
              Create your first project to start organizing links and collaborating with your team.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
              {/* Project Details */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">Project Details</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="projectName" className="text-sm font-bold text-foreground">Project Name</label>
                    <input
                      id="projectName"
                      type="text"
                      {...register('projectName')}
                      className={`w-full bg-input border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors ${errors.projectName ? 'border-danger' : 'border-border'}`}
                    />
                    {errors.projectName && <p className="text-xs text-danger font-medium">{errors.projectName.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="description" className="text-sm font-bold text-foreground">
                      Description <span className="font-medium text-muted-foreground">(Optional)</span>
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      placeholder="Briefly describe what this project is about..."
                      {...register('description')}
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Invite Team Members */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">Invite Team Members</h3>
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`flex-1 bg-input border rounded-xl px-4 py-3 text-sm flex items-center gap-2 focus-within:border-primary transition-colors ${inviteEmailError ? 'border-danger' : 'border-border'}`}>
                      <Mail className="text-muted-foreground shrink-0 size-[18px]" />
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => { setInviteEmail(e.target.value); setInviteEmailError('') }}
                        placeholder="colleague@company.com"
                        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleInvite() } }}
                      />
                    </div>
                    <button type="button" onClick={handleInvite} className="px-5 py-3 bg-secondary text-primary font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors shrink-0 cursor-pointer">
                      Invite
                    </button>
                  </div>
                  {inviteEmailError && <p className="text-xs text-danger mt-1">{inviteEmailError}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-surface">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0"><User className="size-4" /></div>
                      <span className="text-sm font-bold text-foreground">You (Admin)</span>
                    </div>
                  </div>
                  {members.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">No members invited yet. Add colleagues above.</p>
                  )}
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border border-border rounded-xl bg-surface">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${member.color}`}>{member.initials}</div>
                        <span className="text-sm font-bold text-foreground">{member.email}</span>
                        <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] uppercase font-bold rounded">Pending</span>
                      </div>
                      <button type="button" onClick={() => setMembers((p) => p.filter((m) => m.id !== member.id))} className="text-muted-foreground hover:text-danger transition-colors cursor-pointer" aria-label={`Remove ${member.email}`}>
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Initial Resources */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">Add Initial Resources</h3>
                <div className="flex flex-col gap-3">
                  {/* Existing resources */}
                  {resources.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">No resources added yet. Add a link below.</p>
                  )}
                  {resources.map((resource) => (
                    <div key={resource.id} className="flex items-start gap-2 p-3 border border-border rounded-xl bg-surface">
                      {resource.editing ? (
                        <div className="flex-1 flex flex-col gap-2">
                          <input
                            autoFocus
                            value={resource.editTitle ?? ''}
                            onChange={(e) => setResources((p) => p.map((r) => r.id === resource.id ? { ...r, editTitle: e.target.value } : r))}
                            placeholder="Title"
                            className="w-full bg-input border border-border rounded-lg px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                          />
                          <input
                            value={resource.editUrl ?? ''}
                            onChange={(e) => setResources((p) => p.map((r) => r.id === resource.id ? { ...r, editUrl: e.target.value } : r))}
                            placeholder="URL"
                            className="w-full bg-input border border-border rounded-lg px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                          />
                          <div className="flex gap-2">
                            <button type="button" onClick={() => saveEditResource(resource.id)} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 cursor-pointer"><Check className="size-3" />Save</button>
                            <button type="button" onClick={() => setResources((p) => p.map((r) => r.id === resource.id ? { ...r, editing: false } : r))} className="px-3 py-1.5 text-xs font-bold text-muted-foreground rounded-lg hover:bg-muted cursor-pointer"><X className="size-3 inline mr-1" />Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Link2 className="text-muted-foreground shrink-0 size-[18px] mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">{resource.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{resource.url}</p>
                          </div>
                          <button type="button" onClick={() => startEditResource(resource.id)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1 shrink-0">
                            <Pencil className="size-3.5" />
                          </button>
                          <button type="button" onClick={() => setResources((p) => p.filter((r) => r.id !== resource.id))} className="text-muted-foreground hover:text-danger transition-colors cursor-pointer p-1 shrink-0">
                            <Trash2 className="size-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}

                  {/* New resource input */}
                  <div className="flex flex-col gap-2 p-3 border border-dashed border-border rounded-xl">
                    <div className="flex items-center gap-2 bg-input border border-border rounded-xl px-4 py-2.5 text-sm focus-within:border-primary transition-colors">
                      <span className="text-xs font-bold text-muted-foreground w-8 shrink-0">Title</span>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => { setNewTitle(e.target.value); setResourceError('') }}
                        placeholder="e.g. Figma Design"
                        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-input border border-border rounded-xl px-4 py-2.5 text-sm flex items-center gap-2 focus-within:border-primary transition-colors">
                        <Link2 className="text-muted-foreground shrink-0 size-[16px]" />
                        <input
                          type="url"
                          value={newUrl}
                          onChange={(e) => { setNewUrl(e.target.value); setResourceError('') }}
                          placeholder="https://..."
                          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddResource() } }}
                        />
                      </div>
                      <button type="button" onClick={handleAddResource} className="p-3 bg-secondary text-primary border border-border rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors shrink-0 cursor-pointer" aria-label="Add resource">
                        <Plus className="size-[18px]" />
                      </button>
                    </div>
                    {resourceError && <p className="text-xs text-danger">{resourceError}</p>}
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-between pt-6 border-t border-border mt-2">
                <button type="button" onClick={() => navigate('/onboard')} className="px-6 py-3 text-muted-foreground font-bold hover:text-foreground transition-colors cursor-pointer">Back</button>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={handleSkip} disabled={isPending} className="px-6 py-3 text-muted-foreground font-bold hover:text-foreground transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">Skip</button>
                  <button type="submit" disabled={isPending} className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
                    {isPending && <svg className="animate-spin size-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>}
                    {isPending ? 'Creating...' : 'Create Workspace'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
