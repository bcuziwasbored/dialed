import Nav from './Nav.jsx'

export default function Layout({ children, currentPath }) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <Nav currentPath={currentPath} />
      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8">{children}</main>
    </div>
  )
}
