import FreshnessBadge from './FreshnessBadge.jsx'
import Stars from './Stars.jsx'
import { formatDate } from '../utils/dates.js'

export default function BeanCard({ bean, brewCount = 0, onEdit, onDelete, onSetActive, isActiveEspresso, isActiveDrip }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-5 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-serif text-lg text-stone-900 leading-tight">{bean.name}</h3>
          {bean.roaster && <div className="text-sm text-stone-500">{bean.roaster}</div>}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusStyle(bean.status)}`}>
          {bean.status}
        </span>
      </div>

      <div className="text-xs text-stone-600 space-y-0.5">
        {bean.origin && <div>Origin: {bean.origin}</div>}
        {bean.process && <div>Process: {bean.process}</div>}
        {bean.roast_level && <div>Roast: {bean.roast_level}</div>}
        {bean.roast_date && <div>Roasted: {formatDate(bean.roast_date)}</div>}
      </div>

      <FreshnessBadge roastDate={bean.roast_date} />

      {bean.roaster_notes && (
        <p className="text-sm text-stone-600 italic">"{bean.roaster_notes}"</p>
      )}

      <div className="flex items-center justify-between mt-1">
        <Stars value={bean.personal_rating} readOnly size="sm" />
        <span className="text-xs text-stone-500">{brewCount} brew{brewCount === 1 ? '' : 's'}</span>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100 text-sm">
        <button
          onClick={() => onSetActive('espresso')}
          className={`px-2 py-1 rounded text-xs ${
            isActiveEspresso
              ? 'bg-amber-900 text-amber-50'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          {isActiveEspresso ? '✓ Espresso bean' : 'Set espresso'}
        </button>
        <button
          onClick={() => onSetActive('drip')}
          className={`px-2 py-1 rounded text-xs ${
            isActiveDrip
              ? 'bg-sky-800 text-sky-50'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          {isActiveDrip ? '✓ Drip bean' : 'Set drip'}
        </button>
        <div className="ml-auto flex gap-2">
          <button onClick={onEdit} className="text-stone-600 hover:text-stone-900 text-xs">
            Edit
          </button>
          <button onClick={onDelete} className="text-rose-600 hover:text-rose-700 text-xs">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function statusStyle(status) {
  switch (status) {
    case 'active':   return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'resting':  return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'finished': return 'bg-stone-100 text-stone-500 border-stone-200'
    default:         return 'bg-stone-100 text-stone-600 border-stone-200'
  }
}
