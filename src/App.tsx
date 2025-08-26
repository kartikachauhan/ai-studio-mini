import { useState } from 'react';
import UploadArea from './components/UploadArea';
import PromptStyleForm from './components/PromptStyleForm';
import SummaryCard from './components/SummaryCard';
import Spinner from './components/Spinner';
import HistoryList from './components/HistoryList';
import { prepareImageDataUrl } from './utils/image';

export default function App() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Editorial');
  const [busy, setBusy] = useState(false);

  // stub history for now
  const [history] = useState<any[]>([]);

  // for now, when a file is chosen we just create a temporary preview URL
  async function handleFile(file: File) {
    try {
      setBusy(true);
      const dataUrl = await prepareImageDataUrl(file); // downscale → dataURL
      setImageDataUrl(dataUrl);
    } catch (err: any) {
      alert(err?.message ?? 'Failed to process image');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 text-slate-900">
      <header className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-bold">AI Studio Mini</h1>
        <p className="text-sm text-slate-600">Upload → Prompt & Style → Generate (mock)</p>
      </header>

      <div className="mx-auto max-w-5xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <UploadArea onFileChosen={handleFile} />
          <PromptStyleForm
            prompt={prompt}
            style={style}
            onPromptChange={setPrompt}
            onStyleChange={setStyle}
          />
          <button
            data-testid="generate"
            className="rounded-2xl px-4 py-2 bg-indigo-600 text-white font-medium hover:bg-indigo-700
                       disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={!imageDataUrl || !prompt}
            onClick={() => alert('Generate (mock) will be wired next)')}
          >
            Generate
          </button>
          <button
            data-testid="abort"
            className="ml-3 rounded-2xl px-4 py-2 border font-medium hover:bg-slate-50
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
            onClick={() => alert('Abort (mock)')}
          >
            Abort
          </button>
          {busy && <Spinner />}
        </div>

        <div className="space-y-4">
          <SummaryCard imageDataUrl={imageDataUrl} prompt={prompt} style={style} />
          <HistoryList items={history} onSelect={(it) => {
            setImageDataUrl(it.imageUrl);
            setPrompt(it.prompt);
            setStyle(it.style);
          }} />
        </div>
      </div>
    </main>
  );
}
