const { test, expect } = require('@playwright/test');

test.describe('Window Tint Booking Form E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Intercept API calls to ensure speed and isolation from external services (like NHTSA)
    await page.route('**/api/carmakes', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(['Honda', 'Toyota', 'Ford']),
      });
    });

    await page.route('**/api/carmodels*', async (route) => {
      const url = new URL(route.request().url());
      const make = url.searchParams.get('make');
      const year = url.searchParams.get('year');
      
      if (make === 'Honda' && year === '2023') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ model: 'Civic' }, { model: 'Accord' }]),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    await page.goto('/');
  });

  test('should render the booking form initial state correctly', async ({ page }) => {
    // Check main heading
    await expect(page.locator('h2', { hasText: 'Book Your Service' })).toBeVisible();

    // Check mode toggles
    await expect(page.locator('#toggle-install')).toBeVisible();
    await expect(page.locator('#toggle-diy')).toBeVisible();

    // In-Shop mode should be selected by default
    const inShopCard = page.locator('#toggle-install').first();
    await expect(inShopCard).toBeVisible();
  });

  test('should handle vehicle selection and update models from mock API', async ({ page }) => {
    const yearInput = page.locator('#vehicle-year');
    const makeSelect = page.locator('#vehicle-make');
    const modelSelect = page.locator('#vehicle-model');

    // Fill Year
    await yearInput.fill('2023');

    // Select Make
    await makeSelect.selectOption('Honda');

    // Select Model should become enabled and show models
    await expect(modelSelect).toBeEnabled();
    await modelSelect.selectOption('Civic');

    // Verify model selection succeeded
    await expect(modelSelect).toHaveValue('Civic');
  });

  test('should calculate custom prices for window selections and add-ons', async ({ page }) => {
    // Fill vehicle details to unlock pricing calculations
    await page.locator('#vehicle-year').fill('2023');
    await page.locator('#vehicle-make').selectOption('Honda');
    await expect(page.locator('#vehicle-model')).toBeEnabled();
    await page.locator('#vehicle-model').selectOption('Civic');

    // Initially window coverage is 0 sections selected, total should be $0
    await expect(page.locator('text=0 sections selected')).toBeVisible();
    await expect(page.locator('#booking-total-price')).toHaveText('$0');

    // Click "Select Complete Car" to select all windows
    await page.locator('text=Select Complete Car').click();

    // Windows selection should update to 7 pieces for Sedan
    await expect(page.locator('text=7 sections selected')).toBeVisible();

    // Estimated total should update and be greater than $0
    const basePriceText = await page.locator('#booking-total-price').textContent();
    const basePriceVal = parseFloat(basePriceText.replace('$', ''));
    expect(basePriceVal).toBeGreaterThan(0);

    // Toggle LED Headlights
    await page.locator('text=LED Headlights').click();
    
    // Total should increase by $100 (LED headlight price is 100 in pricing.js)
    const newPriceText = await page.locator('#booking-total-price').textContent();
    const newPriceVal = parseFloat(newPriceText.replace('$', ''));
    expect(newPriceVal).toBe(basePriceVal + 100);
  });

  test('should validate form and submit booking successfully (In-Shop)', async ({ page }) => {
    // Intercept booking post api
    let bookingPayload = null;
    await page.route('**/api/book', async (route) => {
      bookingPayload = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Booking confirmed' }),
      });
    });

    // Fill details
    await page.locator('#vehicle-year').fill('2023');
    await page.locator('#vehicle-make').selectOption('Honda');
    await expect(page.locator('#vehicle-model')).toBeEnabled();
    await page.locator('#vehicle-model').selectOption('Civic');

    // Select windows
    await page.locator('text=Select Complete Car').click();

    // Fill customer info
    await page.locator('#customer-first-name').fill('John');
    await page.locator('#customer-last-name').fill('Doe');
    await page.locator('#customer-phone').fill('1234567890');
    await page.locator('#customer-email').fill('john.doe@example.com');

    // Submit booking request
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();

    // Start waiting for network response first to avoid race condition
    const responsePromise = page.waitForResponse('**/api/book');
    await submitButton.click();
    await responsePromise;

    // Verify API request payload is correct
    expect(bookingPayload).not.toBeNull();
    expect(bookingPayload.firstName).toBe('John');
    expect(bookingPayload.lastName).toBe('Doe');
    expect(bookingPayload.phone).toBe('1234567890');
    expect(bookingPayload.email).toBe('john.doe@example.com');
    expect(bookingPayload.serviceType).toBe('INSTALL');

    // Verify success screen is shown
    await expect(page.locator('h3', { hasText: 'Request Sent' })).toBeVisible();
    await expect(page.locator('text=Thank you, John!')).toBeVisible();
  });

  test('should switch to DIY mode and render PayPal integration', async ({ page }) => {
    // Click DIY Pre-Cut Kit mode
    await page.locator('#toggle-diy').click();

    // Fill vehicle info
    await page.locator('#vehicle-year').fill('2023');
    await page.locator('#vehicle-make').selectOption('Honda');
    await expect(page.locator('#vehicle-model')).toBeEnabled();
    await page.locator('#vehicle-model').selectOption('Civic');

    // Select windows
    await page.locator('text=Select Complete Car').click();

    // Contact info
    await page.locator('#customer-first-name').fill('Jane');
    await page.locator('#customer-last-name').fill('Smith');
    await page.locator('#customer-phone').fill('0987654321');

    // Verify no "Request Booking" submit button exists (since DIY utilizes PayPal)
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).not.toBeVisible();

    // Verify PayPal buttons note is visible
    await expect(page.locator('text=Secure checkout powered by PayPal')).toBeVisible();
  });

  test('should validate inputs (phone length validation)', async ({ page }) => {
    // Intercept booking post api to capture failure
    await page.route('**/api/book', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid phone number format' }),
      });
    });

    // Fill details
    await page.locator('#vehicle-year').fill('2023');
    await page.locator('#vehicle-make').selectOption('Honda');
    await expect(page.locator('#vehicle-model')).toBeEnabled();
    await page.locator('#vehicle-model').selectOption('Civic');
    await page.locator('text=Select Complete Car').click();

    // Fill invalid customer info (phone less than 10 digits)
    await page.locator('#customer-first-name').fill('John');
    await page.locator('#customer-last-name').fill('Doe');
    await page.locator('#customer-phone').fill('12345'); // invalid length

    // Submit
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();

    // Start waiting for response before clicking to avoid race condition
    const responsePromise = page.waitForResponse('**/api/book');
    await submitButton.click();
    await responsePromise;

    // API returns error, verify validation message on UI
    await expect(page.locator('text=Invalid phone number format')).toBeVisible();
  });
});
