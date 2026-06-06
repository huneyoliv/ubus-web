import { test, expect } from '@playwright/test';

test.describe('Relatórios e Métricas', () => {
  test('Deve logar e carregar a tela de relatórios com as métricas do painel', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'manager@municipality.gov.br');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/);

    await page.click('a[href="/relatorios"]');
    await expect(page).toHaveURL(/\/relatorios/);

    await expect(page.locator('h1')).toContainText('Relatórios & Métricas');

    const cards = page.locator('.flex.flex-col.gap-2.p-6');
    await expect(cards).toHaveCount(4);

    await expect(page.getByText('Estudantes', { exact: true })).toBeVisible();
    await expect(page.getByText('Estudantes Ativos', { exact: true })).toBeVisible();
    await expect(page.getByRole('main').getByText('Motoristas', { exact: true })).toBeVisible();
    await expect(page.getByText('Ônibus Ativos', { exact: true })).toBeVisible();

    await expect(page.getByText('Média Geral de Avaliação')).toBeVisible();
  });
});
