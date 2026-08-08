import { useEffect, useState } from 'react'
import { Presentation, Sparkle } from '@phosphor-icons/react'
import GenerateForm from './components/GenerateForm'
import DeckView from './components/DeckView'
import PresentationList from './components/PresentationList'
import Spinner from './components/Spinner'
import {
  generatePresentation,
  listPresentations,
  getPresentation,
} from './api'

export default function App() {
  const [text, setText] = useState('')
  const [generating, setGenerating] = useState(false)
  const [fetchingDeck, setFetchingDeck] = useState(false)
  const [error, setError] = useState(null)
  const [current, setCurrent] = useState(null)
  const [items, setItems] = useState([])

  async function refreshList() {
    try {
      const data = await listPresentations()
      setItems(data ?? [])
    } catch {
      // A failed history fetch should not block the core flow.
    }
  }

  useEffect(() => {
    refreshList()
  }, [])

  async function handleGenerate() {
    setError(null)
    setGenerating(true)
    try {
      const result = await generatePresentation(text)
      setCurrent(result)
      await refreshList()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      setError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  async function handleSelect(id) {
    if (current && current.id === id) return
    setError(null)
    setFetchingDeck(true)
    try {
      const result = await getPresentation(id)
      setCurrent(result)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      setError(e.message)
    } finally {
      setFetchingDeck(false)
    }
  }

  const showSkeleton = generating || fetchingDeck

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-6 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Presentation size={20} weight="fill" />
          </span>
          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-900">
              Presentation Builder
            </h1>
            <p className="text-xs text-slate-500">
              Turn an idea into a structured deck
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <GenerateForm
            value={text}
            onChange={setText}
            onSubmit={handleGenerate}
            loading={generating}
            error={error}
          />

          {showSkeleton ? (
            <DeckSkeleton />
          ) : current ? (
            <DeckView presentation={current} />
          ) : (
            <EmptyState />
          )}
        </div>

        <aside>
          <PresentationList
            items={items}
            activeId={current?.id}
            onSelect={handleSelect}
          />
        </aside>
      </main>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-16 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
        <Sparkle size={24} weight="fill" />
      </span>
      <p className="text-sm font-medium text-slate-600">
        Your presentation will appear here
      </p>
      <p className="mt-1 text-sm text-slate-400">
        Enter an idea above and click Generate.
      </p>
    </div>
  )
}

function DeckSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <Spinner size={28} className="text-indigo-600" />
        <p className="mt-4 text-sm font-medium text-slate-600">
          Building your presentation…
        </p>
        <p className="mt-1 text-sm text-slate-400">
          This can take a few seconds.
        </p>
      </div>
      <div className="mt-8 space-y-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-xl bg-slate-100"
          />
        ))}
      </div>
    </div>
  )
}
