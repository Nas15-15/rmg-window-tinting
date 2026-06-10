export const PRICING_TIERS = {
  SEDAN: { label: "Sedan / Coupe", basePrice: 250 },
  SUV: { label: "Small SUV / Crossover", basePrice: 280 },
  XL: { label: "Truck / Large SUV", basePrice: 320 }
};

export function getPricingCategory(make, model) {
  if (!model) return PRICING_TIERS.SEDAN;
  
  const modelLower = model.toLowerCase();
  
  if (modelLower.includes('f-150') || modelLower.includes('f-250') || modelLower.includes('silverado') || modelLower.includes('ram') || modelLower.includes('tundra') || modelLower.includes('tahoe') || modelLower.includes('suburban') || modelLower.includes('escalade') || modelLower.includes('navigator')) {
    return PRICING_TIERS.XL;
  }
  
  if (modelLower.includes('suv') || modelLower.includes('cr-v') || modelLower.includes('rav4') || modelLower.includes('rogue') || modelLower.includes('explorer') || modelLower.includes('grand cherokee') || modelLower.includes('highlander') || modelLower.includes('x5') || modelLower.includes('q5')) {
    return PRICING_TIERS.SUV;
  }
  
  // Default to sedan for unknown/standard cars
  return PRICING_TIERS.SEDAN;
}

export const ADDONS = {
  LED_HEADLIGHTS: { label: "LED Headlight Upgrade", price: 100 }
};

export const WINDOW_PRICES = {
  WINDSHIELD: { label: 'Full Windshield', base: 150, sedan: 150, suv: 150, xl: 150 },
  SUN_STRIP: { label: 'Sun Strip', base: 30, sedan: 30, suv: 30, xl: 30 },
  FRONT_LEFT: { label: 'Front Driver Side', base: 45, sedan: 45, suv: 50, xl: 60 },
  FRONT_RIGHT: { label: 'Front Passenger Side', base: 45, sedan: 45, suv: 50, xl: 60 },
  REAR_LEFT: { label: 'Rear Driver Side', base: 45, sedan: 45, suv: 50, xl: 60 },
  REAR_RIGHT: { label: 'Rear Passenger Side', base: 45, sedan: 45, suv: 50, xl: 60 },
  REAR_WINDSHIELD: { label: 'Rear Windshield', base: 70, sedan: 70, suv: 80, xl: 80 },
};

export function getCustomPrice(selectedWindows, tierLabel) {
  let total = 0;
  
  // Map tierLabel to the key in WINDOW_PRICES
  let tierKey = 'sedan';
  if (tierLabel === PRICING_TIERS.SUV.label) tierKey = 'suv';
  if (tierLabel === PRICING_TIERS.XL.label) tierKey = 'xl';

  selectedWindows.forEach(winId => {
    if (WINDOW_PRICES[winId]) {
      total += WINDOW_PRICES[winId][tierKey] || WINDOW_PRICES[winId].base;
    }
  });

  return total;
}
