import { test, expect } from '@playwright/test';
import path from 'path';

test('happy path: upload → prompt+style → generate → form resets', async ({ page }) => {
  // Force success (skip 20% error)
  await page.addInitScript(() => { (window as any).Math.random = () => 0.99; });

  await page.goto('/');

  // ✅ Use a real file path, not a synthetic buffer
  const tinyPngPath = path.resolve('tests/assets/tiny.png');
  await page.setInputFiles('[data-testid="file-input"]', tinyPngPath);

  await page.fill('[data-testid="prompt-input"]', 'Street look, moody light');
  await page.selectOption('[data-testid="style-select"]', 'Streetwear');

  // Wait for preview to appear (confirms imageDataUrl is set)
  await expect(page.locator('img[alt="Preview"]')).toBeVisible();

  // Then wait for the button to enable and click
  const generate = page.locator('[data-testid="generate"]');
  await expect(generate).toBeEnabled({ timeout: 15000 });
  await generate.click();

  await expect(page.getByText('Generation complete.')).toBeVisible();

  await expect(page.locator('[data-testid="file-input"]')).toHaveJSProperty('value', '');
  await expect(page.locator('[data-testid="prompt-input"]')).toHaveValue('');
  await expect(page.locator('[data-testid="style-select"]')).toHaveValue('Editorial');

  await expect(page.getByRole('heading', { name: 'History (last 5)' })).toBeVisible();
});