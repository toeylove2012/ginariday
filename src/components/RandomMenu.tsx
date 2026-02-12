'use client'

export default function RandomMenu({ userId }: { userId?: string }) {
  return (
    <section id="sec-random" className="mt-6">
      <div className="bg-white rounded-3xl p-5 shadow-md border border-stone-200 mb-4">
        <p className="text-xs font-bold text-smoke uppercase tracking-wide mb-3.5">
          💰 งบประมาณ
        </p>
        {/* Filter chips would go here */}
        <p className="text-sm text-smoke">
          🚧 Component implementation coming soon...
        </p>
      </div>
      <p className="text-center text-sm text-smoke">
        ดู HTML version สำหรับ full implementation
      </p>
    </section>
  )
}
