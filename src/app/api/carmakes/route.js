import { NextResponse } from 'next/server';

const COMMON_MAKES = [
  "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler", 
  "Dodge", "Ferrari", "FIAT", "Ford", "Genesis", "GMC", "Honda", "Hyundai", "Infiniti", "Jaguar", "Jeep", "Kia", 
  "Lamborghini", "Land Rover", "Lexus", "Lincoln", "Lucid", "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "MINI", "Mitsubishi", "Nissan", "Polestar", "Porsche", 
  "Ram", "Rivian", "Rolls-Royce", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"
];

export async function GET(request) {
  // Using a comprehensive pre-defined list of common passenger vehicle makes is highly recommended
  // because the raw NHTSA 'GetMakesForVehicleType' endpoint returns thousands of obscure industrial 
  // manufacturers which makes the dropdown unusable. 
  // However, we ensure that every single model for these makes will be fetched correctly from NHTSA.
  
  return NextResponse.json(COMMON_MAKES);
}
