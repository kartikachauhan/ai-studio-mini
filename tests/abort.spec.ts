import { test, expect } from '@playwright/test';
import path from 'path';

test('abort mid-generation: no new history item, status resets', async ({ page }) => {
    // Force success randomness to be irrelevant (we will abort anyway)
    await page.addInitScript(() => { (window as any).Math.random = () => 0.99; });

    await page.goto('/');

    // Upload a real tiny image (same file from the previous test)
    const tinyPngPath = path.resolve('tests/assets/tiny.png');
    await page.setInputFiles('[data-testid="file-input"]', tinyPngPath);
    await page.fill('[data-testid="prompt-input"]', 'Test abort');
    await page.selectOption('[data-testid="style-select"]', 'Streetwear');

    // Wait until enabled and click Generate
    const generate = page.locator('[data-testid="generate"]');
    await expect(generate).toBeEnabled();
    await generate.click();

    // Click Abort quickly
    const abortBtn = page.locator('[data-testid="abort"]');
    await expect(abortBtn).toBeEnabled();
    await abortBtn.click();

    // After abort, button should eventually be enabled again (no pending request)
    await expect(generate).toBeEnabled({ timeout: 10_000 });

    // Ensure no success message, and history is still empty (or unchanged)
    await expect(page.getByText('Generation complete.')).toHaveCount(0);
    await expect(page.getByText('No generations yet.')).toBeVisible();
});
