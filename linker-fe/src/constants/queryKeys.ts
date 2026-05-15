export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  admin: {
    all: ['admin'] as const,
    users: (params?: object) => [...queryKeys.admin.all, 'users', params] as const,
  },
} as const
