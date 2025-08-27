import { useRef, useState } from 'react';
import './App.css';

import UploadArea from './components/UploadArea';
import type { UploadAreaHandle } from './components/UploadArea';
import PromptStyleForm from './components/PromptStyleForm';
import SummaryCard from './components/SummaryCard';
import Spinner from './components/Spinner';
import HistoryList from './components/HistoryList';

import { prepareImageDataUrl } from './utils/image';
import { mockGenerate } from './lib/mockApi';
import { runWithRetry } from './lib/retry';
import { useAbortableRequest } from './hooks/useAbortableRequest';
import type { GenerateResponse } from './lib/types';
import { useLocalStorage } from './hooks/useLocalStorage';


export default function App() {
  const uploadRef = useRef<UploadAreaHandle>(null);
  // form + preview
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Editorial');

  // UI state
  const [busy, setBusy] = useState(false); // for image preparation only
  const { start, abort, isPending } = useAbortableRequest(); // for API calls
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  // history (in-memory for now; we’ll persist to localStorage next)
  const [history, setHistory] = useLocalStorage<GenerateResponse[]>('ai-studio-history', []);

  // Handle file selection → downscale → dataURL preview
  async function handleFile(file: File) {
    try {
      setBusy(true);
      const dataUrl = await prepareImageDataUrl(file);
      setImageDataUrl(dataUrl);
    } catch (err: any) {
      alert(err?.message ?? 'Failed to process image');
    } finally {
      setBusy(false);
    }
  }

  // Run mocked generate with retries + abort support
  async function onGenerate() {
    if (!imageDataUrl) return;
    setStatus('loading');
    setError(null);

    try {
      const result = await start((signal) =>
        runWithRetry(
          (s) => mockGenerate({ imageDataUrl, prompt, style: style as any }, { signal: s }),
          { retries: 3, baseDelayMs: 500, signal }
        )
      );

      setStatus('success');
      setHistory((prev) => [result as GenerateResponse, ...prev].slice(0, 5));

      // 🆕 clear form + file input
      setImageDataUrl(null);
      setPrompt('');
      setStyle('Editorial');
      uploadRef.current?.reset();
    } catch (e: any) {
      if (e?.name === 'AbortError') {
        setStatus('idle');
      } else {
        setStatus('error');
        setError(e?.message || 'Something went wrong');
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-bold">AI Studio Mini</h1>
        <p className="text-sm text-slate-600">Upload → Prompt & Style → Generate (mock)</p>
      </header>

      <div className="mx-auto max-w-5xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <UploadArea ref={uploadRef} onFileChosen={handleFile} />

          <PromptStyleForm
            prompt={prompt}
            style={style}
            onPromptChange={setPrompt}
            onStyleChange={setStyle}
          />

          <div className="flex items-center gap-3">
            <button
              data-testid="generate"
              className="rounded-2xl px-4 py-2 bg-indigo-600 text-black font-medium 
              hover:bg-indigo-700 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-indigo-500 
              disabled:opacity-60 disabled:bg-indigo-300 disabled:cursor-not-allowed"
              disabled={!imageDataUrl || !prompt || isPending}
              aria-disabled={!imageDataUrl || !prompt || isPending}
              onClick={onGenerate}
            >
              {status === 'loading' || isPending ? 'Generating…' : 'Generate'}
            </button>

            <button
              data-testid="abort"
              className="rounded-2xl px-4 py-2 border border-red-300 text-red-700 
              font-medium bg-red-50 hover:bg-red-100 
              focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-red-400 
              disabled:opacity-60 disabled:text-red-300 disabled:border-red-200 disabled:bg-red-50 disabled:cursor-not-allowed"
              onClick={abort}
              disabled={!isPending}
              aria-disabled={!isPending}
            >
              Abort
            </button>

            {/* Spinners */}
            {busy && <Spinner />}
            {isPending && <Spinner />}
          </div>

          {/* Accessible status area */}
          <div role="status" aria-live="polite" className="text-sm">
            {isPending && (
              <span className="inline-flex items-center gap-2 text-slate-600">
                <span>Generating…</span>
                <Spinner />
              </span>
            )}
            {status === 'success' && !isPending && (
              <span className="text-green-700">Generation complete.</span>
            )}
            {status === 'error' && (
              <span role="alert" className="text-red-700">
                {error}
              </span>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <SummaryCard imageDataUrl={imageDataUrl} prompt={prompt} style={style} isPending={isPending} />

          <HistoryList
            items={history}
            onSelect={(it) => {
              setImageDataUrl(it.imageUrl);
              setPrompt(it.prompt);
              setStyle(it.style);
            }}
          />
        </div>
      </div>
    </main>
  );
}
