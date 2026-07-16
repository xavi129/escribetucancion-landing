import { test, expect } from '@playwright/test';

test.describe('Song Creation Wizard', () => {
  // Increase timeout for this test as it involves many steps
  test.setTimeout(90000);

  /**
   * Updated Flow (10 steps):
   * 1. Song Type
   * 2. Occasion
   * 3. Include Name
   * 4. Relationship
   * 5. Voice Gender
   * 6. Your Story
   * 7. Music Preferences
   * 8. Delivery Type
   * 9. Extras (Video Lyric + Spotify Upload)
   * 10. Contact (Customer Name + WhatsApp)
   */

  test('Happy Path: Complete freemium song creation flow', async ({ page }) => {
    // 1. Mock External Services

    // Mock Geo API (for country-based genre filtering)
    await page.route('/api/geo', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ country: 'MX' }),
      });
    });

    // Mock Supabase order saving
    await page.route('**/rest/v1/orders', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { id: 'mock-order-id' } }),
      });
    });

    // Mock Statsig & other analytics to prevent network errors
    const emptyJson = { status: 200, contentType: 'application/json', body: '{}' };
    await page.route('https://api.statsig.com/**', async (route) => route.fulfill(emptyJson));
    await page.route('https://prodregistryv2.org/**', async (route) => route.fulfill(emptyJson));
    await page.route('https://featureassets.org/**', async (route) => route.fulfill(emptyJson));

    // Mock Stripe
    await page.route('/api/create-checkout-session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ url: 'https://checkout.stripe.com/mock-url' }),
      });
    });

    // Mock Lyrics Generation API (to avoid API key errors)
    await page.route('/api/generate-lyrics', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          lyrics: [
            'Esta es una canción de prueba\nGenerada para el test\nCon mucho amor y alegría\nPara celebrar este momento especial'
          ]
        }),
      });
    });

    // 2. Start the flow
    await page.goto('/crear-cancion');

    // Step 1: Song Type
    await expect(page.getByText('Canción Lite')).toBeVisible();
    await page.getByText('Canción Lite').click();

    const nextButton = page.getByRole('button', { name: /Siguiente/i });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // Step 2: Occasion
    await expect(page.getByText('¿Cuál es la ocasión especial?')).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: /Cumpleaños/ }).click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Step 3: Include Name (combined step with conditional input)
    await expect(page.getByText('¿Quieres incluir un nombre en la cancion?')).toBeVisible();
    await page.getByRole('radio', { name: /No, sin nombre/ }).click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Step 4: Relationship
    await expect(page.getByText('¿Qué parentesco tiene contigo esa persona?')).toBeVisible();
    await page.getByRole('button', { name: /Un amigo\/a/ }).click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Step 5: Voice Gender
    await expect(page.getByText('¿Qué voz prefieres?')).toBeVisible();
    await page.getByRole('button', { name: /Voz Masculina/ }).click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Step 6: Your Story (Details)
    await expect(page.getByRole('heading', { name: 'Cuéntanos tu historia', exact: true })).toBeVisible({ timeout: 15000 });
    await page.getByPlaceholder(/Ej: Nos conocimos en la universidad/i).fill('Es un gran amigo.');
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Step 7: Music Preferences (Genre + Style + References combined)
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Preferencias musicales')).toBeVisible({ timeout: 15000 });

    // Select "Otro" and fill custom genre field
    await expect(page.getByRole('radio', { name: 'Otro' })).toBeVisible({ timeout: 20000 });
    await page.getByRole('radio', { name: 'Otro' }).click();

    // Wait for custom genre input to appear and fill it
    await expect(page.getByPlaceholder(/Escribe el genero musical/i)).toBeVisible({ timeout: 5000 });
    await page.getByPlaceholder(/Escribe el genero musical/i).fill('Rock');

    // Select style
    await expect(page.getByRole('checkbox', { name: 'Alegre' })).toBeVisible({ timeout: 10000 });
    await page.getByRole('checkbox', { name: 'Alegre' }).click();

    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Step 8: Delivery Type
    await expect(page.getByText('¿Qué velocidad de entrega requieres?')).toBeVisible();
    await page.getByText('Entrega Rápida').click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Step 9: Extras (Video Lyric + Spotify Upload) - optional, skip
    await expect(page.getByText('Complementa tu experiencia')).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Step 10: Contact (combined: Customer Name + WhatsApp)
    await expect(page.getByText('Tus datos de contacto')).toBeVisible({ timeout: 15000 });
    await page.getByPlaceholder(/¿Como te llamas?/i).fill('Juan Pérez');
    await page.getByPlaceholder('Numero de WhatsApp').fill('+525512345678');

    // Verify form is ready to submit (button should be enabled with valid data)
    await expect(page.getByRole('button', { name: /Completar Solicitud|Completar/i })).toBeEnabled();

    // NOTE: Skipping navigation to /confirmacion due to Next.js 15 bug:
    // "InvariantError: Expected clientReferenceManifest to be defined"
  });

  test('Happy Path: Include name in song', async ({ page }) => {
    // Mock services
    // Mock Geo API (for country-based genre filtering)
    await page.route('/api/geo', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ country: 'MX' }),
      });
    });

    await page.route('**/rest/v1/orders', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { id: 'mock-order-id' } }),
      });
    });

    const emptyJson = { status: 200, contentType: 'application/json', body: '{}' };
    await page.route('https://api.statsig.com/**', async (route) => route.fulfill(emptyJson));
    await page.route('https://prodregistryv2.org/**', async (route) => route.fulfill(emptyJson));
    await page.route('https://featureassets.org/**', async (route) => route.fulfill(emptyJson));

    // Mock Lyrics Generation API (to avoid API key errors)
    await page.route('/api/generate-lyrics', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          lyrics: [
            'Esta es una canción de prueba\nGenerada para el test\nCon mucho amor y alegría\nPara celebrar este momento especial'
          ]
        }),
      });
    });

    await page.goto('/crear-cancion');

    // Step 1: Song Type
    await page.getByText('Canción Lite').click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Step 2: Occasion
    await expect(page.getByText('¿Cuál es la ocasión especial?')).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: /Cumpleaños/ }).click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Step 3: Include Name - Select YES and fill name
    await expect(page.getByText('¿Quieres incluir un nombre en la cancion?')).toBeVisible();
    await page.getByRole('radio', { name: /Si, incluir nombre/ }).click();

    // Wait for the name input to appear (animated)
    await expect(page.getByPlaceholder(/Ej: Maria, Juan, Mi amor/i)).toBeVisible({ timeout: 5000 });
    await page.getByPlaceholder(/Ej: Maria, Juan, Mi amor/i).fill('María');
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Step 4: Relationship
    await expect(page.getByText('¿Qué parentesco tiene contigo esa persona?')).toBeVisible();
    await page.getByRole('button', { name: /Mi novio\/a/ }).click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Continue with remaining steps...
    // Step 5: Voice Gender
    await expect(page.getByText('¿Qué voz prefieres?')).toBeVisible();
    await page.getByRole('button', { name: /Voz Femenina/ }).click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Step 6: Your Story
    await expect(page.getByRole('heading', { name: 'Cuéntanos tu historia', exact: true })).toBeVisible({ timeout: 15000 });
    await page.getByPlaceholder(/Ej: Nos conocimos en la universidad/i).fill('Nuestra historia de amor.');
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Step 7: Music Preferences
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Preferencias musicales')).toBeVisible({ timeout: 15000 });

    // Select "Otro" and fill custom genre field
    await expect(page.getByRole('radio', { name: 'Otro' })).toBeVisible({ timeout: 20000 });
    await page.getByRole('radio', { name: 'Otro' }).click();

    // Wait for custom genre input to appear and fill it
    await expect(page.getByPlaceholder(/Escribe el genero musical/i)).toBeVisible({ timeout: 5000 });
    await page.getByPlaceholder(/Escribe el genero musical/i).fill('Bachata');

    // Select style
    await expect(page.getByRole('checkbox', { name: 'Romántica' })).toBeVisible({ timeout: 10000 });
    await page.getByRole('checkbox', { name: 'Romántica' }).click();

    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Step 8: Delivery
    await expect(page.getByText('¿Qué velocidad de entrega requieres?')).toBeVisible({ timeout: 15000 });
    await page.getByText('Entrega Rápida').click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Step 9: Extras (Video Lyric + Spotify Upload) - optional, skip
    await expect(page.getByText('Complementa tu experiencia')).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Step 10: Contact
    await expect(page.getByText('Tus datos de contacto')).toBeVisible({ timeout: 15000 });
    await page.getByPlaceholder(/¿Como te llamas?/i).fill('Carlos');
    await page.getByPlaceholder('Numero de WhatsApp').fill('+525598765432');

    // Verify form is ready to submit (button should be enabled with valid data)
    await expect(page.getByRole('button', { name: /Completar Solicitud|Completar/i })).toBeEnabled();

    // NOTE: Skipping navigation to /confirmacion due to Next.js 15 bug:
    // "InvariantError: Expected clientReferenceManifest to be defined"
  });
});
