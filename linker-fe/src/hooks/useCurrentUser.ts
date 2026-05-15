/**
 * Returns the logged-in user from localStorage (set on login/signup).
 * Falls back to defaults so the UI never breaks when unauthenticated.
 */
export interface CurrentUser {
  id: string
  name: string
  email: string
  initials: string
  onboardingComplete: boolean
  workspaceType: 'personal' | 'professional' | null
  workspaces: string[]
}

export function useCurrentUser(): CurrentUser {
  try {
    const raw = localStorage.getItem('user')
    if (raw) {
      const user = JSON.parse(raw) as {
        id: string
        name: string
        email: string
        onboardingComplete?: boolean
        workspaceType?: 'personal' | 'professional' | null
        workspaces?: string[]
      }
      const parts = user.name.trim().split(' ')
      const initials = parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : user.name.slice(0, 2).toUpperCase()
      return {
        ...user,
        initials,
        onboardingComplete: user.onboardingComplete ?? false,
        workspaceType: user.workspaceType ?? null,
        workspaces: user.workspaces ?? [],
      }
    }
  } catch {
    // ignore malformed data
  }
  return { id: '', name: '', email: '', initials: '', onboardingComplete: false, workspaceType: null, workspaces: [] }
}
