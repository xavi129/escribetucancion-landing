import { NextRequest, NextResponse } from "next/server"

/**
 * API route to detect user's country from Vercel geo headers
 * Vercel automatically provides geo-location headers for all requests:
 * - x-vercel-ip-country: Two-letter country code (ISO 3166-1 alpha-2)
 * - x-vercel-ip-city: City name
 * - x-vercel-ip-country-region: Region/state code
 * 
 * @see https://vercel.com/docs/concepts/edge-network/headers#x-vercel-ip-country
 */
export async function GET(request: NextRequest) {
  // Get country from Vercel headers
  const country = request.headers.get("x-vercel-ip-country")
  
  // Fallback to Mexico if country detection fails or in development
  const detectedCountry = country || "MX"
  
  return NextResponse.json({
    country: detectedCountry,
  })
}
