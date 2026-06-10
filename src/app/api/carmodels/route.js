import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get('make');
  const year = searchParams.get('year');
  
  if (!make || !year) {
    return NextResponse.json({ error: 'Make and Year are required' }, { status: 400 });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`, 
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      console.warn("NHTSA API responded with error.");
      return NextResponse.json([]);
    }
    
    const data = await res.json();
    if (!data.Results || data.Results.length === 0) {
       return NextResponse.json([]);
    }
    
    // Deduplicate models and format them
    const uniqueModels = [...new Set(data.Results.map(item => item.Model_Name))].sort();
    return NextResponse.json(uniqueModels.map(m => ({ model: m })));
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("NHTSA fetch failed.", error);
    return NextResponse.json([]);
  }
}
