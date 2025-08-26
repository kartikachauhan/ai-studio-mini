export async function runWithRetry<T>(
    task: (signal: AbortSignal) => Promise<T>,
    { retries = 3, baseDelayMs = 500, signal }: { retries?: number; baseDelayMs?: number; signal?: AbortSignal }
): Promise<T> {
    let attempt = 0;
    const abortErr = () => new DOMException('Aborted', 'AbortError');

    while (true) {
        if (signal?.aborted) throw abortErr();
        try {
            return await task(signal ?? new AbortController().signal);
        } catch (e: any) {
            if (signal?.aborted) throw abortErr();
            const isAbort = e?.name === 'AbortError';
            const canRetry = !isAbort && attempt < retries - 1;
            if (!canRetry) throw e;
            attempt++;
            const delay = baseDelayMs * 2 ** (attempt - 1);
            const jitter = Math.random() * 150;
            await new Promise((r, rej) => {
                const t = setTimeout(r, delay + jitter);
                signal?.addEventListener('abort', () => {
                    clearTimeout(t);
                    rej(abortErr());
                });
            });
        }
    }
}
