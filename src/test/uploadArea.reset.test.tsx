import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { createRef } from 'react';
import UploadArea, { type UploadAreaHandle } from '../components/UploadArea';

function file(name = 'x.png', type = 'image/png') {
    return new File([new Uint8Array([137, 80, 78, 71])], name, { type });
}

describe('UploadArea reset()', () => {
    it('clears the native file input when reset is called', async () => {
        const onFile = vi.fn();
        const ref = createRef<UploadAreaHandle>();
        render(<UploadArea ref={ref} onFileChosen={onFile} />);

        const input = screen.getByTestId('file-input') as HTMLInputElement;
        await user.upload(input, file());

        // Sanity: simulated upload sets a file
        expect(input.files?.length).toBe(1);

        // When parent calls reset()
        ref.current?.reset();

        // The native input should be cleared
        expect(input.value).toBe('');
        expect(input.files?.length ?? 0).toBe(0);
    });
});
