type Props = {
    imageDataUrl: string | null;
    prompt: string;
    style: string;
};

export default function SummaryCard({ imageDataUrl, prompt, style }: Props) {
    return (
        <section
            className="rounded-2xl border bg-white p-4 space-y-3"
            aria-live="polite"
        >
            <h2 className="text-lg font-semibold">Live Summary</h2>

            <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                {imageDataUrl ? (
                    <img
                        src={imageDataUrl}
                        alt="Preview"
                        className="h-full w-full object-contain"
                    />
                ) : (
                    <span className="text-slate-500 text-sm">No image yet</span>
                )}
            </div>

            <div className="text-sm">
                <div><span className="font-medium">Prompt:</span> {prompt || <em className="text-slate-500">—</em>}</div>
                <div><span className="font-medium">Style:</span> {style || <em className="text-slate-500">—</em>}</div>
            </div>
        </section>
    );
}
