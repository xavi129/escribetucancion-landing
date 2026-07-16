"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { logPriceView } from "@/app/utils/statsig"
import { formatPrice } from "@/lib/format-price"
import type { CurrencyCode } from "@/lib/currency-config"

interface PriceDisplayProps {
  planType: "lite" | "standard" | "premium"
  className?: string
  textColor?: string
  showOriginalPrice?: boolean
  showDiscount?: boolean
  size?: "sm" | "md" | "lg"
  prefixText?: string
  showPrefix?: boolean
  trackView?: boolean // Si debe rastrear la visualización automáticamente
}
export default function PriceDisplay({
  planType = "lite",
  className,
  textColor = "text-gray-900",
  showOriginalPrice = true,
  showDiscount = true,
  size = "md",
  prefixText = "Desde",
  showPrefix = false,
  trackView = false,
}: PriceDisplayProps) {
  const [prices, setPrices] = useState({
    lite: { price: 199, originalPrice: 499 },
    standard: { price: 349, originalPrice: 1199 },
    premium: { price: 899, originalPrice: 1599 },
  })
  const [currency, setCurrency] = useState<CurrencyCode>("MXN")
  const [isLoading, setIsLoading] = useState(true)
  const hasTrackedView = useRef(false)

  useEffect(() => {
    // Guard against SSR and ensure localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    // Obtener precios del experimento desde localStorage
    const storedPrices = localStorage.getItem("experimentPrices")
    if (storedPrices && storedPrices.trim() !== "") {
      try {
        const parsedPrices = JSON.parse(storedPrices)
        // Solo usar precios almacenados si no están en estado de carga
        if (!parsedPrices.isLoading) {
          setPrices({
            lite: parsedPrices.litePlan,
            standard: parsedPrices.standardPlan,
            premium: parsedPrices.premiumPlan,
          })
          if (parsedPrices.currency) {
            setCurrency(parsedPrices.currency)
          }
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error parsing stored prices:", error)
        // No establecer isLoading(false) aquí, esperar al evento
      }
    }

    // Esperar a que el hook publique los precios reales del experimento
    const onExperimentPricesUpdated = (e: Event) => {
      const detail = (e as CustomEvent).detail as any
      if (detail && !detail.isLoading) {
        setPrices({
          lite: detail.litePlan,
          standard: detail.standardPlan,
          premium: detail.premiumPlan,
        })
        if (detail.currency) {
          setCurrency(detail.currency)
        }
        setIsLoading(false)
      }
    }

    window.addEventListener("experimentPricesUpdated", onExperimentPricesUpdated)
    
    return () => {
      window.removeEventListener("experimentPricesUpdated", onExperimentPricesUpdated)
    }
  }, [])

  // Rastrear visualización del precio
  useEffect(() => {
    if (trackView && !hasTrackedView.current && !isLoading) {
      const price = prices[planType].price
      logPriceView(planType, price)
      hasTrackedView.current = true
    }
  }, [trackView, isLoading, planType, prices])

  const price = prices[planType].price
  const originalPrice = prices[planType].originalPrice

  // Calcular el porcentaje de descuento
  const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100)

  // Determinar las clases según el tamaño
  const sizeClasses = {
    sm: "text-xs gap-1",
    md: "text-sm gap-2",
    lg: "text-base gap-2",
  }

  const priceClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg font-bold",
  }

  // Si está cargando, mostrar un placeholder o nada
  if (isLoading) {
    return (
      <div className={cn("flex items-center", sizeClasses[size], className)}>
        {showPrefix && prefixText && <span className={cn(textColor)}>{prefixText}</span>}
        <span className={cn("font-bold animate-pulse bg-gray-200 rounded", textColor, priceClasses[size], "px-8 py-1")}>&#8203;</span>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center flex-wrap", sizeClasses[size], className)}>
      {showPrefix && prefixText && <span className={cn(textColor)}>{prefixText}</span>}

      {showOriginalPrice && originalPrice > price && (
        <span className="text-gray-500 line-through">{formatPrice(originalPrice, currency)}</span>
      )}

      <span className={cn("font-bold", textColor, priceClasses[size])}>{formatPrice(price, currency)}</span>

      {showDiscount && discountPercentage > 0 && (
        <span className="bg-red-500 text-white font-bold px-2 py-1 rounded-full text-xs">-{discountPercentage}%</span>
      )}
    </div>
  )
}

