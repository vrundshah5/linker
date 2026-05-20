import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link, Mail, Link2, Plus, Trash2, X, User } from 'lucide-react'
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
  url: string
}

const INITIAL_MEMBERS: InvitedMember[] = []

const INITIAL_RESOURCES: Resource[] = []

export default function OnboardProfessional() {
  const navigate = useNavigate()
  const user = useCurrentUser()
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteEmailError, setInviteEmailError] = useState('')
  const [members, setMembers] = useState<InvitedMember[]>(INITIAL_MEMBERS)
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES)
  const [newResourceUrl, setNewResourceUrl] = useState('')
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

  function handleRemoveMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  function handleAddResource() {
    const url = newResourceUrl.trim()
    if (!url) return
    setResources((prev) => [...prev, { id: crypto.randomUUID(), url }])
    setNewResourceUrl('')
  }

  function handleRemoveResource(id: string) {
    setResources((prev) => prev.filter((r) => r.id !== id))
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
    <div className="min-h-screen w-full bg-background flex flex-col items-center py-20 px-6">
      {showSplash && (
        <OnboardSplash
          userName={user.name}
          workspaceType="professional"
          onDone={() => navigate('/professional-dashboard')}
        />
      )}
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="size-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-sm">
          <Link className="size-5" />
        </div>
        <span
          className="font-bold text-2xl text-foreground"
          style={{ fontFamily: 'var(--font-headings)' }}
        >
          Linker
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl bg-surface border border-border rounded-3xl p-10 shadow-sm">
        <h1
          className="text-3xl font-bold text-foreground mb-2"
        >
          Set up your Professional Workspace
        </h1>
        <p className="text-base text-muted-foreground mb-10">
          Create your first project to start organizing links and collaborating
          with your team.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          {/* Project Details */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">
              Project Details
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="projectName"
                  className="text-sm font-bold text-foreground"
                >
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  {...register('projectName')}
                  className={`w-full bg-input border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors ${
                    errors.projectName ? 'border-danger' : 'border-border'
                  }`}
                />
                {errors.projectName && (
                  <p className="text-xs text-danger font-medium">{errors.projectName.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="description"
                  className="text-sm font-bold text-foreground"
                >
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
            <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">
              Invite Team Members
            </h3>

            {/* Email input + Invite button */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <div className={`flex-1 bg-input border rounded-xl px-4 py-3 text-sm flex items-center gap-2 focus-within:border-primary transition-colors ${inviteEmailError ? 'border-destructive' : 'border-border'}`}>
                  <Mail className="text-muted-foreground shrink-0 size-[18px]" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => { setInviteEmail(e.target.value); setInviteEmailError('') }}
                    placeholder="colleague@company.com"
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleInvite()
                      }
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleInvite}
                  className="px-5 py-3 bg-secondary text-primary font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors shrink-0 cursor-pointer"
                >
                  Invite
                </button>
              </div>
              {inviteEmailError && (
                <p className="text-xs text-destructive mt-1">{inviteEmailError}</p>
              )}
            </div>

            {/* Members list */}
            <div className="flex flex-col gap-2">
              {/* You (Admin) */}
              <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-surface">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <User className="size-4" />
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    You (Admin)
                  </span>
                </div>
              </div>

              {/* Invited members */}
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border border-border rounded-xl bg-surface"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${member.color}`}
                    >
                      {member.initials}
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {member.email}
                    </span>
                    {member.pending && (
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] uppercase font-bold rounded">
                        Pending
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-muted-foreground hover:text-danger transition-colors cursor-pointer"
                    aria-label={`Remove ${member.email}`}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Initial Resources */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">
              Add Initial Resources
            </h3>
            <div className="flex flex-col gap-2">
              {/* Existing resources */}
              {resources.map((resource) => (
                <div key={resource.id} className="flex items-center gap-2">
                  <div className="flex-1 bg-input border border-border rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                    <Link2 className="text-muted-foreground shrink-0 size-[18px]" />
                    <span className="text-foreground truncate">{resource.url}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveResource(resource.id)}
                    className="p-3 border border-border text-muted-foreground rounded-xl hover:bg-danger/10 hover:text-danger transition-colors shrink-0 cursor-pointer"
                    aria-label="Remove resource"
                  >
                    <Trash2 className="size-[18px]" />
                  </button>
                </div>
              ))}

              {/* New resource input */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-input border border-border rounded-xl px-4 py-3 text-sm flex items-center gap-2 focus-within:border-primary transition-colors">
                  <Link2 className="text-muted-foreground shrink-0 size-[18px]" />
                  <input
                    type="url"
                    value={newResourceUrl}
                    onChange={(e) => setNewResourceUrl(e.target.value)}
                    placeholder="Paste another URL..."
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddResource()
                      }
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddResource}
                  className="p-3 border border-border text-muted-foreground rounded-xl hover:bg-secondary hover:text-primary transition-colors shrink-0 cursor-pointer"
                  aria-label="Add resource"
                >
                  <Plus className="size-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-6 border-t border-border mt-2">
            <button
              type="button"
              onClick={() => navigate('/onboard')}
              className="px-6 py-3 text-muted-foreground font-bold hover:text-foreground transition-colors cursor-pointer"
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSkip}
                disabled={isPending}
                className="px-6 py-3 text-muted-foreground font-bold hover:text-foreground transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPending && (
                  <svg className="animate-spin size-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                )}
                {isPending ? 'Creating...' : 'Create Workspace'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
