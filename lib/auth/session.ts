import { createClient } from '@/lib/supabase/server'

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// JWT payload에서 visibility_radius_m 추출 (Stateless 검증 — Phase 5에서 인코딩 추가)
export function getVisibilityRadius(accessToken: string): number {
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]))
    return typeof payload.visibility_radius_m === 'number' ? payload.visibility_radius_m : 20
  } catch {
    return 20
  }
}
