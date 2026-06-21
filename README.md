# FAMIGO — QA Agentic Solution

Playwright + TypeScript automated test suite for [famigo.com](https://www.famigo.com), a marketplace connecting fans with musicians and creators. Built with the **Page Object Model (POM)** pattern and designed for agentic execution via Claude Code.

---

## Table of Contents

- [Purpose](#purpose)
- [Tech Stack](#tech-stack)
- [Development Environment Setup](#development-environment-setup)
- [Project Architecture](#project-architecture)
- [Running Tests](#running-tests)
- [Claude Code Integration](#claude-code-integration)
- [Contributor Rules](#contributor-rules)
- [CI / GitHub Actions](#ci--github-actions)

---

## Purpose

This repository tests every discoverable public feature of the FAMIGO website **without** creating accounts, submitting forms, or entering real credentials. Coverage targets:

| Suite | Scope |
|-------|-------|
| **Smoke** | Site reachability, HTTPS, page title, load time |
| **Navigation** | Nav links, mobile menu, logo, link health |
| **Forms** | Field presence, validation, accessibility (no submission) |
| **Functional** | Business features — creator listings, fan flows, CTAs, pricing |
| **Visual** | Screenshot regression via `toHaveScreenshot()` |
| **Responsive** | Layout integrity at mobile (390px), tablet (768px), desktop (1280px) |

The target site and all test flags are configured in `site.config.json`.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev/) | ^1.44 | Browser automation & test runner |
| TypeScript | ^5.4 | Strict-typed test code |
| Node.js | ≥18 LTS | Runtime |
| ESLint + `@typescript-eslint` | ^8 / ^7 | Linting |
| GitHub Actions | — | CI pipeline |
| Claude Code | latest | Agentic test generation & analysis |

---

## Development Environment Setup

### Prerequisites

- **Node.js 18 LTS or later** — [nodejs.org](https://nodejs.org/)
- **Git** — [git-scm.com](https://git-scm.com/)
- **Claude Code** (optional, for AI-assisted workflows) — [code.claude.com](https://code.claude.com)

### 1. Clone the repository

```bash
git clone https://github.com/<org>/famigo_QA_Agentic_Solution.git
cd famigo_QA_Agentic_Solution
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install --with-deps chromium
```

`--with-deps` installs OS-level browser dependencies (required on Linux/CI).  
On Windows/macOS you can omit `--with-deps` if browsers are already installed.

### 4. Verify the site config

```bash
cat site.config.json
```

Confirm `url` points to the correct environment. To override for a local or staging environment without editing the file, set:

```bash
SITE_URL=https://staging.famigo.com npx playwright test
```

### 5. Run a quick smoke check

```bash
npm run test:smoke
```

All five smoke tests should pass if the site is reachable.

---

## Project Architecture

```
famigo_QA_Agentic_Solution/
├── site.config.json          # Target site URL, flags, auth config
├── playwright.config.ts      # Projects (desktop/mobile/tablet), reporters
├── global-setup.ts           # Pre-run reachability check
│
├── src/
│   ├── pages/
│   │   ├── base.page.ts      # BasePage — shared locators & helpers
│   │   ├── home.page.ts      # HomePage
│   │   ├── navigation.page.ts
│   │   ├── contact.page.ts
│   │   └── *.page.ts         # One class per discovered page/section
│   ├── fixtures/
│   │   └── site.fixture.ts   # Custom Playwright fixtures exposing page objects
│   ├── utils/
│   │   ├── link-checker.ts
│   │   └── visual-helper.ts
│   └── types/
│       └── site-config.types.ts
│
├── tests/
│   ├── smoke/                # @smoke — availability & basic load
│   ├── navigation/           # @navigation — links, menus, routing
│   ├── forms/                # @forms — fields, validation (no submission)
│   ├── functional/           # @functional — business features, user flows
│   ├── visual/               # @visual — screenshot regression
│   └── responsive/           # @responsive — viewport layout checks
│
├── .claude/
│   ├── CLAUDE.md             # Claude Code project instructions (← also at root)
│   ├── agents/               # Sub-agent definitions
│   ├── commands/             # Skill/slash-command definitions
│   ├── hooks/                # Shell hooks (pre-test reachability, etc.)
│   ├── rules/                # Path-scoped rules for tests & pages
│   └── settings.json         # Hook registration & permissions
│
└── .github/
    ├── workflows/
    │   └── playwright.yml    # CI pipeline
    ├── CONTRIBUTING.md
    ├── pull_request_template.md
    ├── copilot-instructions.md
    └── ISSUE_TEMPLATE/
        ├── bug_report.md
        └── test_request.md
```

### Page Object Model rules

- Every page or section has its own class in `src/pages/`, extending `BasePage`.
- Locators are `readonly Locator` properties typed on the class — never inline `page.locator()` in a test body.
- Page object methods represent *user actions*, not assertions. No `expect()` inside page objects.
- Tests import page objects exclusively through the custom fixture in `src/fixtures/site.fixture.ts`.

---

## Running Tests

```bash
# Full suite (all browsers, all tags)
npm test

# By tag
npm run test:smoke
npm run test:navigation
npm run test:forms
npm run test:functional
npm run test:visual
npm run test:responsive

# Headed (watch the browser)
npm run test:headed

# Update visual regression baselines
npm run baseline

# Open the HTML report
npm run report

# TypeScript check (no compile errors)
npm run typecheck

# Lint
npm run lint
```

### Overriding the target URL

```bash
SITE_URL=https://staging.famigo.com npm test
```

---

## Claude Code Integration

This repo is configured for agentic execution with Claude Code. See `AGENTS.md` for agent definitions and `Skills.md` for available slash commands.

### Available slash commands

| Command | Description |
|---------|-------------|
| `/analyze-site` | Crawl the live site and update `site.config.json` |
| `/generate-full-suite` | Generate a complete POM + test suite from the live site |
| `/run-smoke` | Run smoke tests and print a formatted pass/fail table |
| `/update-baseline` | Capture new visual regression baselines |
| `/generate-report` | Parse results and display a structured test summary |

### Starting Claude Code

```bash
# Install Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Open an interactive session in this repo
claude
```

Claude reads `CLAUDE.md` at startup and enforces all project conventions automatically.

---

## Contributor Rules

These rules apply to **all contributors** — human and agentic alike.

### General

1. **Never submit a form.** Validate field behaviour and error states only.
2. **Never create accounts or enter real credentials.** If `auth.required: true` in `site.config.json`, use the provided test credentials only.
3. **Never hardcode a URL in a test.** Always derive from `baseURL` (Playwright config) or `siteConfig.url` (fixture).
4. **Never use `page.waitForTimeout()`.** Use Playwright's auto-waiting, `waitForSelector`, or `waitForLoadState` instead.
5. **No `any` type** without an explicit comment explaining why it's unavoidable.

### Page objects

6. All locators must be `readonly Locator` properties typed on the class.
7. Methods must represent user actions, not assertions.
8. No `expect()` calls inside page object methods.
9. Extend `BasePage` — never use raw `page` directly in a spec file.

### Tests

10. Tag every test with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`.
11. Each spec file covers one coherent area. One `describe` block per page or feature.
12. Run `npm run typecheck` and `npm run lint` before opening a PR.
13. Update or add the relevant page object class whenever selectors change.

### Git workflow

14. Branch naming: `feat/<short-description>`, `fix/<short-description>`, `test/<short-description>`.
15. Commit messages follow Conventional Commits: `test: add functional tests for creator listing`.
16. PRs must include a description of what changed and why.
17. Visual baseline changes (`__snapshots__/`) must be reviewed manually before merge.

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for the full contribution workflow.

---

## CI / GitHub Actions

The `.github/workflows/playwright.yml` pipeline runs on every push and pull request:

1. Installs Node dependencies
2. Installs Playwright browsers
3. Runs the smoke suite first (fast gate)
4. Runs the full suite (chromium desktop)
5. Uploads the HTML report as a build artifact

Status badges reflect the `main` branch. A red badge means the site is failing one or more checks — investigate before merging new PRs.

---

*Part of the Phoenix Startup QA Agentic Solutions project — testing [famigo.com](https://www.famigo.com).*
