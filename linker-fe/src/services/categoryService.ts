const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

export interface CreateCategoryPayload {
  name: string
  description?: string
  themeColor?: string
  icon?: string
}

export interface Category {
  _id: string
  name: string
  description: string
  themeColor: string
  icon: string
  createdAt: string
  updatedAt: string
}

export async function createCategory(payload: CreateCategoryPayload): Promise<Category> {
  const res = await fetch(`${BASE_URL}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.message ?? 'Failed to create category')
  }

  return json.data as Category
}
