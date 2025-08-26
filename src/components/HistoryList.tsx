type Item = { id: string; imageUrl: string; prompt: string; style: string; createdAt: string };
type Props = { items: Item[]; onSelect: (item: Item) => void };

export default function HistoryList({ items, onSelect }: Props) {
    return (
        <section className="rounded-2xl border bg-white p-4">
            <h2 className="text-lg font-semibold mb-3">History (last 5)</h2>
            {items.length === 0 ? (
                <p className="text-sm text-slate-500">No generations yet.</p>
            ) : (
                <ul className="grid grid-cols-2 gap-3">
                    {items.map((it, i) => (
                        <li key={it.id}>
                            <button
                                data-testid={`history-item-${i}`}
                                className="w-full rounded-xl border overflow-hidden hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onClick={() => onSelect(it)}
                                aria-label={`Restore item ${i + 1}`}
                            >
                                <img src={it.imageUrl} alt="" className="aspect-video object-cover" />
                                <div className="p-2 text-left">
                                    <div className="text-xs line-clamp-1">{it.prompt}</div>
                                    <div className="text-[10px] text-slate-500">{it.style}</div>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
