import { ChatCircleDots, Stack } from '@phosphor-icons/react'
import SlideCard from './SlideCard'

export default function DeckView({ presentation }) {
  if (!presentation) return null

  const { title, deck } = presentation
  const slides = deck?.slides ?? []
  const questions = deck?.audienceQuestions ?? []

  return (
    <section>
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
