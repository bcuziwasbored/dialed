import Nav from './Nav.jsx'

export default function Layout({ children, currentPath }) {
  return (
    <div className="min-h-screen text-stone-900">
      <Nav currentPath={currentPath} />
      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10">{children}</main>
    </div>
  )
}
