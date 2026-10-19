import { chromium } from 'playwright';

try {
  const browser = await chromium.launch({ headless: true });
  await browser.close();
} catch (error) {
  console.error(
    'Playwright Chromium is unavailable.\n' +
      'Install it with: bun run test:install\n' +
      'On Linux/CI, install system dependencies too: bunx playwright install --with-deps chromium\n\n' +
      String(error)
  );
  process.exitCode = 1;
}
