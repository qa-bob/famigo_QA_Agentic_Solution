---
paths:
  - "src/pages/**/*.ts"
---

# Page Object Rules

## Class structure

Every page object class must:
1. Extend `BasePage` from `./base.page`
2. Declare all locators as `readonly Locator` properties (typed, named, at the top of the class)
3. Implement a constructor that calls `super(page, config)`
4. Expose methods that represent *user actions*, not assertions

```typescript
import { type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class ExamplePage extends BasePage {
  readonly heroHeading: Locator;
  readonly ctaButton: Locator;

  constructor(page: import('@playwright/test').Page, config: SiteConfig) {
    super(page, config);
    this.heroHeading = page.locator('h1').first();
    this.ctaButton = page.getByRole('link', { name: /get started/i });
  }

  async clickCta(): Promise<void> {
    await this.ctaButton.click();
  }
}
```

## No assertions in page objects

`expect()` must never appear inside a page object method. Assertions belong exclusively in spec files. This keeps page objects reusable across multiple test scenarios.

## Locator strategy preference

Prefer in this order:
1. `page.getByRole()` — accessible, resilient to class/ID changes
2. `page.getByText()` — text-based, readable
3. `page.getByLabel()` — for form fields
4. `page.locator('[data-testid="..."]')` — if test IDs exist on the site
5. `page.locator('CSS selector')` — last resort, avoid class names that look auto-generated

## Strict TypeScript

- All properties must have explicit types — no implicit `any`.
- Use `import type` for type-only imports.
- Do not use optional chaining (`?.`) to silently swallow missing elements — let Playwright's auto-waiting surface the real failure.

## Naming conventions

- File: `<feature>.page.ts` in `src/pages/`
- Class: `<Feature>Page` (PascalCase)
- Locator properties: camelCase nouns describing the element (`heroCtaButton`, `emailInput`, `navMenu`)
- Action methods: camelCase verb phrases (`clickSignIn`, `fillEmailField`, `openMobileMenu`)
