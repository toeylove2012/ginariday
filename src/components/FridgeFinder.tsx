'use client'

export default function FridgeFinder({ userId }: { userId?: string }) {
  return (
    <section id="sec-fridge" className="mt-6 hidden">
      <div className="bg-white rounded-3xl p-5 shadow-md border border-stone-200 mb-4">
        <p className="text-xs font-bold text-smoke uppercase tracking-wide mb-3.5">
          🧺 เลือกวัตถุดิบในตู้เย็น
        </p>
        <p className="text-sm text-smoke">
          🚧 Component implementation coming soon...
        </p>
      </div>
    </section>
  )
}
