# AGENTS.md — AI Agent Instructions

This file configures AI coding agents (Claude Code, GitHub Copilot, Devin, Cursor, and others) for this repository. Claude Code reads `CLAUDE.md` at the project root; other agents read this file directly.

> **Claude Code users:** `CLAUDE.md` imports this file via `@AGENTS.md`. You do not need to read both.

---

## Repository Purpose

Playwright + TypeScript regression test suite for [famigo.com](https://www.famigo.com), using the **Page Object Model (POM)** design pattern and **OOP** principles. Tests cover every public feature of the site without creating accounts or submitting forms.

---

## Architecture Overview

```
src/pages/        Page Object Model classes (one per page/section)
src/fixtures/     Custom Playwright fixtures exposing page objects to tests
src/utils/        Shared helpers (link-checker, visual-helper)
src/types/        TypeScript interfaces (SiteConfig, etc.)
tests/smoke/      @smoke — availability & load checks
tests/navigation/ @navigation — nav links, menus, routing
tests/forms/      @forms — form field interactions, validation
tests/functional/ @functional — business features, user flows
tests/visual/     @visual — screenshot regression
tests/responsive/ @responsive — viewport layout integrity
```

---

## Coding Standards

### Page Object Model

- Every page or major section has its own class in `src/pages/` that extends `BasePage`.
- Locators are `readonly Locator` properties on the class — typed, named, and declared once.
- Methods represent *user actions* only (e.g., `clickSignIn()`, `fillEmail()`).
- **No `expect()` calls inside page objects.** All assertions belong in spec files.
- Import page objects via the fixture (`import { test, expect } from '@fixtures/site.fixture'`), never construct them directly in test bodies.

### TypeScript

- Strict mode is enabled. Do not use `any` without an explicit comment justification.
- All page object properties must be typed.
- Run `npx tsc --noEmit` to validate before completing any task.

### Test conventions

- Tag every test with at least one: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`.
- Do **not** hardcode URLs — use `baseURL` from Playwright config or `siteConfig.url` from the fixture.
- Do **not** submit forms. Test field interactions and validation only.
- Do **not** create accounts or enter real credentials.
- Do **not** use `page.waitForTimeout()`. Use Playwright auto-waiting or `waitForSelector`.
- Each spec file covers one coherent feature area. One `describe` block per page or feature.

---

## Key Files

| File | Purpose |
|------|---------|
| `site.config.json` | Target URL, company name, flags (`hasContactForm`, `skipVisual`, etc.) |
| `playwright.config.ts` | Projects: chromium-desktop, mobile-chrome, tablet |
| `src/pages/base.page.ts` | `BasePage` — shared navigation, screenshot, console-error helpers |
| `src/fixtures/site.fixture.ts` | Custom fixtures: `siteConfig`, `homePage`, `navigationPage`, `contactPage` |
| `CLAUDE.md` | Claude Code-specific instructions (imports this file) |

---

## Workflow: Writing or Updating Tests

1. Read `site.config.json` to get the URL and feature flags.
2. Fetch the live site to inspect actual DOM before writing any selectors.
3. Add or update locators in the relevant page object class in `src/pages/`.
4. Write tests in the appropriate `tests/<suite>/` directory using page objects — not raw `page.locator()` in the test body.
5. Run `npx tsc --noEmit` to confirm TypeScript compiles cleanly.
6. Run the relevant suite (`npm run test:smoke`, etc.) to confirm tests pass.

---

## Sub-Agents (Claude Code)

The `.claude/agents/` directory contains specialized sub-agents Claude Code can delegate to:

| Agent | File | Role |
|-------|------|------|
| `site-analyzer` | `.claude/agents/site-analyzer.md` | Crawls the live site and updates `site.config.json` |
| `test-generator` | `.claude/agents/test-generator.md` | Generates site-specific test files beyond the shared framework |

---

## Skills / Slash Commands

See `Skills.md` for a full list of available slash commands and when to invoke them.

---

## Do Not

- Submit any form
- Create accounts or log in (unless `auth.required: true` in config)
- Hardcode the base URL in tests
- Put assertions inside page object methods
- Use `page.waitForTimeout()` — use `waitForSelector` or Playwright auto-waiting
- Use `any` type without explicit justification
- Modify `node_modules/`, `playwright-report/`, `test-results/`, or `__snapshots__/` directly
