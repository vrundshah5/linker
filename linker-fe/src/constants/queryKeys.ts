export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  categories: {
    all: ['categories'] as const,
    global: () => [...queryKeys.categories.all, 'global'] as const,
    mine: () => [...queryKeys.categories.all, 'mine'] as const,
    mineByContext: (context: string) => [...queryKeys.categories.all, 'mine', context] as const,
  },
  admin: {
    all: ['admin'] as const,
    stats: () => [...queryKeys.admin.all, 'stats'] as const,
    users: (params?: object) => [...queryKeys.admin.all, 'users', params] as const,
    userDetail: (id: string) => [...queryKeys.admin.all, 'users', id] as const,
    globalCategories: (search?: string) => [...queryKeys.admin.all, 'globalCategories', search] as const,
  },
  links: {
    all: ['links'] as const,
    archived: () => [...queryKeys.links.all, 'archived'] as const,
    favorites: () => [...queryKeys.links.all, 'favorites'] as const,
    recent: () => [...queryKeys.links.all, 'recent'] as const,
    stats: (days: number) => [...queryKeys.links.all, 'stats', days] as const,
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
  messages: {
    all: ['messages'] as const,
    conversations: () => [...['messages'], 'conversations'] as const,
    thread: (userId: string) => [...['messages'], 'thread', userId] as const,
  },
  profile: {
    me: ['profile', 'me'] as const,
  },
  projects: {
    all: ['projects'] as const,
    stats: (id: string) => ['projects', 'stats', id] as const,
    resources: (id: string) => ['projects', 'resources', id] as const,
    messages: (id: string) => ['projects', 'messages', id] as const,
  },
  support: {
    all: ['support'] as const,
    mine: ['support', 'mine'] as const,
    admin: (params?: object) => ['support', 'admin', params] as const,
  },
  mentionBuzz: {
    all: ['mentionBuzz'] as const,
    unread: () => [...(['mentionBuzz'] as const), 'unread'] as const,
    mentions: () => [...(['mentionBuzz'] as const), 'mentions'] as const,
    buzzes: () => [...(['mentionBuzz'] as const), 'buzzes'] as const,
    contacts: () => [...(['mentionBuzz'] as const), 'contacts'] as const,
  },
} as const
