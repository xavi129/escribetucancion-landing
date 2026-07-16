"use client"

import { useMemo } from "react"
import { useGeoCountry } from "./use-geo-country"
import {
  CurrencyCode,
  getCurrencyForCountry,
  CURRENCY_CONFIGS,
  DEFAULT_CURRENCY
} from "@/lib/currency-config"

export interface UseCurrencyResult {
  currency: CurrencyCode
  prices: {
    lite: number
    standard: number
    premium: number
    lite_original: number
    standard_original: number
    premium_original: number
    express_delivery: number
    spotify_upload: number
    video: number
    extra_editions: number
  }
  advance: number
  symbol: string
  locale: string
  country: string
}

export function useCurrency(): UseCurrencyResult {
  const country = useGeoCountry("MX")

  return useMemo(() => {
    const currency = getCurrencyForCountry(country)
    const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS[DEFAULT_CURRENCY]

    return {
      currency,
      prices: config.prices,
      advance: config.advance,
      symbol: config.symbol,
      locale: config.locale,
      country
    }
  }, [country])
}
