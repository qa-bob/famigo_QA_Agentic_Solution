## Summary

<!-- What does this PR do? One or two sentences. -->

## Type of change

- [ ] New test(s) — added coverage for a previously untested feature
- [ ] Updated test(s) — fixed failing tests or updated selectors after site change
- [ ] New page object — added a `*.page.ts` class in `src/pages/`
- [ ] Updated page object — modified an existing page object class
- [ ] Infrastructure — `playwright.config.ts`, fixtures, utils, CI
- [ ] Documentation — README, AGENTS.md, Skills.md, contributing guide

## Site area(s) affected

<!-- Which part of famigo.com do these tests cover? -->

- [ ] Homepage
- [ ] Navigation / header / footer
- [ ] Contact form
- [ ] Creator listings / marketplace
- [ ] Fan features
- [ ] Pricing
- [ ] Other: ___________

## Test results

<!-- Run the relevant suite(s) locally and paste the results. -->

```
Suite: @___________
Passed: X / X
Failed: 0
Flaky:  0
```

## Checklist

- [ ] Tests pass locally (`npm run typecheck` has 0 errors)
- [ ] No form submissions in tests
- [ ] No hardcoded URLs (`https://www.famigo.com`)
- [ ] No `page.waitForTimeout()` calls
- [ ] No `expect()` calls inside page objects
- [ ] All tests tagged with at least one `@smoke / @navigation / @forms / @functional / @visual / @responsive`
- [ ] Page object classes updated if selectors changed
- [ ] Visual baselines reviewed (if `@visual` tests changed)

## Notes for reviewer

<!-- Anything the reviewer should know: tricky selectors, known flakiness, intentional skips, etc. -->
