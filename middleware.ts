import { type NextRequest } from 'next/server'
import { applyAuthMiddleware } from '@/lib/auth/middleware'

export async function middleware(request: NextRequest) {
  return applyAuthMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/health|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
