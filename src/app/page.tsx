// src/app/page.tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MainTabs from "@/components/MainTabs";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      <Header user={user} />
      <Hero />
      <MainTabs userId={user?.id} />
    </div>
  );
}
