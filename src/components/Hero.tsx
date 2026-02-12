export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-ink via-stone-800 to-amber-950 text-center py-10 px-5 pb-14 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-saffron/15 via-transparent to-transparent opacity-60" />
      
      <span className="relative block text-[3.5rem] mb-3 animate-float">🤔</span>
      
      <h1 className="relative font-mitr text-[2rem] font-bold text-white leading-tight mb-2">
        วันนี้กิน<em className="not-italic text-saffron">อะไรดี</em>?
      </h1>
      
      <p className="relative text-stone-400 text-[0.95rem]">
        สุ่มเมนู • ค้นจากตู้เย็น • คำนวณแคล
      </p>
    </div>
  )
}
