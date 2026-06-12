# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking.spec.js >> Window Tint Booking Form E2E Tests >> should switch to DIY mode and render PayPal integration
- Location: tests\booking.spec.js:145:3

# Error details

```
Error: locator.click: Error: strict mode violation: locator('text=DIY Pre-Cut Kit') resolved to 2 elements:
    1) <a href="#shop" class="Hero-module__-JuD-a__secondaryBtn">Shop DIY Pre-Cut Kits</a> aka getByRole('link', { name: 'Shop DIY Pre-Cut Kits' })
    2) <div class="BookingForm-module__yDNaTa__modeTitle">DIY Pre-Cut Kit</div> aka getByText('DIY Pre-Cut Kit', { exact: true })

Call log:
  - waiting for locator('text=DIY Pre-Cut Kit')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]: RMG Window Tinting
    - navigation [ref=e4]:
      - link "Shop Kits" [ref=e5] [cursor=pointer]:
        - /url: "#shop"
      - link "Work" [ref=e6] [cursor=pointer]:
        - /url: "#gallery"
      - link "Book" [ref=e7] [cursor=pointer]:
        - /url: "#booking"
      - link "TikTok" [ref=e8] [cursor=pointer]:
        - /url: https://www.tiktok.com/@giselle_rmg
  - main [ref=e9]:
    - generic [ref=e10]:
      - img "Premium Window Tinting Result" [ref=e12]
      - generic [ref=e15]:
        - heading "Elevate Your Car's Status & Protect Your Interior Now" [level=1] [ref=e16]
        - paragraph [ref=e17]: With Our Window Tinting Service (100% Satisfaction Guarantee)
        - generic [ref=e18]:
          - link "Book Your Transformation" [ref=e19] [cursor=pointer]:
            - /url: "#booking"
            - text: Book Your Transformation
            - img [ref=e20]
          - link "Shop DIY Pre-Cut Kits" [ref=e22] [cursor=pointer]:
            - /url: "#shop"
    - generic [ref=e23]:
      - generic [ref=e24]:
        - heading "Our Recent Work" [level=2] [ref=e25]
        - generic [ref=e26]:
          - button "All" [ref=e27] [cursor=pointer]
          - button "Photos" [ref=e28] [cursor=pointer]
          - button "Videos" [ref=e29] [cursor=pointer]
      - generic [ref=e30]:
        - generic [ref=e32]:
          - img "Premium Window Tint 1" [ref=e33]
          - generic:
            - generic: Premium Tint
        - generic [ref=e35]:
          - img "Premium Window Tint 2" [ref=e36]
          - generic:
            - generic: Premium Tint
        - generic [ref=e38]:
          - img "Premium Window Tint 3" [ref=e39]
          - generic:
            - generic: Premium Tint
        - generic [ref=e41]:
          - img "Premium Window Tint 4" [ref=e42]
          - generic:
            - generic: Premium Tint
        - generic [ref=e44]:
          - img "Premium Window Tint 5" [ref=e45]
          - generic:
            - generic: Premium Tint
        - generic [ref=e47]:
          - img "Premium Window Tint 6" [ref=e48]
          - generic:
            - generic: Premium Tint
    - generic [ref=e59]:
      - heading "What People Say" [level=2] [ref=e60]
      - generic [ref=e62]:
        - generic [ref=e63]: ★★★★★
        - paragraph [ref=e64]: "\"Most professional in Lehigh.\""
        - generic [ref=e65]: — Nas
    - generic [ref=e67]:
      - heading "Book Your Service" [level=2] [ref=e68]
      - generic [ref=e69]:
        - generic [ref=e70]:
          - generic [ref=e71] [cursor=pointer]:
            - generic [ref=e72]: 🚗
            - generic [ref=e73]: In-Shop Tinting
            - generic [ref=e74]: Expert installation at our shop
          - generic [ref=e75] [cursor=pointer]:
            - generic [ref=e76]: 📦
            - generic [ref=e77]: DIY Pre-Cut Kit
            - generic [ref=e78]: Shipped to your door via UPS
        - generic [ref=e79]:
          - generic [ref=e80]:
            - heading "1. Vehicle Details" [level=3] [ref=e81]
            - generic [ref=e82]:
              - generic [ref=e83]: Year
              - spinbutton "Year" [ref=e84]
            - generic [ref=e85]:
              - generic [ref=e86]: Make
              - combobox "Make" [ref=e87]:
                - option "Select Make" [selected]
                - option "Honda"
                - option "Toyota"
                - option "Ford"
            - generic [ref=e88]:
              - generic [ref=e89]: Model
              - combobox "Model" [disabled] [ref=e90]:
                - option "Select Year & Make first" [selected]
          - generic [ref=e91]:
            - heading "2. Services Required" [level=3] [ref=e92]
            - generic [ref=e93]:
              - generic [ref=e94] [cursor=pointer]:
                - generic [ref=e95]: Window Tinting
                - generic [ref=e96]: Price varies by window
              - generic [ref=e97] [cursor=pointer]:
                - generic [ref=e98]: LED Headlights
                - generic [ref=e99]: +$100
          - generic [ref=e100]:
            - heading "3. Window Coverage" [level=3] [ref=e101]
            - generic [ref=e102]:
              - heading "Click the windows you want tinted" [level=3] [ref=e103]
              - paragraph [ref=e104]: (Top = Passenger Side, Bottom = Driver Side)
              - img [ref=e106]
              - generic [ref=e114]:
                - button "Select Complete Car" [ref=e115] [cursor=pointer]
                - button "Clear Selection" [ref=e116] [cursor=pointer]
          - generic [ref=e117]:
            - heading "4. Contact Info" [level=3] [ref=e118]
            - generic [ref=e119]:
              - generic [ref=e120]:
                - generic [ref=e121]: First Name
                - textbox "First Name" [ref=e122]
              - generic [ref=e123]:
                - generic [ref=e124]: Last Name
                - textbox "Last Name" [ref=e125]
            - generic [ref=e126]:
              - generic [ref=e127]: Phone Number
              - textbox "Phone Number" [ref=e128]:
                - /placeholder: (555) 555-5555
            - generic [ref=e129]:
              - generic [ref=e130]: Email Address
              - textbox "Email Address" [ref=e131]:
                - /placeholder: Optional
          - generic [ref=e132]:
            - generic [ref=e133]:
              - generic [ref=e134]: "Window Coverage:"
              - generic [ref=e135]: 0 sections selected
            - generic [ref=e136]:
              - generic [ref=e137]: "Estimated Total:"
              - generic [ref=e138]: $0
            - generic [ref=e139]:
              - button "Request Booking" [disabled] [ref=e140]
              - paragraph [ref=e141]: No payment required to book. You pay when the work is done.
  - link "Chat on WhatsApp" [ref=e142] [cursor=pointer]:
    - /url: https://wa.me/message/XVZHW73N4VLTF1
    - img [ref=e143]
  - contentinfo [ref=e145]:
    - generic [ref=e146]: 2507 E 18th St, Lehigh Acres, FL | (305) 457-5144
    - generic [ref=e147]: © 2026 RMG Window Tinting. All rights reserved.
    - generic [ref=e148]:
      - text: Made by
      - link "Nas" [ref=e149] [cursor=pointer]:
        - /url: https://naslogic.com
  - button "Open Next.js Dev Tools" [ref=e155] [cursor=pointer]:
    - img [ref=e156]
  - alert [ref=e159]
```

