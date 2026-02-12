'use client'

import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import LoginModal from './LoginModal'
import ProfileModal from './ProfileModal'

export default function Header({ user }: { user: User | null }) {
  const router = useRouter()
  const [showLogin, setShowLogin] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const handleSignIn = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) console.error(error)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setShowProfile(false)
    router.refresh()
  }

  return (
    <>
      <header className="bg-ink sticky top-0 z-50 shadow-lg shadow-black/20">
        <div className="max-w-[480px] mx-auto flex items-center justify-between px-5 py-3.5">
          <a href="/" className="font-mitr text-xl font-bold text-saffron tracking-tight">
            กิน<span className="text-white">อะไรดี</span>วันนี้
          </a>

          {!user ? (
            <button
              onClick={handleSignIn}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border-[1.5px] border-white/20 text-white text-sm font-bold hover:bg-saffron/20 hover:border-saffron transition-all"
            >
              <span>👤</span> เข้าสู่ระบบ
            </button>
          ) : (
            <button
              onClick={() => setShowProfile(true)}
              className="w-[34px] h-[34px] rounded-full border-2 border-saffron bg-saffron flex items-center justify-center text-ink font-bold text-base hover:scale-105 transition-transform overflow-hidden"
            >
              {user.user_metadata.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                user.user_metadata.name?.charAt(0).toUpperCase() || '👤'
              )}
            </button>
          )}
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSignIn={handleSignIn} />}
      {showProfile && user && <ProfileModal user={user} onClose={() => setShowProfile(false)} onSignOut={handleSignOut} />}
    </>
  )
}
