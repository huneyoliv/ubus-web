import { test, expect } from '@playwright/test';

test.describe('Fluxos de Autenticação e Gestão de Frota no Gestor', () => {
  test('Deve logar, persistir no refresh, carregar calendário e gerenciar pontos de embarque', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('#email', 'manager@municipality.gov.br');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');

    // Espera redirecionar para o Dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText('Olá, John!');

    // 2. Persistência no Refresh
    await page.reload();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText('Olá, John!');

    // 3. Navegação para Rotas
    await page.click('a[href="/rotas"]');
    await expect(page).toHaveURL(/\/rotas/);
    await expect(page.locator('h1')).toContainText('Rotas');

    // Clica na primeira rota da listagem para abrir os detalhes
    const firstRouteCard = page.locator('.group.cursor-pointer').first();
    await expect(firstRouteCard).toBeVisible();
    await firstRouteCard.click();

    // Valida que abriu a RotaDetailPage
    await expect(page).toHaveURL(/\/rotas\/[a-f0-9-]{36}/);
    
    // Valida que o calendário foi carregado sem quebrar
    const calendarMonthInput = page.locator('input[type="month"]');
    await expect(calendarMonthInput).toBeVisible();

    // 4. Criação de Ponto de Embarque
    await page.click('text=Adicionar Ponto');
    await expect(page.locator('h3:has-text("Adicionar Ponto de Embarque")')).toBeVisible();

    await page.fill('#point-name', 'Ponto E2E Playwright');
    await page.fill('#lat', '-23.55052');
    await page.fill('#lng', '-46.633308');
    await page.click('button:has-text("Salvar Ponto")');

    // Verifica se o ponto foi criado na listagem
    const pointElement = page.locator('text=Ponto E2E Playwright');
    await expect(pointElement).toBeVisible();

    // 5. Edição do Ponto de Embarque
    const parentContainer = page.locator('.bg-slate-50', { hasText: 'Ponto E2E Playwright' });
    // Clica no botão de editar (ícone Edit2)
    await parentContainer.locator('button').first().click();
    await expect(page.locator('h3:has-text("Editar Ponto de Embarque")')).toBeVisible();

    await page.fill('#point-name', 'Ponto E2E Playwright Alterado');
    await page.click('button:has-text("Salvar Ponto")');

    // Verifica se o ponto foi atualizado na listagem
    const updatedPointElement = page.locator('text=Ponto E2E Playwright Alterado');
    await expect(updatedPointElement).toBeVisible();

    // 6. Deleção do Ponto de Embarque
    // Captura o diálogo do navegador para aceitar o confirm()
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('Excluir ponto de embarque');
      await dialog.accept();
    });

    const updatedParentContainer = page.locator('.bg-slate-50', { hasText: 'Ponto E2E Playwright Alterado' });
    // Clica no segundo botão (ícone Trash2)
    await updatedParentContainer.locator('button').nth(1).click();

    // Verifica se sumiu da listagem
    await expect(updatedPointElement).not.toBeVisible();
  });
});
