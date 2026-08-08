import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Presentation,
  Sparkle,
} from "@phosphor-icons/react";

import GenerateForm from "./components/GenerateForm";
import DeckView from "./components/DeckView";
import PresentationList from "./components/PresentationList";
import Spinner from "./components/Spinner";

import {
  generatePresentation,
  generateFromFile,
  listPresentations,
  getPresentation,
} from "./api";

export default function App() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("text");
  const [file, setFile] = useState(null);
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState("");
  const [generating, setGenerating] = useState(false);
  const [fetchingDeck, setFetchingDeck] = useState(false);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(null);
  const [items, setItems] = useState([]);

  async function refreshList() {
    try {
      const data = await listPresentations();
      setItems(data ?? []);
    } catch {
      // History is optional while backend is unavailable.
    }
  }

  useEffect(() => {
    refreshList();
  }, []);

  function handleNext() {
    if (mode === "file") {
      if (!file) {
        setError("Please select a document to upload.");
        return;
      }
    } else if (!text.trim()) {
      setError("Tell us a little about what you want to present.");
      return;
    }

    setError(null);
    setStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleGenerate() {
    setError(null);
    setGenerating(true);

    try {
      const result =
        mode === "file"
          ? await generateFromFile(file)
          : await generatePresentation(text);

      setCurrent(result);
      await refreshList();

      setStep(3);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleSelect(id) {
    setError(null);
    setFetchingDeck(true);

    try {
      const result = await getPresentation(id);

      setCurrent(result);
      setStep(3);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setFetchingDeck(false);
    }
  }

  function startOver() {
    setText("");
    setMode("text");
    setFile(null);
    setTemplate("");
    setCurrent(null);
    setError(null);
    setStep(1);
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#242321]">
      {/* NAVBAR */}

      <header className="border-b border-[#dedbd3] bg-[#f7f5f0]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#242321] text-[#f7f5f0]">
              <Presentation size={19} weight="fill" />
            </div>

            <div>
              <div className="text-[15px] font-semibold tracking-tight">
                PresentAI
              </div>

              <div className="text-[10px] uppercase tracking-[0.18em] text-[#85827a]">
                Presentation Studio
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-7 text-sm text-[#6f6c64] sm:flex">
            <span>AI powered</span>

            <span className="h-1.5 w-1.5 rounded-full bg-[#8c6df2]" />

            <span>Build in seconds</span>
          </div>
        </div>
      </header>

      {/* MAIN */}

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {/* PROGRESS */}

        <ProgressBar step={step} />

        {/* PAGE 1 */}

        {step === 1 && (
          <section className="mx-auto max-w-4xl pt-10 sm:pt-16">
            <div className="mb-12 text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ded9cc] bg-white px-4 py-2 text-xs font-medium text-[#6e6a61] shadow-sm">
                <Sparkle size={14} weight="fill" className="text-[#7658df]" />
                AI presentation maker
              </div>

              <h1 className="mx-auto max-w-3xl text-5xl font-semibold leading-[1.03] tracking-[-0.045em] text-[#242321] sm:text-6xl">
                Start with an idea.
                <span className="block text-[#7658df]">
                  We'll shape the story.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#77736b] sm:text-lg">
                Give us a topic, rough notes, or your big idea. PresentAI turns
                it into a polished presentation.
              </p>
            </div>

            <div className="rounded-[28px] border border-[#dedbd3] bg-white p-3 shadow-[0_20px_60px_rgba(40,35,25,0.08)]">
              <div className="rounded-[21px] border border-[#ece9e2] bg-[#fcfbf8] p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee9ff] text-[#7658df]">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-[#2b2926]">
                      What's on your mind?
                    </h2>

                    <p className="mt-0.5 text-xs text-[#96928a]">
                      The more context you give, the better the result.
                    </p>
                  </div>
                </div>

                <GenerateForm
                  value={text}
                  onChange={setText}
                  mode={mode}
                  onModeChange={setMode}
                  file={file}
                  onFileChange={setFile}
                  onSubmit={handleNext}
                  loading={false}
                  error={error}
                />
              </div>
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[#96928a]">
              <span>✦ Business ideas</span>
              <span>✦ Project proposals</span>
              <span>✦ Academic presentations</span>
              <span>✦ Pitch decks</span>
            </div>
          </section>
        )}

        {/* PAGE 2 */}

        {step === 2 && (
          <section className="mx-auto max-w-5xl pt-8 sm:pt-12">
            <button
              onClick={() => {
                setError(null);
                setStep(1);
              }}
              className="mb-10 flex items-center gap-2 text-sm font-medium text-[#77736b] transition hover:text-[#242321]"
            >
              <ArrowLeft size={16} />
              Back to your idea
            </button>

            <div className="mb-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#8c6df2]">
                Step 02
              </p>

              <h1 className="text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                How should it feel?
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-[#77736b]">
                Choose a visual direction. You can always refine the
                presentation later.
              </p>
            </div>

            <TemplateSelection
              template={template}
              setTemplate={setTemplate}
              onBack={() => setStep(1)}
              onGenerate={handleGenerate}
              loading={generating}
              error={error}
            />
          </section>
        )}

        {/* PAGE 3 */}

        {step === 3 && (
          <section className="pt-6">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8c6df2]">
                  Your presentation
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
                  Your story, ready to present.
                </h1>
              </div>

              <button
                onClick={startOver}
                className="flex items-center gap-2 rounded-full border border-[#d8d4cb] bg-white px-5 py-2.5 text-sm font-medium text-[#44413c] shadow-sm transition hover:border-[#bdb8ad] hover:bg-[#fbfaf7]"
              >
                <Sparkle size={15} />
                Create another
              </button>
            </div>

            {generating || fetchingDeck ? (
              <DeckSkeleton />
            ) : current ? (
              <DeckView presentation={current} />
            ) : (
              <div />
            )}
          </section>
        )}
      </main>

      {/* HISTORY */}

      {items.length > 0 && step === 3 && (
        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
          <div className="mb-5 border-t border-[#dedbd3] pt-8">
            <h2 className="text-lg font-semibold">Recent presentations</h2>

            <p className="mt-1 text-sm text-[#858179]">
              Pick up where you left off.
            </p>
          </div>

          <PresentationList
            items={items}
            activeId={current?.id}
            onSelect={handleSelect}
          />
        </section>
      )}
    </div>
  );
}

/* ---------------- PROGRESS ---------------- */

function ProgressBar({ step }) {
  const steps = [
    ["01", "Your idea"],
    ["02", "Style"],
    ["03", "Presentation"],
  ];

  return (
    <div className="mx-auto flex max-w-3xl items-center justify-center">
      {steps.map(([number, title], index) => {
        const currentStep = index + 1;
        const active = step === currentStep;
        const complete = step > currentStep;

        return (
          <div key={number} className="flex flex-1 items-center">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold transition ${
                  active
                    ? "bg-[#242321] text-white"
                    : complete
                      ? "bg-[#dff2e5] text-[#287442]"
                      : "border border-[#d8d4cb] bg-white text-[#99958d]"
                }`}
              >
                {complete ? <Check size={14} weight="bold" /> : number}
              </div>

              <span
                className={`hidden text-xs font-medium sm:block ${
                  active ? "text-[#242321]" : "text-[#99958d]"
                }`}
              >
                {title}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="mx-3 h-px flex-1 bg-[#dedbd3]" />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- TEMPLATES ---------------- */

function TemplateSelection({
  template,
  setTemplate,
  onBack,
  onGenerate,
  loading,
  error,
}) {
  const templates = [
    {
      id: "business",
      title: "Business",
      description: "Confident, structured and persuasive.",
      icon: "▱",
      accent: "#e8e0ff",
      text: "#7356d9",
    },
    {
      id: "education",
      title: "Education",
      description: "Clear hierarchy with room to explain.",
      icon: "◫",
      accent: "#dff0ea",
      text: "#367c66",
    },
    {
      id: "minimal",
      title: "Minimal",
      description: "Quiet, elegant and content-first.",
      icon: "○",
      accent: "#eceae4",
      text: "#66625a",
    },
    {
      id: "creative",
      title: "Creative",
      description: "Expressive layouts with more personality.",
      icon: "✦",
      accent: "#f9e2e8",
      text: "#b64e69",
    },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {templates.map((item) => {
          const selected = template === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setTemplate(item.id)}
              className={`group relative rounded-[22px] border bg-white p-6 text-left transition duration-200 ${
                selected
                  ? "border-[#7658df] shadow-[0_15px_40px_rgba(70,60,50,0.1)]"
                  : "border-[#dedbd3] hover:-translate-y-0.5 hover:border-[#bcb7ad] hover:shadow-[0_12px_30px_rgba(70,60,50,0.06)]"
              }`}
            >
              <div className="mb-7 flex items-start justify-between">
                <div
                  style={{
                    backgroundColor: item.accent,
                    color: item.text,
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                >
                  {item.icon}
                </div>

                {selected && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7658df] text-white">
                    <Check size={14} weight="bold" />
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold">{item.title}</h3>

              <p className="mt-2 max-w-xs text-sm leading-6 text-[#858179]">
                {item.description}
              </p>

              <div
                className={`mt-7 text-xs font-medium ${
                  selected ? "text-[#7658df]" : "text-[#aaa69d]"
                }`}
              >
                {selected ? "Selected" : "Choose this style →"}
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-[#dedbd3] pt-7">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-[#77736b] transition hover:bg-white hover:text-[#242321]"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <button
          onClick={onGenerate}
          disabled={!template || loading}
          className="flex items-center gap-2 rounded-full bg-[#242321] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#363430] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <>
              <Spinner size={17} />
              Creating...
            </>
          ) : (
            <>
              Create presentation
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ---------------- LOADING ---------------- */

function DeckSkeleton() {
  return (
    <div className="rounded-[25px] border border-[#dedbd3] bg-white p-8 shadow-sm">
      <div className="flex items-center gap-3">
        <Spinner size={24} />

        <div>
          <h2 className="font-semibold">Building your presentation...</h2>

          <p className="mt-1 text-sm text-[#858179]">
            Turning your idea into a visual story.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-40 animate-pulse rounded-2xl bg-[#efede7]"
          />
        ))}
      </div>
    </div>
  );
}
