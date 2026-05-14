import { useState, type FormEvent } from 'react'
import { Link, Mail, Link2, Plus, Trash2, X, User } from 'lucide-react'

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

const INITIAL_MEMBERS: InvitedMember[] = [
  {
    id: 'sarah',
    email: 'sarah.k@acme.com',
    initials: 'SK',
    color: 'bg-warning/20 text-warning',
    pending: true,
  },
]

const INITIAL_RESOURCES: Resource[] = [
  { id: '1', url: 'https://figma.com/file/acme-redesign' },
]

export default function OnboardProfessional() {
  const [inviteEmail, setInviteEmail] = useState('')
  const [members, setMembers] = useState<InvitedMember[]>(INITIAL_MEMBERS)
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES)
  const [newResourceUrl, setNewResourceUrl] = useState('')

  function handleInvite() {
    const email = inviteEmail.trim()
    if (!email) return
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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: wire up to onboarding service
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center py-20 px-6">
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
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex-1 h-2 bg-primary rounded-full" />
          <div className="flex-1 h-2 bg-primary rounded-full" />
          <div className="flex-1 h-2 bg-muted rounded-full" />
        </div>

        <h1
          className="text-3xl font-bold text-foreground mb-2"
          style={{ fontFamily: 'var(--font-headings)' }}
        >
          Set up your Professional Workspace
        </h1>
        <p className="text-base text-muted-foreground mb-10">
          Create your first project to start organizing links and collaborating
          with your team.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
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
                  name="projectName"
                  type="text"
                  defaultValue="Acme Corp Redesign"
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors"
                />
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
                  name="description"
                  rows={3}
                  placeholder="Briefly describe what this project is about..."
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
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 bg-input border border-border rounded-xl px-4 py-3 text-sm flex items-center gap-2 focus-within:border-primary transition-colors">
                <Mail className="text-muted-foreground shrink-0 size-[18px]" />
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
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
              onClick={() => history.back()}
              className="px-6 py-3 text-muted-foreground font-bold hover:text-foreground transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
