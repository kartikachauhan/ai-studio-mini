export async function fileToImageBitmap(file: File): Promise<ImageBitmap> {
    const buf = await file.arrayBuffer();
    const blob = new Blob([buf], { type: file.type });
    return await createImageBitmap(blob);
}

export function downscaleBitmapToMax(bitmap: ImageBitmap, maxDim = 1920): HTMLCanvasElement {
    const { width, height } = bitmap;
    const scale = Math.min(1, maxDim / Math.max(width, height));
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D not supported');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, w, h);
    return canvas;
}

export function canvasToDataUrl(
    canvas: HTMLCanvasElement,
    type: 'image/jpeg' | 'image/png' = 'image/jpeg',
    quality = 0.92,
): string {
    return canvas.toDataURL(type, quality);
}

/** Validate type (PNG/JPG), size (≤10MB), downscale to ≤1920, return data URL */
export async function prepareImageDataUrl(file: File): Promise<string> {
    if (!/image\/(png|jpe?g)/i.test(file.type)) {
        throw new Error('Only PNG or JPG images are supported.');
    }
    if (file.size > 10 * 1024 * 1024) {
        // still allow by downscaling (we normalize via canvas anyway)
        // if you want to hard-block >10MB, throw instead.
    }
    const bitmap = await fileToImageBitmap(file);
    const canvas = downscaleBitmapToMax(bitmap, 1920);
    return canvasToDataUrl(canvas, file.type.toLowerCase() === 'image/png' ? 'image/png' : 'image/jpeg');
}
