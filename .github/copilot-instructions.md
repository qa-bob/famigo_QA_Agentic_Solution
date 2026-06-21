# GitHub Copilot Instructions

This file gives GitHub Copilot context about this repository. Follow these instructions when generating code completions and suggestions.

---

## Repository Purpose

Playwright + TypeScript regression test suite for [famigo.com](https://www.famigo.com), using the **Page Object Model (POM)** design pattern. Tests cover every public feature without creating accounts or submitting forms.

---

## Architecture

### Page Objects (`src/pages/`)

All page classes extend `BasePage` from `./base.page`. Locators are `readonly Locator` properties. Methods represent user actions — never assertions.

```typescript
// Pattern for a new page object
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@types/site-config.types';

export class ExamplePage extends BasePage {
  readonly heading: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heading = page.getByRole('heading', { level: 1 });
    this.ctaButton = page.getByRole('link', { name: /get started/i });
  }

  async clickCta(): Promise<void> {
    await this.ctaButton.click();
  }
}
```

### Tests (`tests/`)

All test files import from the custom fixture, not directly from Playwright:

```typescript
import { test, expect } from '@fixtures/site.fixture';
```

Every test is tagged with at least one: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`.

---

## Rules Copilot Must Follow

1. **Never suggest `page.waitForTimeout()`** — use `waitForSelector` or Playwright auto-waiting.
2. **Never suggest hardcoding URLs** — use relative paths or `siteConfig.url`.
3. **Never put `expect()` inside page object methods** — assertions belong in spec files.
4. **Never suggest form submission** — test only field interactions and validation.
5. **Always use `readonly Locator` for locator properties** in page objects.
6. **Always extend `BasePage`** when creating a new page object.
7. **Always import from `@fixtures/site.fixture`** in spec files.
8. **Always use strict TypeScript** — no implicit `any`.
9. **Always tag tests** with the appropriate `@tag`.
10. **Prefer `getByRole`, `getByText`, `getByLabel`** over fragile CSS class selectors.

---

## Path Aliases

TypeScript path aliases configured in `tsconfig.json`:

| Alias | Resolves to |
|-------|-------------|
| `@fixtures/*` | `src/fixtures/*` |
| `@pages/*` | `src/pages/*` |
| `@utils/*` | `src/utils/*` |
| `@site-types/*` | `src/types/*` |

---

## npm Scripts

```bash
npm test                    # All tests
npm run test:smoke          # @smoke only
npm run test:navigation     # @navigation only
npm run test:forms          # @forms only
npm run test:visual         # @visual only
npm run test:responsive     # @responsive only
npm run baseline            # Update visual snapshots
npm run typecheck           # tsc --noEmit
npm run lint                # ESLint
```
