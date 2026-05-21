import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { projectService, type CreateProjectPayload, type UpdateProjectPayload } from '../services/projectService'
import { queryKeys } from '../constants/queryKeys'

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: projectService.list,
  })
}

export function useProject(id: string | undefined) {
  const { data: projects, ...rest } = useProjects()
  const project = projects?.find((p) => p._id === id)
  return { ...rest, data: project }
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => projectService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.projects.all })
      toast.success('Project created')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Failed to create project')
    },
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateProjectPayload & { id: string }) =>
      projectService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.projects.all })
      toast.success('Project updated')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Failed to update project')
    },
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.projects.all })
      toast.success('Project deleted')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Failed to delete project')
    },
  })
}

// --- Members ---

export function useAddProjectMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, email }: { projectId: string; email: string }) =>
      projectService.addMember(projectId, email),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.projects.all })
      toast.success('Member added')
    },
  })
}

export function useRemoveProjectMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      projectService.removeMember(projectId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.projects.all })
      toast.success('Member removed')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Failed to remove member')
    },
  })
}

// --- Resources ---

export function useProjectResources(projectId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.projects.resources(projectId ?? ''),
    queryFn: () => projectService.listResources(projectId!),
    enabled: !!projectId,
  })
}

export function useAddProjectResources() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, resources }: { projectId: string; resources: { url: string; title: string }[] }) =>
      projectService.addResources(projectId, resources),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.projects.resources(vars.projectId) })
      toast.success('Resources added')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Failed to add resources')
    },
  })
}

export function useDeleteProjectResource() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, resourceId }: { projectId: string; resourceId: string }) =>
      projectService.deleteResource(projectId, resourceId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.projects.resources(vars.projectId) })
      toast.success('Resource deleted')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Failed to delete resource')
    },
  })
}

export function useUpdateProjectResource() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      projectId,
      resourceId,
      payload,
    }: {
      projectId: string
      resourceId: string
      payload: { title?: string; url?: string }
    }) => projectService.updateResource(projectId, resourceId, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.projects.resources(vars.projectId) })
      toast.success('Resource updated')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Failed to update resource')
    },
  })
}

// --- Messages ---

export function useProjectMessages(projectId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.projects.messages(projectId ?? ''),
    queryFn: () => projectService.listMessages(projectId!),
    enabled: !!projectId,
    refetchInterval: 5000,
  })
}

export function useSendProjectMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, text }: { projectId: string; text: string }) =>
      projectService.sendMessage(projectId, text),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.projects.messages(vars.projectId) })
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || 'Failed to send message')
    },
  })
}
