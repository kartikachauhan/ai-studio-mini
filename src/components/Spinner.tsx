export default function Spinner() {
    return (
        <div
            role="status"
            aria-live="polite"
            className="inline-block animate-spin rounded-full border-2 border-slate-300 border-t-slate-700 h-5 w-5"
            aria-label="Loading"
        />
    );
}
