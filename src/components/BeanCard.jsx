import FreshnessBadge from './FreshnessBadge.jsx'
import Stars from './Stars.jsx'
import { formatDate } from '../utils/dates.js'

export default function BeanCard({ bean, brewCount = 0, onEdit, onDelete, onSetActive, isActiveEspresso, isActiveDrip }) {
  return (
    <div className="bg-cream-pale rounded-2xl border border-walnut/10 p-5 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-serif text-lg text-walnut leading-tight">{bean.name}</h3>
          {bean.roaster && <div className="text-sm text-toffee">{bean.roaster}</div>}
        </div>
        <span className={`text-xs px-2.5 py-0.5 rounded-full border ${statusStyle(bean.status)}`}>
          {bean.status}
        </span>
      </div>

      <div className="text-xs text-camel space-y-0.5">
        {bean.origin && <div>Origin: {bean.origin}</div>}
        {bean.process && <div>Process: {bean.process}</div>}
        {bean.roast_level && <div>Roast: {bean.roast_level}</div>}
        {bean.roast_date && <div>Roasted: {formatDate(bean.roast_date)}</div>}
      </div>

      <FreshnessBadge roastDate={bean.roast_date} />

      {bean.roaster_notes && (
        <p className="text-sm text-toffee italic">"{bean.roaster_notes}"</p>
      )}

      <div className="flex items-center justify-between mt-1">
        <Stars value={bean.personal_rating} readOnly size="sm" />
        <span className="text-xs text-camel">{brewCount} brew{brewCount === 1 ? '' : 's'}</span>
      </div>

      <div className="flex flex-wrap gap-2 pt-3 border-t border-walnut/10 text-sm">
        <button
          onClick={() => onSetActive('espresso')}
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            isActiveEspresso
              ? 'bg-walnut text-cream-pale'
              : 'bg-cream-soft text-saddle hover:bg-cream'
          }`}
        >
          {isActiveEspresso ? '✓ Espresso bean' : 'Set espresso'}
        </button>
        <button
          onClick={() => onSetActive('drip')}
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            isActiveDrip
              ? 'bg-olive text-cream-pale'
              : 'bg-cream-soft text-olive hover:bg-cream'
          }`}
        >
          {isActiveDrip ? '✓ Drip bean' : 'Set drip'}
        </button>
        <div className="ml-auto flex gap-3">
          <button onClick={onEdit} className="text-toffee hover:text-walnut text-xs">
            Edit
          </button>
          <button onClick={onDelete} className="text-rose-700 hover:text-rose-800 text-xs">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function statusStyle(status) {
  switch (status) {
    case 'active':   return 'bg-sage-light/40 text-olive border-sage/40'
    case 'resting':  return 'bg-camel/20 text-saddle border-camel/40'
    case 'finished': return 'bg-cream-soft text-camel border-camel/30'
    default:         return 'bg-cream-soft text-camel border-camel/30'
  }
}
