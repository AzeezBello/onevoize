export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'finance'

export interface Profile {
  id: string
  full_name: string | null
  role: AdminRole
  avatar_url: string | null
  created_at: string
}
