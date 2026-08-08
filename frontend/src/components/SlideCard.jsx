import { NotePencil, Image } from '@phosphor-icons/react'

export default function SlideCard({ slide }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">
          {slide.slideNumber}
        </span>
        <h3 className="text-lg font-semibold leading-tight text-slate-900">
          {slide.heading}
        </h3>
      </div>

      <ul className="mb-5 space-y-2 pl-1">
        {slide.bulletPoints?.map((point, index) => (
          <li key={index} className="flex gap-2 text-sm text-slate-700">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-3 border-t border-slate-100 pt-4">
        {slide.speakerNotes && (
          <div className="flex gap-2">
            <NotePencil
              size={16}
              className="mt-0.5 shrink-0 text-slate-400"
            />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Speaker notes
              </p>
              <p className="text-sm text-slate-600">{slide.speakerNotes}</p>
            </div>
          </div>
        )}
        {slide.visualRecommendation && (
          <div className="flex gap-2">
            <Image size={16} className="mt-0.5 shrink-0 text-slate-400" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Visual
              </p>
              <p className="text-sm text-slate-600">
                {slide.visualRecommendation}
              </p>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
