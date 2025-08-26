type Props = {
    prompt: string;
    style: string;
    onPromptChange: (v: string) => void;
    onStyleChange: (v: string) => void;
};

export default function PromptStyleForm({
    prompt,
    style,
    onPromptChange,
    onStyleChange,
}: Props) {
    return (
        <div className="rounded-2xl border bg-white p-4 space-y-4">
            <div>
                <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                    Prompt
                </label>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="style" className="block text-sm font-medium mb-2">
                    Style
                </label>
                <select
                    id="style"
                    value={style}
                    onChange={(e) => onStyleChange(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option>Editorial</option>
                    <option>Streetwear</option>
                    <option>Vintage</option>
                </select>
            </div>
        </div>
    );
}
