import type { ChangeEvent } from 'react';

type Props = {
    onFileChosen: (file: File) => void;
};

export default function UploadArea({ onFileChosen }: Props) {
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (!/image\/(png|jpe?g)/i.test(f.type)) {
            alert('Please select a PNG or JPG image.');
            return;
        }
        if (f.size > 20 * 1024 * 1024) { // soft guard to avoid absurd sizes before downscale
            alert('File is too large. Try a smaller image.');
            return;
        }
        onFileChosen(f);
    };

    return (
        <div className="rounded-2xl border bg-white p-4">
            <label htmlFor="file" className="block text-sm font-medium mb-2">
                Upload PNG/JPG (≤10MB)
            </label>
            <input
                id="file"
                data-testid="file-input"
                type="file"
                accept="image/png,image/jpeg"
                onChange={onChange}
                className="block w-full text-sm file:mr-4 file:rounded-xl file:border file:bg-slate-50 file:px-3 file:py-2
                   file:hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl"
                aria-describedby="file-help"
            />
            <p id="file-help" className="text-xs text-slate-500 mt-2">
                Tip: you can drag & drop here later (coming soon).
            </p>
        </div>
    );
}
