'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Spinner } from '@/components/ui/Spinner'

type Provider = 'google' | 'kakao'

const providers: { id: Provider | 'naver'; label: string; bg: string; color: string }[] = [
  { id: 'kakao', label: '카카오로 시작하기', bg: '#FEE500', color: '#191919' },
  { id: 'naver', label: '네이버로 시작하기', bg: '#03C75A', color: '#fff' },
  { id: 'google', label: 'Google로 시작하기', bg: '#fff', color: '#333' },
]

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()

  const signIn = async (provider: Provider) => {
    setLoading(provider)
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>🌍</div>
        <h1 style={styles.title}>오픈월드</h1>
        <p style={styles.subtitle}>소셜 계정으로 로그인하세요</p>

        <div style={styles.buttons}>
          {providers.map(({ id, label, bg, color }) => (
            <button
              key={id}
              disabled={loading !== null}
              onClick={() => {
                if (id === 'naver') return alert('네이버 로그인은 준비 중입니다.')
                signIn(id as Provider)
              }}
              style={{ ...styles.button, background: bg, color, opacity: loading !== null ? 0.7 : 1 }}
            >
              {loading === id ? <Spinner size={18} /> : label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', background: '#0d0d1a', padding: 16,
  },
  card: {
    background: '#1e1e2e', borderRadius: 16, padding: 40,
    width: '100%', maxWidth: 360, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
  },
  logo: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 32 },
  buttons: { display: 'flex', flexDirection: 'column', gap: 12, width: '100%' },
  button: {
    width: '100%', padding: '14px 20px', borderRadius: 10, border: 'none',
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'opacity 0.15s',
  },
}
