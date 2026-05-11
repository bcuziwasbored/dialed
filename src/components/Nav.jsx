const ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/beans', label: 'Beans' },
  { path: '/log-espresso', label: '+ Espresso' },
  { path: '/log-drip', label: '+ Drip' },
  { path: '/brews', label: 'Brews' },
  { path: '/trends', label: 'Trends' },
  { path: '/data', label: 'Data' },
]

export default function Nav({ currentPath }) {
  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 overflow-x-auto">
        <a href="#/" className="font-bold text-xl py-3 pr-5 text-stone-900 shrink-0 tracking-tight">
          Dialed
        </a>
        <div className="flex gap-1">
          {ITEMS.map((item) => {
            const active = currentPath === item.path
            return (
              <a
                key={item.path}
                href={`#${item.path}`}
                className={`px-3 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  active
                    ? 'border-amber-700 text-stone-900 font-medium'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
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
