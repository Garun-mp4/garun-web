import { expect, test, type Page } from '@playwright/test';

function captureRuntimeErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  return errors;
}

test('homepage interactions, featured projects, FAQ and contact route work', async ({ page }) => {
  test.skip(test.info().project.name === 'mobile-chromium', 'Desktop navigation interaction is covered by the dedicated mobile menu test.');
  const errors = captureRuntimeErrors(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/lenis-autoToggle/);
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');

  const servicesTrigger = page.getByRole('button', { name: 'Открыть список услуг' });
  await servicesTrigger.click();
  await expect(servicesTrigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'ЛЕНДИНГ ПОД КЛЮЧ' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(servicesTrigger).toHaveAttribute('aria-expanded', 'false');

  const heroPreview = page.locator('.hero-preview');
  const marqueeTrack = heroPreview.locator('.hero-preview__track');
  await expect(heroPreview.locator('.hero-preview__shot')).toHaveCount(18);
  const previewRatio = await heroPreview.locator('.hero-preview__frame').evaluate(node => {
    const rect = node.getBoundingClientRect();
    return rect.width / rect.height;
  });
  expect(previewRatio).toBeCloseTo(16 / 9, 1);
  await expect(marqueeTrack).toHaveClass(/is-controlled/);
  await expect(marqueeTrack).toHaveCSS('animation-name', 'none');
  const customCursor = page.locator('.custom-cursor');
  await page.mouse.move(5, 5);
  await expect(customCursor).toHaveClass(/is-visible/);
  await expect(customCursor).toHaveCSS('width', '16px');
  await expect(customCursor).toHaveCSS('mix-blend-mode', 'difference');
  const previewFrame = heroPreview.locator('.hero-preview__frame');
  const previewBounds = await previewFrame.boundingBox();
  expect(previewBounds).not.toBeNull();
  if (!previewBounds) throw new Error('Hero preview frame is not measurable');
  await page.mouse.move(previewBounds.x + previewBounds.width * 0.75, previewBounds.y + previewBounds.height / 2);
  await expect(customCursor).toHaveClass(/is-slider/);
  await expect(customCursor).toHaveCSS('width', '50px');
  const firstShot = heroPreview.locator('.hero-preview__shot').first();
  const firstShotBeforeDrag = await firstShot.boundingBox();
  expect(firstShotBeforeDrag).not.toBeNull();
  if (!firstShotBeforeDrag) throw new Error('First hero shot is not measurable');
  await page.mouse.down();
  await page.mouse.move(previewBounds.x + previewBounds.width * 0.9, previewBounds.y + previewBounds.height / 2, { steps: 6 });
  await page.waitForTimeout(80);
  const firstShotDuringDrag = await firstShot.boundingBox();
  expect(firstShotDuringDrag).not.toBeNull();
  if (!firstShotDuringDrag) throw new Error('First hero shot disappeared during drag');
  expect(Math.abs(firstShotDuringDrag.x - firstShotBeforeDrag.x)).toBeGreaterThan(30);
  await page.mouse.up();
  const beforeManualAdvance = await marqueeTrack.evaluate(node => node.style.transform);
  await page.mouse.click(previewBounds.x + previewBounds.width * 0.75, previewBounds.y + previewBounds.height / 2);
  await expect.poll(() => marqueeTrack.evaluate(node => node.style.transform)).not.toBe(beforeManualAdvance);
  await page.getByRole('link', { name: 'Перейти к проектам' }).click();
  await expect(page.locator('#projects')).toBeInViewport();

  const faq = page.locator('.faq-row > button').first();
  await faq.click();
  await expect(faq).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.faq-row__answer').first()).toBeVisible();

  await expect(page.locator('.project-row')).toHaveCount(6);
  await expect(page.locator('.project-row').first()).toHaveAttribute('href', /^https:\/\//);

  await page.getByRole('link', { name: 'СВЯЗАТЬСЯ' }).first().click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole('heading', { name: 'РАССКАЖИТЕ О ЗАДАЧЕ' })).toBeVisible();
  await page.getByRole('button', { name: /ОТПРАВИТЬ ЗАЯВКУ/ }).click();
  await expect(page.getByRole('alert')).toContainText('Укажите имя и контакт');

  expect(errors).toEqual([]);
});

test('all client routes can be opened directly', async ({ page }) => {
  for (const route of ['/services', '/projects', '/about', '/contact', '/calculator', '/unknown']) {
    const response = await page.goto(route);
    expect(response?.status(), `Expected ${route} to return the SPA shell`).toBe(200);
    await expect(page.locator('main#main')).toBeVisible();
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).not.toBeNull();
    if (!canonical) throw new Error(`Canonical URL is missing for ${route}`);
    const canonicalUrl = new URL(canonical, page.url());
    expect(canonicalUrl.origin).toBe(new URL(page.url()).origin);
    expect(canonicalUrl.pathname).toBe(route);
  }
});

test('calculator validates and completes all seven steps', async ({ page }) => {
  const errors = captureRuntimeErrors(page);
  await page.goto('/calculator');
  const calculator = page.locator('#calculator');

  await calculator.getByRole('button', { name: /ДАЛЕЕ/ }).click();
  await expect(calculator.getByRole('alert')).toContainText('Выберите тип задачи');

  const chooseAndNext = async (label: string): Promise<void> => {
    await calculator.getByText(label, { exact: true }).click();
    await calculator.getByRole('button', { name: /ДАЛЕЕ/ }).click();
  };

  await chooseAndNext('Новый лендинг под ключ');
  await expect(calculator).toContainText('02 / 07');
  await chooseAndNext('6–8');
  await chooseAndNext('Нужен простой дизайн по референсам');

  await calculator.getByText('Форма заявки', { exact: true }).click();
  await calculator.getByText('Интеграция с Telegram', { exact: true }).click();
  await calculator.getByRole('button', { name: /ДАЛЕЕ/ }).click();

  await chooseAndNext('Нужна помощь со структурой');
  await chooseAndNext('Стандартный срок');
  await expect(calculator).toContainText('07 / 07');

  await calculator.getByLabel('Имя *').fill('Тест');
  await calculator.getByLabel('Telegram / телефон / email *').fill('@test');
  await calculator.locator('.consent-row input[type="checkbox"]').check();
  await calculator.getByRole('button', { name: /ПОКАЗАТЬ РАСЧЁТ/ }).click();

  await expect(calculator.getByText('ВАШ ОРИЕНТИР')).toBeVisible();
  await expect(calculator.getByRole('heading', { level: 3 })).toContainText('₽');
  expect(errors).toEqual([]);
});

test('mobile menu is usable without hover', async ({ page }) => {
  const errors = captureRuntimeErrors(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const trigger = page.getByRole('button', { name: 'Открыть меню' });
  await trigger.click();
  await expect(page.locator('#mobile-menu')).toHaveAttribute('aria-hidden', 'false');
  await page.locator('#mobile-menu').getByRole('link', { name: 'ПРОЕКТЫ' }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.locator('#mobile-menu')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('#projects')).toBeInViewport();

  expect(errors).toEqual([]);
});

test('reduced-motion mode disables the custom cursor and scroll scale animation', async ({ page }) => {
  const errors = captureRuntimeErrors(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#about');
  await expect(page.locator('.custom-cursor')).toHaveCount(0);
  await expect(page.locator('.about-frame')).toHaveCSS('transform', 'none');
  await expect(page.locator('.hero-preview__track')).toHaveCSS('animation-name', 'none');
  expect(errors).toEqual([]);
});
