import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserMinus } from 'lucide-react'
import WorkspaceLayout from '../components/layouts/WorkspaceLayout'
import ConfirmModal from '../components/ui/ConfirmModal'
import InviteMemberModal from '../components/ui/InviteMemberModal'
import PageHeader from '../components/ui/PageHeader'
import { useProject, useRemoveProjectMember } from '../hooks/useProjects'
import { useCurrentUser } from '../hooks/useCurrentUser'

const AVATAR_COLORS = [
  'bg-primary/20 text-primary',
  'bg-success/15 text-success',
  'bg-primary/15 text-primary',
  'bg-danger/10 text-danger',
]

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

export default function ProjectTeamMembers() {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: project } = useProject(projectId)
  const currentUser = useCurrentUser()
  const { mutate: removeMember } = useRemoveProjectMember()
  const [search, setSearch] = useState('')
  const [removeTarget, setRemoveTarget] = useState<{ id: string; name: string } | null>(null)
  const [showInvite, setShowInvite] = useState(false)

  const isOwner = project?.ownerId?._id === currentUser.id
  const members = project?.members ?? []

  const visible = members.filter(
    (m) =>
      search.trim() === '' ||
      m.userId.name.toLowerCase().includes(search.toLowerCase()) ||
      m.userId.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <>
    <WorkspaceLayout>
      <div className="h-full flex flex-col overflow-hidden">

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <PageHeader
            title="Team Members"
            subtitle="Manage who has access to this project."
            searchValue={search}
            onSearch={setSearch}
            actions={
              <button
                type="button"
                onClick={() => setShowInvite(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-full hover:opacity-90 transition-opacity cursor-pointer"
              >
                Invite Member
              </button>
            }
          />
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">

            {/* Table header */}
            <div className={`grid ${isOwner ? 'grid-cols-[1fr_220px_160px]' : 'grid-cols-[1fr_220px]'} px-6 py-3 border-b border-border`}>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Member
              </span>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Role
              </span>
              {isOwner && (
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">
                  Actions
                </span>
              )}
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {visible.map((member, idx) => {
                const isYou = member.userId._id === currentUser.id
                const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length]
                const initials = getInitials(member.userId.name)
                const roleLabel = member.role.charAt(0).toUpperCase() + member.role.slice(1)

                return (
                  <div
                    key={member.userId._id}
                    className={`grid ${isOwner ? 'grid-cols-[1fr_220px_160px]' : 'grid-cols-[1fr_220px]'} items-center px-6 py-4`}
                  >
                    {/* Member info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`size-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${avatarColor}`}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">{member.userId.name}</span>
                          {isYou && (
                            <span className="px-2 py-0.5 bg-secondary text-primary text-[10px] font-bold rounded-full tracking-wide">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{member.userId.email}</p>
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <span className="px-4 py-2 bg-surface border border-border rounded-xl text-sm font-semibold text-foreground inline-block">
                        {roleLabel}
                      </span>
                    </div>

                    {/* Actions */}
                    {isOwner && (
                      <div className="flex justify-end">
                        {!isYou && (
                          <button
                            type="button"
                            onClick={() => setRemoveTarget({ id: member.userId._id, name: member.userId.name })}
                            className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-danger transition-colors cursor-pointer"
                          >
                            <UserMinus className="size-4" />
                            Remove
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              {visible.length === 0 && (
                <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                  No members match your search.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>

    <ConfirmModal
      open={removeTarget !== null}
      title="Remove Member"
      description={`Are you sure you want to remove ${removeTarget?.name} from this project? They will lose access immediately.`}
      confirmLabel="Remove"
      onConfirm={() => {
        if (removeTarget && projectId) {
          removeMember({ projectId, userId: removeTarget.id })
        }
        setRemoveTarget(null)
      }}
      onCancel={() => setRemoveTarget(null)}
    />

    {projectId && (
      <InviteMemberModal
        open={showInvite}
        projectId={projectId}
        onClose={() => setShowInvite(false)}
      />
    )}
    </>
  )
}
