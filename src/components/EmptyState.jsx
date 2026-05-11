export default function EmptyState({ title, message, action }) {
  return (
    <div className="text-center py-16 px-4 bg-white/60 border border-dashed border-stone-300/80 rounded-3xl">
      <h3 className="text-lg font-medium text-stone-800">{title}</h3>
      {message && <p className="text-stone-500 mt-1">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
