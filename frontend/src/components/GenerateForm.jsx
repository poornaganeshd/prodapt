import { useRef } from "react";
import {
  ArrowRight,
  FileText,
  Sparkle,
  UploadSimple,
  Warning,
  X,
} from "@phosphor-icons/react";

import Spinner from "./Spinner";

const ACCEPT = ".pdf,.docx,.txt,.md";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function GenerateForm({
  value,
  onChange,
  mode,
  onModeChange,
  file,
  onFileChange,
  onSubmit,
  loading,
  error,
}) {
  const inputRef = useRef(null);
  const empty = mode === "file" ? !file : value.trim().length === 0;

  function handleSubmit(event) {
    event.preventDefault();

    if (empty || loading) return;

    onSubmit();
  }

  function handleFileSelected(event) {
    const selected = event.target.files?.[0];

    if (selected) onFileChange(selected);

    event.target.value = "";
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3 flex items-center justify-between">
        <div className="inline-flex items-center gap-1 rounded-full border border-[#dedbd3] bg-white p-1">
          <button
            type="button"
            onClick={() => onModeChange("text")}
            disabled={loading}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed ${
              mode === "text"
                ? "bg-[#242321] text-white"
                : "text-[#77736b] hover:text-[#242321]"
            }`}
          >
            Paste text
          </button>

          <button
            type="button"
            onClick={() => onModeChange("file")}
            disabled={loading}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed ${
              mode === "file"
                ? "bg-[#242321] text-white"
                : "text-[#77736b] hover:text-[#242321]"
            }`}
          >
            Upload document
          </button>
        </div>

        {mode === "text" && (
          <span className="text-xs text-[#aaa69d]">
            {value.length} characters
          </span>
        )}
      </div>

      {mode === "text" ? (
        <div className="relative">
          <textarea
            id="idea"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="e.g. A pitch for a smart water bottle that tracks hydration and syncs to a fitness app..."
            rows={7}
            disabled={loading}
            className="w-full resize-y rounded-2xl border border-[#dedbd3] bg-white px-5 py-4 text-[15px] leading-7 text-[#2d2b28] outline-none transition placeholder:text-[#aaa69d] focus:border-[#9a82e8] focus:ring-4 focus:ring-[#eee9ff] disabled:bg-[#f4f2ed] disabled:opacity-60"
          />
        </div>
      ) : (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            onChange={handleFileSelected}
            className="hidden"
          />

          {file ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#dedbd3] bg-white px-5 py-4">
              <span className="flex min-w-0 items-center gap-2 text-sm text-[#2d2b28]">
                <FileText size={18} className="shrink-0 text-[#7658df]" />
                <span className="truncate font-medium">{file.name}</span>
                <span className="shrink-0 text-xs text-[#aaa69d]">
                  {formatSize(file.size)}
                </span>
              </span>

              <button
                type="button"
                onClick={() => onFileChange(null)}
                disabled={loading}
                className="shrink-0 rounded-full p-1.5 text-[#aaa69d] transition hover:bg-[#f4f2ed] hover:text-[#242321] disabled:opacity-50"
                aria-label="Remove file"
              >
                <X size={15} weight="bold" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#dedbd3] bg-white px-5 py-10 text-center transition hover:border-[#9a82e8] hover:bg-[#fcfbf8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee9ff] text-[#7658df]">
                <UploadSimple size={20} />
              </div>

              <div className="text-sm font-semibold text-[#44413c]">
                Click to upload a document
              </div>

              <div className="text-xs text-[#aaa69d]">
                PDF, DOCX, TXT or MD
              </div>
            </button>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#aaa69d]">
          <Sparkle size={13} weight="fill" className="text-[#7658df]" />
          {mode === "text"
            ? "AI will structure your idea into a story"
            : "AI will read your document and build a story from it"}
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <Warning size={18} className="mt-0.5 shrink-0" />

          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={empty || loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#242321] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(36,35,33,0.15)] transition hover:-translate-y-0.5 hover:bg-[#35332f] disabled:cursor-not-allowed disabled:bg-[#d1cec6] disabled:text-[#96928a] disabled:shadow-none"
      >
        {loading ? (
          <>
            <Spinner size={18} />
            Creating...
          </>
        ) : (
          <>
            Continue
            <ArrowRight size={17} />
          </>
        )}
      </button>
    </form>
  );
}
