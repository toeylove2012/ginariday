// src/app/page.tsx
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import TabNav from '@/components/TabNav'
import RandomMenu from '@/components/RandomMenu'
import FridgeFinder from '@/components/FridgeFinder'
import CalorieCalculator from '@/components/CalorieCalculator'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen">
      <Header user={user} />
      <Hero />
      <TabNav />
      
      <main className="max-w-[480px] mx-auto px-4 pb-24">
        <RandomMenu userId={user?.id} />
        <FridgeFinder userId={user?.id} />
        <CalorieCalculator userId={user?.id} />
      </main>
    </div>
  )
}
