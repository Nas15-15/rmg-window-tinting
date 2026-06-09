import { NextResponse } from 'next/server';

const FALLBACK_MODELS = {
  "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma", "Tundra"],
  "Honda": ["Civic", "Accord", "CR-V", "Pilot", "Odyssey"],
  "Ford": ["F-150", "Mustang", "Explorer", "Escape", "Bronco"],
  "Chevrolet": ["Silverado", "Equinox", "Tahoe", "Malibu", "Camaro"],
  "Tesla": ["Model 3", "Model Y", "Model S", "Model X"],
  "BMW": ["3 Series", "5 Series", "X3", "X5", "7 Series"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE"],
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get('make');
  
  if (!make) {
    return NextResponse.json({ error: 'Make is required' }, { status: 400 });
  }

  const defaultModels = FALLBACK_MODELS[make] || ["Standard Sedan", "Standard SUV", "Standard Truck"];

  const apiKey = process.env.API_NINJAS_KEY;
  if (!apiKey) {
    console.warn("API_NINJAS_KEY is not set. Using fallback data.");
    return NextResponse.json(defaultModels.map(m => ({ model: m })));
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`https://api.api-ninjas.com/v1/carmodels?make=${encodeURIComponent(make)}`, {
      headers: { 'X-Api-Key': apiKey },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      console.warn("API Ninjas responded with error. Using fallback data.");
      return NextResponse.json(defaultModels.map(m => ({ model: m })));
    }
    
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
       return NextResponse.json(defaultModels.map(m => ({ model: m })));
    }
    
    // Deduplicate models
    const uniqueModels = [...new Set(data.map(item => item.model))];
    return NextResponse.json(uniqueModels.map(m => ({ model: m })));
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("API Ninjas fetch failed. Using fallback data.", error);
    return NextResponse.json(defaultModels.map(m => ({ model: m })));
  }
}
