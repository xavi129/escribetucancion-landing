"use client"

import { useState, useEffect } from "react"
import type { Country } from "react-phone-number-input"

/**
 * Validates if a string is a valid ISO 3166-1 alpha-2 country code
 * This is a basic validation that checks format (2 uppercase letters)
 */
function isValidCountryCode(code: string): boolean {
  return /^[A-Z]{2}$/.test(code)
}

/**
 * Hook to detect user's country from IP using Vercel geo headers
 * Returns the detected country code (ISO 3166-1 alpha-2) to use with PhoneInput
 * Falls back to "MX" (Mexico) if detection fails
 */
export function useGeoCountry(fallback: Country = "MX"): Country {
  const [country, setCountry] = useState<Country>(fallback)

  useEffect(() => {
    // SSR safety check - sessionStorage is only available in browser
    if (typeof window === "undefined") {
      return
    }

    // Try to get cached country first
    const cachedCountry = sessionStorage.getItem("detectedCountry")
    if (cachedCountry && isValidCountryCode(cachedCountry)) {
      setCountry(cachedCountry as Country)
      return
    }

    // Fetch country from API
    const fetchCountry = async () => {
      try {
        const response = await fetch("/api/geo")
        if (response.ok) {
          const data = await response.json()
          if (data.country && isValidCountryCode(data.country)) {
            // Cache the detected country for the session
            sessionStorage.setItem("detectedCountry", data.country)
            setCountry(data.country as Country)
          }
        }
      } catch (error) {
        // If fetch fails, keep the fallback
        console.error("Failed to detect country:", error)
      }
    }

    fetchCountry()
  }, [fallback])

  return country
}
