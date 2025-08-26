import type { GenerateRequest, GenerateResponse } from './types';

let ctr = 0;

export function mockGenerate(req: GenerateRequest, opts?: { signal?: AbortSignal }): Promise<GenerateResponse> {
    return new Promise((resolve, reject) => {
        const id = ++ctr;
        const delay = 1000 + Math.floor(Math.random() * 1000); // 1–2s
        const timer = setTimeout(() => {
            if (Math.random() < 0.2) {
                reject({ message: 'Model overloaded' });
                return;
            }
            resolve({
                id: String(id),
                imageUrl: req.imageDataUrl,
                prompt: req.prompt,
                style: req.style,
                createdAt: new Date().toISOString(),
            });
        }, delay);

        opts?.signal?.addEventListener('abort', () => {
            clearTimeout(timer);
            reject(new DOMException('Aborted', 'AbortError'));
        });
    });
}
