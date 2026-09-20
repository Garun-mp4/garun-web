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
  await expect(marqueeTrack).toHaveCSS('animation-name', 'hero-preview-marquee');
  await heroPreview.hover();
  await expect(marqueeTrack).toHaveCSS('animation-play-state', 'paused');
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
