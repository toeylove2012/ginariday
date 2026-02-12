'use client'

import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UserHistory, UserFavourite } from '@/types'
import { MENUS } from '@/lib/data/menus'

export default function ProfileModal({
  user,
  onClose,
  onSignOut,
}: {
  user: User
  onClose: () => void
  onSignOut: () => void
}) {
  const [history, setHistory] = useState<UserHistory[]>([])
  const [favourites, setFavourites] = useState<number[]>([])
  const [totalCal, setTotalCal] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const supabase = createClient()

    // Load history
    const { data: historyData } = await supabase
      .from('user_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    // Load favourites
    const { data: favData } = await supabase
      .from('user_favourites')
      .select('menu_id')

    setHistory(historyData || [])
    setFavourites(favData?.map((f) => f.menu_id) || [])

    // Calculate total calories
    const total = (historyData || [])
      .filter((h) => h.action === 'calorie')
      .reduce((sum, h) => sum + h.calories, 0)
    setTotalCal(total)
  }

  const name = user.user_metadata.name || 'User'
  const email = user.email || ''
  const avatarUrl = user.user_metadata.avatar_url
  const joinedAt = new Date(user.created_at)

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[480px] rounded-t-[28px] overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-ink via-stone-800 to-amber-950 p-8 flex items-center gap-4">
          <div className="w-[60px] h-[60px] rounded-full border-3 border-saffron bg-saffron flex items-center justify-center text-ink font-bold text-2xl overflow-hidden flex-shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="font-mitr text-lg font-bold text-white flex items-center gap-2">
              {name} <span className="text-base">🟢</span>
            </div>
            <div className="text-xs text-stone-400">{email}</div>
            <div className="text-xs text-stone-500 mt-1">
              เข้าร่วมเมื่อ {joinedAt.toLocaleDateString('th-TH')}
            </div>
          </div>
        </div>

        <div className="p-5 pb-10">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            <StatBox label="สุ่มทั้งหมด" value={history.length} />
            <StatBox label="เมนูโปรด" value={favourites.length} />
            <StatBox label="แคลรวม" value={totalCal.toLocaleString()} />
          </div>

          {/* Favourites */}
          <div className="mb-5">
            <h3 className="font-mitr text-xs font-bold text-smoke uppercase tracking-wide mb-3">
              ❤️ เมนูโปรด
            </h3>
            {favourites.length === 0 ? (
              <p className="text-smoke text-sm">
                ยังไม่มีเมนูโปรด กดหัวใจ ❤️ หลังสุ่มเมนูเพื่อบันทึก
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {favourites.map((id) => {
                  const menu = MENUS.find((m) => m.id === id)
                  if (!menu) return null
                  return (
                    <span
                      key={id}
                      className="px-3 py-1.5 bg-amber-50 text-amber-900 rounded-full text-sm font-semibold"
                    >
                      {menu.name}
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {/* History */}
          <div className="mb-5">
            <h3 className="font-mitr text-xs font-bold text-smoke uppercase tracking-wide mb-3">
              🕐 ประวัติล่าสุด
            </h3>
            {history.length === 0 ? (
              <p className="text-smoke text-sm">ยังไม่มีประวัติ</p>
            ) : (
              <div className="space-y-0">
                {history.map((h) => (
                  <HistoryRow key={h.id} item={h} />
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onSignOut}
            className="w-full py-3.5 bg-red-50 text-red-900 rounded-2xl font-bold hover:bg-red-100 transition-colors"
          >
            🚪 ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-amber-50 rounded-2xl p-3 text-center">
      <div className="font-mitr text-2xl font-bold text-saffron">{value}</div>
      <div className="text-[0.72rem] text-smoke">{label}</div>
    </div>
  )
}

function HistoryRow({ item }: { item: UserHistory }) {
  const actionLabels = {
    random: '🎲 สุ่มเมนู',
    calorie: '🔥 คำนวณแคล',
    fridge: '🥚 ตู้เย็น',
  }

  const date = new Date(item.created_at)
  const timeStr = date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const dateStr = date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
  })

  return (
    <div className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
      <div>
        <div className="font-semibold text-sm">{item.menu_name}</div>
        <div className="text-xs text-smoke">
          {actionLabels[item.action]} · {dateStr} {timeStr}
        </div>
      </div>
      <div className="px-2.5 py-1 bg-amber-50 text-amber-900 rounded-full text-xs font-bold">
        {item.calories} kcal
      </div>
    </div>
  )
}
