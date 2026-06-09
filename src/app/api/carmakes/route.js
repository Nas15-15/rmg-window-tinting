import { NextResponse } from 'next/server';

const FALLBACK_MAKES = [
  "Acura", "Audi", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler", 
  "Dodge", "Ford", "GMC", "Honda", "Hyundai", "Infiniti", "Jeep", "Kia", 
  "Lexus", "Lincoln", "Mazda", "Mercedes-Benz", "Nissan", "Porsche", 
  "Ram", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  
  if (!year) {
    return NextResponse.json({ error: 'Year is required' }, { status: 400 });
  }

  const apiKey = process.env.API_NINJAS_KEY;
  if (!apiKey) {
    console.warn("API_NINJAS_KEY is not set. Using fallback data.");
    return NextResponse.json(FALLBACK_MAKES);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`https://api.api-ninjas.com/v1/carmakes?year=${year}`, {
      headers: { 'X-Api-Key': apiKey },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      console.warn("API Ninjas responded with error. Using fallback data.");
      return NextResponse.json(FALLBACK_MAKES);
    }
    
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(FALLBACK_MAKES);
    }
    
    // Capitalize first letters as API Ninjas returns lowercase
    const formattedData = data.map(make => make.charAt(0).toUpperCase() + make.slice(1));
    return NextResponse.json(formattedData);
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("API Ninjas fetch failed. Using fallback data.", error);
    return NextResponse.json(FALLBACK_MAKES);
  }
}
