export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  categories: {
    all: ['categories'] as const,
    global: () => [...queryKeys.categories.all, 'global'] as const,
    mine: () => [...queryKeys.categories.all, 'mine'] as const,
  },
  admin: {
    all: ['admin'] as const,
    users: (params?: object) => [...queryKeys.admin.all, 'users', params] as const,
    userDetail: (id: string) => [...queryKeys.admin.all, 'users', id] as const,
    globalCategories: (search?: string) => [...queryKeys.admin.all, 'globalCategories', search] as const,
  },
} as const
