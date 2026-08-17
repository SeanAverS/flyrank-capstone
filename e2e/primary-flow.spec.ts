import { test, expect } from '@playwright/test';

test('primary user flow: navigate to FE-AA1 demo and test interactions', async ({ page }) => {
  // 1. Go to home page
  await page.goto('http://localhost:3000/');
  
  // 2. Click FE-AA1 in navbar
  await page.click('text=FE-AA1');
  
  // 3. Verify destination is FE-AA1
  await expect(page.locator('h1')).toContainText('Assignment Demo');
  
  // 4. Test clicking forced success/error triggers
  await page.click('button:has-text("Error State")');
  await expect(page.locator('text=Connection or stream failed')).toBeVisible();
  
  // 5. Reset state
  await page.click('button:has-text("Reset")');
});