---
name: Bug report
about: A test is failing, flaky, or producing incorrect results
title: '[BUG] '
labels: bug, needs-triage
assignees: ''
---

## Describe the bug

<!-- Clear description of what's failing and what was expected. -->

## Failing test

<!-- Paste the test name and file path. -->

```
File: tests/<suite>/<file>.spec.ts
Test: <describe block> > <test name>
Tag:  @<tag>
```

## Error output

```
<!-- Paste the full error message from the Playwright report. -->
```

## Steps to reproduce

1. Run `npm run test:<suite>`  
   or `npx playwright test --grep "<test name>"`
2. Observe failure

## Environment

- Branch: <!-- main / feature branch -->
- OS: <!-- Windows / macOS / Linux -->
- Node version: <!-- node -v -->
- Playwright version: <!-- npx playwright --version -->
- Site URL tested: https://www.famigo.com

## Screenshots / traces

<!-- Attach Playwright trace ZIP or failure screenshots from `test-results/` if available. -->

## Possible cause

<!-- Optional: your hypothesis about why it's failing (stale selector, timing, site change, etc.) -->
