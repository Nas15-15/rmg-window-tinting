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

export const DIY_KIT = {
  pricePerWindow: 25,
  minWindows: 2,
  maxWindows: 8
};
