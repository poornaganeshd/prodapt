import { useRef } from 'react'
import {
  FileText,
  Sparkle,
  Warning,
  UploadSimple,
  X,
} from '@phosphor-icons/react'
import Spinner from './Spinner'

const ACCEPT = '.pdf,.docx,.txt,.md'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function GenerateForm({
  value,
  onChange,
  onSubmit,
  loading,
  error,
  file,
  onFileChange,
}) {
  const inputRef = useRef(null)
  const noText = value.trim().length === 0
  const canSubmit = !!file || !noText

  function handleSubmit(event) {
    event.preventDefault()
    if (!canSubmit || loading) return
    onSubmit()
  }

  function handleFileSelected(event) {
    const selected = event.target.files?.[0]
    if (selected) onFileChange(selected)
    event.target.value = ''
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
        disabled={loading || !!file}
        className="w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
      />

      <div className="my-4 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        or
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={handleFileSelected}
        className="hidden"
      />

      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2.5">
          <span className="flex min-w-0 items-center gap-2 text-sm text-indigo-800">
            <FileText size={18} className="shrink-0 text-indigo-500" />
            <span className="truncate font-medium">{file.name}</span>
            <span className="shrink-0 text-indigo-400">{formatSize(file.size)}</span>
          </span>
          <button
            type="button"
            onClick={() => onFileChange(null)}
            disabled={loading}
            className="shrink-0 rounded p-1 text-indigo-400 hover:bg-indigo-100 hover:text-indigo-600 disabled:opacity-50"
            aria-label="Remove file"
          >
            <X size={16} weight="bold" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-50"
        >
          <UploadSimple size={18} />
          Upload a document
          <span className="text-slate-400">PDF, DOCX, TXT</span>
        </button>
      )}

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <Warning size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit || loading}
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
            {file ? 'Generate from Document' : 'Generate Presentation'}
          </>
        )}
      </button>
    </form>
  )
}
