---
paths:
  - "tests/**/*.spec.ts"
  - "tests/**/*.test.ts"
---

# Test File Rules

## Imports

Always import `test` and `expect` from the custom fixture, not directly from Playwright:

```typescript
// CORRECT
import { test, expect } from '@fixtures/site.fixture';

// WRONG
import { test, expect } from '@playwright/test';
```

## Test tagging

Every test must have at least one tag from this list:
- `@smoke` — availability and basic load checks
- `@navigation` — nav links, menus, routing
- `@forms` — form field interactions, validation (no submission)
- `@functional` — business features, user flows
- `@visual` — screenshot regression
- `@responsive` — viewport-specific layout checks

Tags go on both the `describe` block and individual tests for precise grep filtering:

```typescript
test.describe('Feature Area @functional', () => {
  test('specific behavior @functional', async ({ page }) => { ... });
});
```

## No form submission

Never call `page.click()` on a submit button or `form.submit()`. Verify field interactions, validation messages, and error states only.

## No hardcoded URLs

Always use `baseURL` from Playwright config (relative paths like `await page.goto('/contact')`) or `siteConfig.url` from the fixture. Never write `https://www.famigo.com` in a test.

## No fixed timeouts

Do not use `page.waitForTimeout(n)`. Use:
- `await page.waitForSelector(selector)`
- `await page.waitForLoadState('networkidle')`
- Playwright's built-in auto-waiting on `expect()` assertions

## Page object usage

Do not call `page.locator()` directly in test bodies. Use page object methods and locator properties:

```typescript
// CORRECT — use the page object
test('hero CTA is visible @functional', async ({ homePage }) => {
  await expect(homePage.heroCtaButton).toBeVisible();
});

// WRONG — raw locator in test body
test('hero CTA is visible @functional', async ({ page }) => {
  await expect(page.locator('.hero-cta')).toBeVisible();
});
```

## Structure

- One `describe` block per page or feature area.
- `test.beforeEach` for shared navigation setup.
- Tests must be independent — no shared mutable state between tests.
