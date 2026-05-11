export default function EmptyState({ title, message, action }) {
  return (
    <div className="text-center py-16 px-4 bg-cream-pale/60 border border-dashed border-walnut/15 rounded-3xl">
      <h3 className="text-lg font-medium text-walnut">{title}</h3>
      {message && <p className="text-toffee mt-1">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
