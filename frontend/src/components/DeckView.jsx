import { useState } from 'react'
import { ChatCircleDots, ImageSquare, Stack } from '@phosphor-icons/react'
import SlideCard from './SlideCard'

function heroImageUrl(title, seed) {
  const prompt = `${title}. Minimal modern presentation cover illustration, soft colors, clean`
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?width=1024&height=384&nologo=true&seed=${seed}`
}

function HeroImage({ title, seed }) {
  const [status, setStatus] = useState('loading')
  if (status === 'error') return null

  return (
    <div className="relative mb-5 h-48 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      {status === 'loading' && (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center text-slate-300">
          <ImageSquare size={32} />
        </div>
      )}
      <img
        src={heroImageUrl(title, seed)}
        alt={title}
        loading="lazy"
        onLoad={() => setStatus('ready')}
        onError={() => setStatus('error')}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          status === 'ready' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}

export default function DeckView({ presentation }) {
  if (!presentation) return null

  const { id, title, deck } = presentation
  const slides = deck?.slides ?? []
  const questions = deck?.audienceQuestions ?? []

  return (
    <section>
      <HeroImage title={title} seed={id ?? 1} />
      <header className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
          <Stack size={16} />
          {slides.length} {slides.length === 1 ? 'slide' : 'slides'}
        </p>
      </header>

      <div className="grid gap-4">
        {slides.map((slide) => (
          <SlideCard key={slide.slideNumber} slide={slide} />
        ))}
      </div>

      {questions.length > 0 && (
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
            <ChatCircleDots size={20} className="text-indigo-600" />
            Possible audience questions
          </h3>
          <ul className="space-y-2">
            {questions.map((question, index) => (
              <li key={index} className="flex gap-2 text-sm text-slate-700">
                <span className="font-medium text-indigo-600">
                  {index + 1}.
                </span>
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
