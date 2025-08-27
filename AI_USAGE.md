### `AI_USAGE.md`

```md
# AI Usage Notes

**Tools used:** ChatGPT (pair-programming guidance), Cursor (inline prompts), Copilot (small completions).

**Where AI helped:**
- Project scaffolding (file structure, Tailwind v4 config, vite-plugin-pwa config)
- Writing utility snippets (`image.ts`, `retry.ts`, `mockApi.ts`)
- Test scaffolding (RTL and Playwright selectors, file upload buffers)
- Debugging (npx/tailwind postcss config, Vitest config types, Playwright timeouts)

**Safeguards:**
- TypeScript strict mode enabled
- ESLint + Prettier
- Unit & E2E tests
- Manual review of generated code and dependencies

**Prompt examples:**
- “Create an exponential backoff helper with abort support in TypeScript.”
- “Vitest config in vite.config.ts with globals and jsdom.”
- “Playwright test to upload a real PNG and force success.”

**Time saved:** ~2–3 hours across scaffolding, config, and test boilerplate.