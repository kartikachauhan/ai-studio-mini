import { useRef, useCallback } from 'react';

export function useAbortableRequest() {
  const ctrlRef = useRef<AbortController | null>(null);

  const start = useCallback<<T,>(fn: (signal: AbortSignal) => Promise<T>) => Promise<T>>((fn) => {
    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;
    const p = fn(ctrl.signal);
    p.finally(() => {
      if (ctrlRef.current === ctrl) ctrlRef.current = null;
    });
    return p;
  }, []);

  const abort = useCallback(() => {
    ctrlRef.current?.abort();
  }, []);

  return { start, abort, isPending: !!ctrlRef.current } as const;
}
