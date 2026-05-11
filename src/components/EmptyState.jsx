export default function EmptyState({ title, message, action }) {
  return (
    <div className="text-center py-12 px-4 bg-white border border-dashed border-stone-300 rounded-lg">
      <h3 className="text-lg font-medium text-stone-800">{title}</h3>
      {message && <p className="text-stone-500 mt-1">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
