import { FileText, Sparkle, Warning } from '@phosphor-icons/react'
import Spinner from './Spinner'

export default function GenerateForm({
  value,
  onChange,
  onSubmit,
  loading,
  error,
}) {
  const empty = value.trim().length === 0

  function handleSubmit(event) {
    event.preventDefault()
    if (empty || loading) return
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <label
        htmlFor="idea"
        className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
      >
        <FileText size={18} className="text-slate-400" />
        Your idea or topic
      </label>
      <textarea
        id="idea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="e.g. A pitch for a smart water-bottle that tracks hydration and syncs to a fitness app."
        rows={6}
        disabled={loading}
        className="w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
      />

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <Warning size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={empty || loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? (
          <>
            <Spinner size={18} />
            Generating…
          </>
        ) : (
          <>
            <Sparkle size={18} weight="fill" />
            Generate Presentation
          </>
        )}
      </button>
    </form>
  )
}
