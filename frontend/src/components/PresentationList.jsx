import { ClockCounterClockwise, CaretRight } from '@phosphor-icons/react'

function formatDate(value) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export default function PresentationList({ items, activeId, onSelect }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <ClockCounterClockwise size={18} className="text-slate-400" />
        My Presentations
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-slate-400">
          Nothing yet. Generate your first presentation.
        </p>
      ) : (
        <ul className="space-y-1">
          {items.map((item) => {
            const active = item.id === activeId
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item.id)}
                  className={`group flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left transition ${
                    active
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {item.title}
                    </span>
                    <span className="block text-xs text-slate-400">
                      {formatDate(item.createdAt)}
                    </span>
                  </span>
                  <CaretRight
                    size={16}
                    className={
                      active ? 'text-indigo-500' : 'text-slate-300'
                    }
                  />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
