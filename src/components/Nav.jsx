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
    <nav className="bg-cream-pale/80 backdrop-blur-md border-b border-walnut/10 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-3">
        <a href="#/" className="flex items-baseline gap-0.5 pr-5 shrink-0">
          <span className="font-serif italic text-2xl text-walnut tracking-tight">Dialed</span>
          <span className="text-saddle text-xl">.</span>
        </a>
        <div className="flex gap-0.5 items-center">
          {ITEMS.map((item) => {
            const active = currentPath === item.path
            const baseAccent =
              item.accent === 'espresso'
                ? active
                  ? 'bg-walnut text-cream-pale'
                  : 'text-saddle hover:bg-cream-soft'
                : item.accent === 'drip'
                ? active
                  ? 'bg-olive text-cream-pale'
                  : 'text-olive hover:bg-cream-soft'
                : active
                ? 'bg-ebony text-cream-pale'
                : 'text-walnut/80 hover:bg-cream-soft'
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
