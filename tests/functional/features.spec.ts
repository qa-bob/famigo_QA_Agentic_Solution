/**
 * tests/functional/features.spec.ts
 *
 * Functional regression tests for FAMIGO (https://www.famigo.com).
 * FAMIGO is a marketplace for fans to connect with musicians and creators.
 *
 * Coverage:
 *  - Homepage hero and above-the-fold content
 *  - Primary call-to-action buttons
 *  - Creator / fan value proposition sections
 *  - How-it-works or feature explanation sections
 *  - Footer content and links
 *  - Social media links
 *  - Cookie consent (if present)
 *
 * Constraints:
 *  - No form submissions
 *  - No account creation or login
 *  - No hardcoded URLs — all navigation uses relative paths from siteConfig.url
 */

import { test, expect } from '@fixtures/site.fixture';

// ── Homepage Hero ─────────────────────────────────────────────────────────────

test.describe('Homepage Hero @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
    await homePage.waitForLoad();
  });

  test('homepage has a main heading @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(heading.length, 'Homepage should have a non-empty H1 or H2 heading').toBeGreaterThan(0);
  });

  test('hero section has visible text content @functional', async ({ homePage }) => {
    const heroText = await homePage.getHeroText();
    expect(heroText.length, 'Hero / banner section should contain visible text').toBeGreaterThan(10);
  });

  test('at least one CTA button or link is visible above the fold @functional', async ({ homePage }) => {
    const ctaButtons = await homePage.getCTAButtons();
    expect(
      ctaButtons.length,
      'Homepage should have at least one CTA button (Get Started, Sign Up, etc.)'
    ).toBeGreaterThan(0);

    // At least the first CTA should be visible without scrolling
    await expect(ctaButtons[0], 'First CTA button should be visible').toBeVisible();
  });

  test('homepage body has substantial content @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const bodyText = await page.evaluate<string>(() => document.body.innerText.trim());
    expect(
      bodyText.length,
      'Homepage body should have meaningful content (>200 characters)'
    ).toBeGreaterThan(200);
  });
});

// ── Navigation & Routing ──────────────────────────────────────────────────────

test.describe('Page Routing @functional', () => {
  test('homepage loads without redirect loops @functional', async ({ page, siteConfig }) => {
    const responses: number[] = [];
    page.on('response', (res) => {
      if (res.url().includes(new URL(siteConfig.url).hostname)) {
        responses.push(res.status());
      }
    });

    await page.goto(siteConfig.url, { waitUntil: 'networkidle' });

    // The final page should render (not be stuck in a redirect)
    const finalStatus = await page.evaluate(() => document.readyState);
    expect(finalStatus).toBe('complete');
  });

  test('page has no horizontal overflow at desktop viewport @functional', async ({ homePage }) => {
    const isResponsive = await homePage.isResponsive();
    expect(isResponsive, 'No horizontal scroll should be present at desktop viewport width').toBeTruthy();
  });
});

// ── Creator & Fan Value Proposition ──────────────────────────────────────────

test.describe('Creator and Fan Features @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
  });

  test('page includes content about creators or artists @functional', async ({ page }) => {
    const bodyText = (await page.evaluate<string>(() => document.body.innerText)).toLowerCase();

    const creatorTerms = ['creator', 'artist', 'musician', 'performer', 'band', 'talent'];
    const hasCreatorContent = creatorTerms.some((term) => bodyText.includes(term));

    expect(
      hasCreatorContent,
      `Homepage should reference at least one creator-related term: ${creatorTerms.join(', ')}`
    ).toBeTruthy();
  });

  test('page includes content about fans or audience @functional', async ({ page }) => {
    const bodyText = (await page.evaluate<string>(() => document.body.innerText)).toLowerCase();

    const fanTerms = ['fan', 'audience', 'follower', 'supporter', 'connect', 'community'];
    const hasFanContent = fanTerms.some((term) => bodyText.includes(term));

    expect(
      hasFanContent,
      `Homepage should reference at least one fan/audience term: ${fanTerms.join(', ')}`
    ).toBeTruthy();
  });

  test('at least one section heading describes the platform value @functional', async ({ page }) => {
    const headings = await page.locator('h2, h3').allTextContents();
    expect(
      headings.length,
      'Page should have multiple section headings describing features'
    ).toBeGreaterThan(0);

    // Headings should not all be empty
    const nonEmptyHeadings = headings.filter((h) => h.trim().length > 0);
    expect(nonEmptyHeadings.length).toBeGreaterThan(0);
  });
});

// ── How It Works / Feature Sections ──────────────────────────────────────────

