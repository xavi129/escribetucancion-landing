"use client"

import { useState, useEffect } from "react"
import { useCurrency } from "./use-currency"
import type { CurrencyCode } from "@/lib/currency-config"

export interface PriceExperimentData {
  lite_plan_price: number
  standard_plan_price: number
  premium_plan_price: number
  lite_plan_original_price: number
  standard_plan_original_price: number
  premium_plan_original_price: number
  express_delivery_price: number
  spotify_upload_price: number
  video_price: number
  extra_editions_price: number
  currency: CurrencyCode
  isLoading?: boolean
}

export function usePriceExperiment() {
  const { currency, prices } = useCurrency()

  const [experimentPrices, setExperimentPrices] = useState<PriceExperimentData>({
    lite_plan_price: prices.lite,
    standard_plan_price: prices.standard,
    premium_plan_price: prices.premium,
    lite_plan_original_price: prices.lite_original,
    standard_plan_original_price: prices.standard_original,
    premium_plan_original_price: prices.premium_original,
    express_delivery_price: prices.express_delivery,
    spotify_upload_price: prices.spotify_upload,
    video_price: prices.video,
    extra_editions_price: prices.extra_editions,
    currency: currency,
    isLoading: false,
  })

  useEffect(() => {
    // Guard against SSR
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    const newPrices: PriceExperimentData = {
      lite_plan_price: prices.lite,
      standard_plan_price: prices.standard,
      premium_plan_price: prices.premium,
      lite_plan_original_price: prices.lite_original,
      standard_plan_original_price: prices.standard_original,
      premium_plan_original_price: prices.premium_original,
      express_delivery_price: prices.express_delivery,
      spotify_upload_price: prices.spotify_upload,
      video_price: prices.video,
      extra_editions_price: prices.extra_editions,
      currency: currency,
      isLoading: false,
    }

    setExperimentPrices(newPrices)

    // Guardar los precios en localStorage para que otros componentes puedan acceder a ellos
    const experimentPricesForStorage = {
      litePlan: {
        price: prices.lite,
        originalPrice: prices.lite_original,
      },
      standardPlan: {
        price: prices.standard,
        originalPrice: prices.standard_original,
      },
      premiumPlan: {
        price: prices.premium,
        originalPrice: prices.premium_original,
      },
      expressDelivery: prices.express_delivery,
      spotifyUpload: prices.spotify_upload,
      video: prices.video,
      extraEditions: prices.extra_editions,
      currency: currency,
      isLoading: false,
    }

    localStorage.setItem("experimentPrices", JSON.stringify(experimentPricesForStorage))

    // Notificar a otros componentes que los precios estan listos
    try {
      window.dispatchEvent(
        new CustomEvent("experimentPricesUpdated", { detail: experimentPricesForStorage })
      )
    } catch (_) {
      // Ignorar si el entorno no soporta window (SSR safeguard)
    }
  }, [currency, prices])

  return experimentPrices
}
