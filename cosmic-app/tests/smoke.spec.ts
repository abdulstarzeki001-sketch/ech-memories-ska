import {test,expect} from '@playwright/test';
test('seven-slot navigation, Arabic RTL, and no horizontal scrolling',async({page})=>{
 await page.goto('/');
 await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 await expect(page.locator('.bottom-dock button')).toHaveCount(7);
 await expect(page.locator('.hero-copy h1')).toBeVisible();
 const dimensions=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,document:document.documentElement.scrollWidth}));
 expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport+2);
 await page.locator('.bottom-dock button').nth(1).click();
 await expect(page.getByRole('heading',{name:'مجرّة الصور'})).toBeVisible();
 await expect(page.locator('.detail-hero a[href="../photos.html"]')).toBeVisible();
});
test('search, language switching and accessible controls',async({page})=>{
 await page.goto('/');
 await page.locator('.floating-tools button').click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('dialog').getByRole('button',{name:/الصور/}).click();
 await expect(page.getByRole('heading',{name:'مجرّة الصور'})).toBeVisible();
 await page.getByRole('button',{name:'تغيير اللغة'}).click();
 await expect(page.locator('html')).toHaveAttribute('dir','ltr');
 await expect(page.getByRole('heading',{name:'Galaxy of photographs'})).toBeVisible();
});
test('reduced motion disables WebGL and keeps the interface usable',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await expect(page.locator('.app-shell')).toHaveClass(/reduce-effects/);
 await expect(page.locator('.hero-visual canvas')).toHaveCount(0);
 await page.locator('.bottom-dock button').nth(4).click();
 await expect(page.getByRole('heading',{name:'سينما المجرّة'})).toBeVisible();
});