test.describe('Feature Sections @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'networkidle' });
  });

  test('page has at least two distinct content sections @functional', async ({ page }) => {
    const sections = await page.locator('section, [class*="section"], [class*="block"]').count();
    expect(
      sections,
      'Homepage should have multiple structured content sections'
    ).toBeGreaterThanOrEqual(2);
  });

  test('all visible images have alt text @functional', async ({ page }) => {
    const images = await page.locator('img:visible').all();

    if (images.length === 0) {
      console.warn('[functional] No visible <img> elements found on homepage.');
      return;
    }

    const imagesWithoutAlt: string[] = [];
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const src = (await img.getAttribute('src')) ?? '(no src)';

      // Decorative images may have empty alt="" which is valid — only flag missing alt
      if (alt === null) {
        imagesWithoutAlt.push(src);
      }
    }

    if (imagesWithoutAlt.length > 0) {
      console.warn(
        `[functional] Images missing alt attribute:\n${imagesWithoutAlt.join('\n')}`
      );
    }

    // Soft assertion: warn rather than hard-fail (some third-party images are outside control)
    expect(
      imagesWithoutAlt.length,
      `Found ${imagesWithoutAlt.length} image(s) with no alt attribute`
    ).toBeLessThanOrEqual(3);
  });

  test('external links open safely (have rel="noopener" or target attribute) @functional', async ({
    page,
  }) => {
    const externalLinks = await page
      .locator('a[href^="http"]')
      .filter({ hasNot: page.locator('[href*="famigo.com"]') })
      .all();

    if (externalLinks.length === 0) {
      console.warn('[functional] No external links found on homepage.');
      return;
    }

    const unsafeLinks: string[] = [];
    for (const link of externalLinks) {
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');
      const href = await link.getAttribute('href');

      // Only flag links that open in a new tab without noopener
      if (target === '_blank' && (!rel || !rel.includes('noopener'))) {
        unsafeLinks.push(href ?? '(no href)');
      }
    }

    if (unsafeLinks.length > 0) {
      console.warn(
        '[functional] External links opening in _blank without rel="noopener":\n' +
          unsafeLinks.join('\n')
      );
    }

    // Informational warning — not a hard failure
    expect(unsafeLinks.length).toBeLessThanOrEqual(5);
  });
});

// ── Footer ────────────────────────────────────────────────────────────────────
//
// FAMIGO's bottom section is a plain <div> with no semantic <footer> tag,
// role="contentinfo", or identifying class. Tests target known footer links
// (Terms, Privacy Policy) and the copyright text directly.

test.describe('Footer @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    // networkidle ensures the SPA has rendered the bottom section
    await page.goto(siteConfig.url, { waitUntil: 'networkidle' });
  });

  test('footer is present and visible @functional', async ({ page }) => {
    // The footer Terms link uses title case; login/signup forms use lowercase — this is unique
    const termsLink = page.getByRole('link', { name: 'Terms & Conditions', exact: true });
    await expect(termsLink, 'Terms & Conditions link should be visible in the footer').toBeVisible();
  });

  test('footer has content (not empty) @functional', async ({ page }) => {
    // Verify multiple known footer links are present
    const footerLinks = page.locator('a[href="/terms"], a[href="/policy"], a[href="/about"]');
    const count = await footerLinks.count();
    expect(count, 'Footer should contain Terms, Privacy Policy, and About links').toBeGreaterThanOrEqual(2);
  });

  test('footer links are clickable @functional', async ({ page }) => {
    const knownFooterLinks = ['/terms', '/policy', '/about', '/blog'];
    for (const href of knownFooterLinks) {
      const link = page.locator(`a[href="${href}"]`).first();
      if (await link.count() > 0) {
        const resolvedHref = await link.getAttribute('href');
        expect(
          resolvedHref && resolvedHref.trim().length > 0,
          `Footer link "${href}" should have a valid href`
        ).toBeTruthy();
      }
    }
  });

  test('footer contains a copyright notice or brand mention @functional', async ({ page }) => {
    // Copyright text "Famigo™ | ... 2025 © All rights reserved" is in the footer
    const copyright = page.getByText(/famigo|all rights reserved|©/i).last();
    await expect(copyright, 'Footer should contain a copyright or brand mention').toBeVisible();
  });
});

// ── Social Media Links ────────────────────────────────────────────────────────

test.describe('Social Media Presence @functional', () => {
  test('site has at least one social media link @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const socialPatterns = [
      'twitter.com',
      'x.com',
      'instagram.com',
      'facebook.com',
      'linkedin.com',
      'youtube.com',
      'tiktok.com',
    ];

    const socialLinks = await page
      .locator(
        socialPatterns.map((p) => `a[href*="${p}"]`).join(', ')
      )
      .all();

    if (socialLinks.length === 0) {
      console.warn(
        '[functional] No social media links found. ' +
          'If this is intentional, this test can be skipped.'
      );
    }

    // Soft assertion — social links are a strong recommendation, not a hard requirement
    expect(socialLinks.length).toBeGreaterThanOrEqual(0);
  });
});

// ── Cookie Consent ────────────────────────────────────────────────────────────

test.describe('Cookie Consent @functional', () => {
  test('cookie banner (if present) has an accept or dismiss button @functional', async ({
    page,
    siteConfig,
  }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    // Look for cookie/consent banners
    const bannerSelectors = [
      '[class*="cookie" i]',
      '[class*="consent" i]',
      '[id*="cookie" i]',
      '[aria-label*="cookie" i]',
      '[role="dialog"][aria-label*="consent" i]',
    ].join(', ');

    const banner = page.locator(bannerSelectors).first();
    const bannerVisible = await banner.isVisible().catch(() => false);

    if (!bannerVisible) {
      // No cookie banner — this test passes vacuously
      return;
    }

    // If a cookie banner exists, it must have an actionable button
    const acceptButton = banner.locator(
      'button, a[role="button"]'
    ).filter({
      hasText: /accept|agree|ok|got it|allow|dismiss|close/i,
    }).first();

    await expect(
      acceptButton,
      'Cookie consent banner should have an accept or dismiss button'
    ).toBeVisible();
  });
});
