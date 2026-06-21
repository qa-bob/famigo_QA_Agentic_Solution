# Skills — Available Slash Commands

This file documents all Claude Code slash commands (skills) defined in `.claude/commands/`. Invoke any skill by typing `/skill-name` in a Claude Code session.

---

## `/analyze-site`

**File:** `.claude/commands/analyze-site.md`

Crawls the live FAMIGO website and produces an updated `site.config.json`.

**When to use:**
- After a site redesign or content update to refresh discovered nav items and feature flags.
- When onboarding this framework to a different site.
- When `expectedNavItems` in `site.config.json` is stale.

**What it does:**
1. Navigates to the URL in `site.config.json` (or a provided URL).
2. Extracts navigation links, form presence, meta description, page title, and HTTPS status.
3. Outputs a complete `site.config.json` block and an issues checklist.

---

## `/generate-full-suite`

**File:** `.claude/commands/generate-full-suite.md`

Analyzes the live site and generates a complete POM + test suite tailored to the discovered content.

**When to use:**
- First-time setup to generate baseline tests from the live site.
- After a major site redesign to regenerate tests with fresh selectors.
- When expanding coverage to newly discovered pages.

**What it does:**
1. Runs `/analyze-site` to discover pages and features.
2. Creates or updates page object classes in `src/pages/`.
3. Generates spec files for every discovered feature area.
4. Runs `npx tsc --noEmit` to verify TypeScript compiles.

---

## `/run-smoke`

**File:** `.claude/commands/run-smoke.md`

Runs the smoke test suite and displays a formatted pass/fail summary.

**When to use:**
- Before starting any deeper test run to confirm the site is up.
- After deploying a site change to verify no regressions.
- As a quick CI gate check.

**What it does:**
1. Executes `npm run test:smoke`.
2. Parses `test-results/results.json`.
3. Prints a table of test names, status (PASS/FAIL/WARN), and duration.
4. For failures, shows the error and a suggested fix.

---

## `/update-baseline`

**File:** `.claude/commands/update-baseline.md`

Captures new visual regression baseline screenshots after intentional design changes.

**When to use:**
- After a deliberate site redesign when visual tests are failing on purpose.
- When onboarding the framework (first-time baseline capture).
- After changing viewport sizes in `playwright.config.ts`.

**What it does:**
1. Runs `npm run baseline` (`playwright test --grep @visual --update-snapshots`).
2. Lists all updated baseline files.
3. Reminds you to review screenshots visually before committing.

**Important:** Always review new baselines before committing. Unreviewed baselines defeat the purpose of visual regression testing.

---

## `/generate-report`

**File:** `.claude/commands/generate-report.md`

Parses `test-results/results.json` and displays a structured test summary.

**When to use:**
- After running the full test suite to get a readable summary.
- When triaging failures to understand what broke and why.
- When preparing a test coverage report for stakeholders.

**What it does:**
1. Parses `test-results/results.json`.
2. Displays a table broken down by suite (`@smoke`, `@navigation`, etc.).
3. Lists all failed tests with error messages.
4. Lists flaky tests with retry information.
5. Suggests next steps based on the results.

---

## Adding a New Skill

To add a new slash command:

1. Create a markdown file in `.claude/commands/<skill-name>.md`.
2. Start with a heading `# /<skill-name>`.
3. Describe what the command does step by step.
4. The command is immediately available as `/<skill-name>` in any Claude Code session in this repo.

See [Claude Code Skills documentation](https://code.claude.com/docs/en/skills) for the full skill spec including frontmatter options (e.g., controlling whether Claude auto-invokes vs. user-only invocation).
