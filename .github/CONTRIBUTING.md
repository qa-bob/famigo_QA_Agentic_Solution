# Contributing to FAMIGO QA Agentic Solution

Thank you for contributing to the FAMIGO test suite. This guide covers everything you need to know to add or update tests correctly.

---

## Ground Rules

1. **Never submit a form** — test field interactions and validation only.
2. **Never create accounts** — no registration, no real credentials.
3. **Never hardcode URLs** — always use `baseURL` (Playwright) or `siteConfig.url` (fixture).
4. **Never use `page.waitForTimeout()`** — use Playwright auto-waiting or `waitForSelector`.
5. **No `any` type** without an explicit comment explaining why.
6. **No assertions in page objects** — `expect()` belongs in spec files only.

---

## Development Workflow

### 1. Branch

```bash
git checkout -b test/creator-listing-tests
# or
git checkout -b fix/mobile-nav-selector
# or
git checkout -b feat/pricing-page-object
```

Branch naming convention: `<type>/<short-kebab-description>`
Types: `test`, `fix`, `feat`, `chore`, `docs`

### 2. Make changes

Follow the architecture rules in the project README and `AGENTS.md`.

When adding tests:
1. Read `site.config.json` for context.
2. Inspect the live site before writing selectors.
3. Update the page object class in `src/pages/` first.
4. Write the spec file using page object methods — not raw `page.locator()` in test bodies.

### 3. Validate

Run these checks before opening a PR:

```bash
# TypeScript — must pass with 0 errors
npm run typecheck

# Lint — must pass with 0 errors
npm run lint

# Run the relevant test suite
npm run test:smoke       # if you changed smoke tests
npm run test:navigation  # if you changed navigation tests
npm run test:forms       # if you changed form tests
npm run test:functional  # not yet wired to a script — use:
npx playwright test --grep @functional
```

### 4. Open a Pull Request

Use the PR template (it will auto-fill when you open a PR on GitHub). Fill in every section — especially the test results table.

---

## Page Object Guidelines

### File location and naming

```
src/pages/<feature>.page.ts   # e.g., pricing.page.ts
```

### Class structure

```typescript
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@types/site-config.types';

export class PricingPage extends BasePage {
  // Declare all locators as readonly Locator properties
  readonly pageHeading: Locator;
  readonly pricingCards: Locator;
  readonly ctaButtons: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    // Use resilient selectors — prefer roles and text over fragile class names
    this.pageHeading = page.getByRole('heading', { level: 1 });
    this.pricingCards = page.locator('[class*="plan"], [class*="pricing"], [class*="tier"]');
    this.ctaButtons = page.getByRole('link', { name: /get started|choose|select/i });
  }

  async navigateToPricing(): Promise<void> {
    await this.page.goto('/pricing', { waitUntil: 'domcontentloaded' });
  }
}
```

### Rules

- Extend `BasePage` — always.
- Locators: `readonly Locator` properties at the top of the class.
- Methods: user actions only (`clickX`, `fillY`, `openZ`). No assertions.
- No `expect()` inside page objects.

---

## Test Guidelines

### File location

```
tests/smoke/       @smoke tests
tests/navigation/  @navigation tests
tests/forms/       @forms tests
tests/functional/  @functional tests
tests/visual/      @visual tests
tests/responsive/  @responsive tests
```

### Tagging

Every test must have at least one tag. Tags go on both `describe` and `test`:

```typescript
test.describe('Pricing Page @functional', () => {
  test('all pricing tiers are visible @functional', async ({ page }) => { ... });
});
```

### Template

```typescript
/**
 * tests/functional/pricing.spec.ts
 *
 * Functional tests for the Pricing page.
 * Covers: plan visibility, CTA presence, feature lists.
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Pricing Page @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(new URL('/pricing', siteConfig.url).toString(), {
      waitUntil: 'domcontentloaded',
    });
  });

  test('pricing page heading is visible @functional', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });
});
```

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
test: add functional tests for creator listing page
fix: update mobile nav locator after site redesign
feat: add PricingPage page object with plan selectors
chore: update visual regression baselines for new hero
docs: document contact form field structure
```

---

## Visual Regression Baselines

If your PR introduces or changes visual tests:

1. Run `/update-baseline` (Claude Code skill) or `npm run baseline` locally.
2. Review every screenshot in `__snapshots__/` before committing.
3. Include a note in the PR description confirming you reviewed them.

Committing unreviewed baselines defeats the purpose of visual regression testing.

---

## Questions?

Open a GitHub Discussion or tag `@rosmall` in a PR comment.
