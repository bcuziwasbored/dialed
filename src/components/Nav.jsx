const ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/beans', label: 'Beans' },
  { path: '/log-espresso', label: '+ Espresso', accent: 'espresso' },
  { path: '/log-drip', label: '+ Drip', accent: 'drip' },
  { path: '/brews', label: 'Brews' },
  { path: '/trends', label: 'Trends' },
  { path: '/data', label: 'Data' },
]

export default function Nav({ currentPath }) {
  return (
    <nav className="bg-[#faf6ee]/85 backdrop-blur-md border-b border-stone-200/60 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-2.5">
        <a href="#/" className="flex items-baseline gap-1 pr-5 shrink-0">
          <span className="font-serif italic text-2xl text-stone-900 tracking-tight">Dialed</span>
          <span className="text-amber-700 text-xl">.</span>
        </a>
        <div className="flex gap-0.5 items-center">
          {ITEMS.map((item) => {
            const active = currentPath === item.path
            const baseAccent =
              item.accent === 'espresso'
                ? active
                  ? 'bg-amber-900 text-amber-50'
                  : 'text-amber-900 hover:bg-amber-100/60'
                : item.accent === 'drip'
                ? active
                  ? 'bg-sky-800 text-sky-50'
                  : 'text-sky-800 hover:bg-sky-100/60'
                : active
                ? 'bg-stone-900 text-stone-50'
                : 'text-stone-700 hover:bg-stone-200/50'
            return (
              <a
                key={item.path}
                href={`#${item.path}`}
                className={`px-3 py-1.5 text-sm whitespace-nowrap rounded-full font-medium transition-colors ${baseAccent}`}
              >
                {item.label}
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
