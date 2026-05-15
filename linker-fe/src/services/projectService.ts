import api from '../lib/axios'

export interface ProjectMember {
  userId: {
    _id: string
    name: string
    email: string
  }
  role: 'admin' | 'member'
}

export interface Project {
  _id: string
  name: string
  description: string
  ownerId: { _id: string; name: string; email: string }
  members: ProjectMember[]
  color: string
  createdAt: string
  updatedAt: string
}

export interface CreateProjectPayload {
  name: string
  description?: string
  color?: string
}

export interface UpdateProjectPayload {
  name?: string
  description?: string
  color?: string
}

export interface ProjectResourceItem {
  _id: string
  projectId: string
  addedBy: { _id: string; name: string; email: string }
  title: string
  url: string
  createdAt: string
  updatedAt: string
}

export interface ProjectMessageItem {
  _id: string
  projectId: string
  senderId: { _id: string; name: string; email: string }
  text: string
  createdAt: string
  updatedAt: string
}

export const projectService = {
  list: async (): Promise<Project[]> => {
    const { data } = await api.get<{ success: boolean; data: Project[] }>('/projects')
    return data.data
  },

  create: async (payload: CreateProjectPayload): Promise<Project> => {
    const { data } = await api.post<{ success: boolean; data: Project }>('/projects', payload)
    return data.data
  },

  update: async (id: string, payload: UpdateProjectPayload): Promise<Project> => {
    const { data } = await api.patch<{ success: boolean; data: Project }>(`/projects/${id}`, payload)
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`)
  },

  stats: async (id: string): Promise<{ linkCount: number; memberCount: number }> => {
    const { data } = await api.get<{ success: boolean; data: { linkCount: number; memberCount: number } }>(
      `/projects/${id}/stats`
    )
    return data.data
  },

  // Members
  addMember: async (projectId: string, email: string): Promise<Project> => {
    const { data } = await api.post<{ success: boolean; data: Project }>(
      `/projects/${projectId}/members`,
      { email },
    )
    return data.data
  },

  removeMember: async (projectId: string, userId: string): Promise<Project> => {
    const { data } = await api.delete<{ success: boolean; data: Project }>(
      `/projects/${projectId}/members/${userId}`,
    )
    return data.data
  },

  // Resources
  listResources: async (projectId: string): Promise<ProjectResourceItem[]> => {
    const { data } = await api.get<{ success: boolean; data: ProjectResourceItem[] }>(
      `/projects/${projectId}/resources`,
    )
    return data.data
  },

  addResources: async (
    projectId: string,
    resources: { url: string; title: string }[],
  ): Promise<ProjectResourceItem[]> => {
    const { data } = await api.post<{ success: boolean; data: ProjectResourceItem[] }>(
      `/projects/${projectId}/resources`,
      { resources },
    )
    return data.data
  },

  deleteResource: async (projectId: string, resourceId: string): Promise<void> => {
    await api.delete(`/projects/${projectId}/resources/${resourceId}`)
  },

  // Messages
  listMessages: async (projectId: string): Promise<ProjectMessageItem[]> => {
    const { data } = await api.get<{ success: boolean; data: ProjectMessageItem[] }>(
      `/projects/${projectId}/messages`,
    )
    return data.data
  },

  sendMessage: async (projectId: string, text: string): Promise<ProjectMessageItem> => {
    const { data } = await api.post<{ success: boolean; data: ProjectMessageItem }>(
      `/projects/${projectId}/messages`,
      { text },
    )
    return data.data
  },
}
