import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import App from '../App';

// 1) stub image pipeline to bypass canvas work
vi.mock('../utils/image', () => ({
    prepareImageDataUrl: vi.fn(async () => 'data:image/png;base64,FAKE'),
}));

// 2) stub mock API to always succeed fast
vi.mock('../lib/mockApi', () => ({
    mockGenerate: vi.fn(async (req: any) => ({
        id: '1',
        imageUrl: req.imageDataUrl,
        prompt: req.prompt,
        style: req.style,
        createdAt: new Date().toISOString(),
    })),
}));

// 3) optional: make retry a pass-through
vi.mock('../lib/retry', () => ({
    runWithRetry: (task: any, _opts: any) => task(new AbortController().signal),
}));

function png(name = 'x.png') {
    return new File([new Uint8Array([137, 80, 78, 71])], name, { type: 'image/png' });
}

describe('App form resets after successful generation', () => {
    beforeEach(() => {
        localStorage.clear();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('clears file input, prompt, and style', async () => {
        render(<App />);

        const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
        const promptBox = screen.getByTestId('prompt-input') as HTMLTextAreaElement;
        const styleSelect = screen.getByTestId('style-select') as HTMLSelectElement;
        const generateBtn = screen.getByTestId('generate');

        // upload + fill form
        await user.upload(fileInput, png());
        await user.clear(promptBox);
        await user.type(promptBox, 'Hello world');
        await user.selectOptions(styleSelect, 'Streetwear');

        // sanity checks before submit
        expect(fileInput.files?.length).toBe(1);
        expect(promptBox.value).toBe('Hello world');
        expect(styleSelect.value).toBe('Streetwear');

        // click generate
        await user.click(generateBtn);

        // after success, form resets
        await waitFor(() => {
            expect(screen.getByText(/Generation complete\./i)).toBeInTheDocument();
        });

        // file input cleared
        expect(fileInput.value).toBe('');
        expect(fileInput.files?.length ?? 0).toBe(0);

        // prompt cleared
        expect(promptBox.value).toBe('');

        // style reset to Editorial
        expect(styleSelect.value).toBe('Editorial');
    });
});