# Test source

```ts
  47  |     const inShopCard = page.locator('text=In-Shop Tinting').first();
  48  |     await expect(inShopCard).toBeVisible();
  49  |   });
  50  | 
  51  |   test('should handle vehicle selection and update models from mock API', async ({ page }) => {
  52  |     const yearInput = page.locator('#vehicle-year');
  53  |     const makeSelect = page.locator('#vehicle-make');
  54  |     const modelSelect = page.locator('#vehicle-model');
  55  | 
  56  |     // Fill Year
  57  |     await yearInput.fill('2023');
  58  | 
  59  |     // Select Make
  60  |     await makeSelect.selectOption('Honda');
  61  | 
  62  |     // Select Model should become enabled and show models
  63  |     await expect(modelSelect).toBeEnabled();
  64  |     await modelSelect.selectOption('Civic');
  65  | 
  66  |     // Verify model selection succeeded
  67  |     await expect(modelSelect).toHaveValue('Civic');
  68  |   });
  69  | 
  70  |   test('should calculate custom prices for window selections and add-ons', async ({ page }) => {
  71  |     // Fill vehicle details to unlock pricing calculations
  72  |     await page.locator('#vehicle-year').fill('2023');
  73  |     await page.locator('#vehicle-make').selectOption('Honda');
  74  |     await page.locator('#vehicle-model').selectOption('Civic');
  75  | 
  76  |     // Initially window coverage is 0 sections selected, total should be $0
  77  |     await expect(page.locator('text=0 sections selected')).toBeVisible();
  78  |     await expect(page.locator('#booking-total-price')).toHaveText('$0');
  79  | 
  80  |     // Click "Select Complete Car" to select all windows
  81  |     await page.locator('text=Select Complete Car').click();
  82  | 
  83  |     // Windows selection should update to 7 pieces for Sedan
  84  |     await expect(page.locator('text=7 sections selected')).toBeVisible();
  85  | 
  86  |     // Estimated total should update and be greater than $0
  87  |     const basePriceText = await page.locator('#booking-total-price').textContent();
  88  |     const basePriceVal = parseFloat(basePriceText.replace('$', ''));
  89  |     expect(basePriceVal).toBeGreaterThan(0);
  90  | 
  91  |     // Toggle LED Headlights
  92  |     await page.locator('text=LED Headlights').click();
  93  |     
  94  |     // Total should increase by $200 (the upgrade price)
  95  |     const newPriceText = await page.locator('#booking-total-price').textContent();
  96  |     const newPriceVal = parseFloat(newPriceText.replace('$', ''));
  97  |     expect(newPriceVal).toBe(basePriceVal + 200);
  98  |   });
  99  | 
  100 |   test('should validate form and submit booking successfully (In-Shop)', async ({ page }) => {
  101 |     // Intercept booking post api
  102 |     let bookingPayload = null;
  103 |     await page.route('**/api/book', async (route) => {
  104 |       bookingPayload = route.request().postDataJSON();
  105 |       await route.fulfill({
  106 |         status: 200,
  107 |         contentType: 'application/json',
  108 |         body: JSON.stringify({ success: true, message: 'Booking confirmed' }),
  109 |       });
  110 |     });
  111 | 
  112 |     // Fill details
  113 |     await page.locator('#vehicle-year').fill('2023');
  114 |     await page.locator('#vehicle-make').selectOption('Honda');
  115 |     await page.locator('#vehicle-model').selectOption('Civic');
  116 | 
  117 |     // Select windows
  118 |     await page.locator('text=Select Complete Car').click();
  119 | 
  120 |     // Fill customer info
  121 |     await page.locator('#customer-first-name').fill('John');
  122 |     await page.locator('#customer-last-name').fill('Doe');
  123 |     await page.locator('#customer-phone').fill('1234567890');
  124 |     await page.locator('#customer-email').fill('john.doe@example.com');
  125 | 
  126 |     // Submit booking request
  127 |     const submitButton = page.locator('button[type="submit"]');
  128 |     await expect(submitButton).toBeEnabled();
  129 |     await submitButton.click();
  130 | 
  131 |     // Verify API request payload is correct
  132 |     await page.waitForResponse('**/api/book');
  133 |     expect(bookingPayload).not.toBeNull();
  134 |     expect(bookingPayload.firstName).toBe('John');
  135 |     expect(bookingPayload.lastName).toBe('Doe');
  136 |     expect(bookingPayload.phone).toBe('1234567890');
  137 |     expect(bookingPayload.email).toBe('john.doe@example.com');
  138 |     expect(bookingPayload.serviceType).toBe('INSTALL');
  139 | 
  140 |     // Verify success screen is shown
  141 |     await expect(page.locator('h3', { hasText: 'Request Sent' })).toBeVisible();
  142 |     await expect(page.locator('text=Thank you, John!')).toBeVisible();
  143 |   });
  144 | 
  145 |   test('should switch to DIY mode and render PayPal integration', async ({ page }) => {
  146 |     // Click DIY Pre-Cut Kit mode
> 147 |     await page.locator('text=DIY Pre-Cut Kit').click();
      |                                                ^ Error: locator.click: Error: strict mode violation: locator('text=DIY Pre-Cut Kit') resolved to 2 elements:
  148 | 
  149 |     // Fill vehicle info
  150 |     await page.locator('#vehicle-year').fill('2023');
  151 |     await page.locator('#vehicle-make').selectOption('Honda');
  152 |     await page.locator('#vehicle-model').selectOption('Civic');
  153 | 
  154 |     // Select windows
  155 |     await page.locator('text=Select Complete Car').click();
  156 | 
  157 |     // Contact info
  158 |     await page.locator('#customer-first-name').fill('Jane');
  159 |     await page.locator('#customer-last-name').fill('Smith');
  160 |     await page.locator('#customer-phone').fill('0987654321');
  161 | 
  162 |     // Verify no "Request Booking" submit button exists (since DIY utilizes PayPal)
  163 |     const submitButton = page.locator('button[type="submit"]');
  164 |     await expect(submitButton).not.toBeVisible();
  165 | 
  166 |     // Verify PayPal buttons note is visible
  167 |     await expect(page.locator('text=Secure checkout powered by PayPal')).toBeVisible();
  168 |   });
  169 | 
  170 |   test('should validate inputs (phone length validation)', async ({ page }) => {
  171 |     // Intercept booking post api to capture failure
  172 |     await page.route('**/api/book', async (route) => {
  173 |       await route.fulfill({
  174 |         status: 400,
  175 |         contentType: 'application/json',
  176 |         body: JSON.stringify({ error: 'Invalid phone number format' }),
  177 |       });
  178 |     });
  179 | 
  180 |     // Fill details
  181 |     await page.locator('#vehicle-year').fill('2023');
  182 |     await page.locator('#vehicle-make').selectOption('Honda');
  183 |     await page.locator('#vehicle-model').selectOption('Civic');
  184 |     await page.locator('text=Select Complete Car').click();
  185 | 
  186 |     // Fill invalid customer info (phone less than 10 digits)
  187 |     await page.locator('#customer-first-name').fill('John');
  188 |     await page.locator('#customer-last-name').fill('Doe');
  189 |     await page.locator('#customer-phone').fill('12345'); // invalid length
  190 | 
  191 |     // Submit
  192 |     const submitButton = page.locator('button[type="submit"]');
  193 |     await submitButton.click();
  194 | 
  195 |     // API returns error, wait for it and verify validation message on UI
  196 |     await page.waitForResponse('**/api/book');
  197 |     await expect(page.locator('text=Invalid phone number format')).toBeVisible();
  198 |   });
  199 | });
  200 | 
```