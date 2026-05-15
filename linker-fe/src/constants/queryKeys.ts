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
  links: {
    all: ['links'] as const,
    byCategory: (categoryId: string) => [...queryKeys.links.all, 'byCategory', categoryId] as const,
  },
  publicCollection: {
    all: ['publicCollection'] as const,
    byUser: (userId: string) => [...queryKeys.publicCollection.all, userId] as const,
  },
  notifications: {
    all: ['notifications'] as const,
  },
  requests: {
    all: ['requests'] as const,
  },
} as const
