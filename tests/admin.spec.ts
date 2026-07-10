import { test, expect } from '@playwright/test';

test.describe('Admin Panel Security', () => {
  test('unauthenticated users are redirected from protected routes', async ({ page }) => {
    // Attempt to go directly to project creation
    await page.goto('/admin/projects/new');
    
    // Should be redirected to the login page (or whatever the auth flow is)
    // Next.js middleware typically redirects to /admin
    await expect(page).toHaveURL(/.*\/admin/);
    
    // We expect the login form to be visible
    const emailInput = page.getByPlaceholder('name@example.com');
    await expect(emailInput).toBeVisible();
  });

  test('admin dashboard handles authentication correctly', async ({ page }) => {
    // Go to admin login
    await page.goto('/admin');
    
    // Attempt login with invalid credentials (this should show error, confirming UI works)
    const emailInput = page.getByPlaceholder('name@example.com');
    await emailInput.fill('invalid@example.com');
    
    const passwordInput = page.getByPlaceholder('••••••••');
    await passwordInput.fill('wrongpassword123');
    
    const submitButton = page.getByRole('button', { name: 'Sign In' });
    await submitButton.click();
    
    // Should show error toast or message
    // We wait for the error message to appear, which verifies the UI logic
    await expect(page.locator('text=Invalid login credentials')).toBeVisible({ timeout: 10000 });
  });
});
