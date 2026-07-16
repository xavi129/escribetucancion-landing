"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/format-price"
import type { CurrencyCode } from "@/lib/currency-config"

interface HeroPriceDisplayProps {
  className?: string
  prefixText?: string
  showPrefix?: boolean
  size?: "sm" | "md" | "lg"
}

export default function HeroPriceDisplay({
  className,
  prefixText = "Desde solo",
  showPrefix = true,
  size = "md",
}: HeroPriceDisplayProps) {
  const [experimentPrices, setExperimentPrices] = useState({
    litePlan: { price: 199, originalPrice: 499 },
    standardPlan: { price: 349, originalPrice: 1199 },
    premiumPlan: { price: 899, originalPrice: 1599 },
  })
  const [currency, setCurrency] = useState<CurrencyCode>("MXN")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Guard against SSR and ensure localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    // Obtener precios del experimento desde localStorage
    const storedPrices = localStorage.getItem("experimentPrices")
    if (storedPrices && storedPrices.trim() !== "") {
      try {
        const prices = JSON.parse(storedPrices)
        // Solo usar precios almacenados si no están en estado de carga
        if (!prices.isLoading) {
          setExperimentPrices(prices)
          if (prices.currency) {
            setCurrency(prices.currency)
          }
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error parsing stored prices:", error)
        // No establecer isLoading(false) aquí, esperar al evento
      }
    }

    // Esperar evento global con los precios reales del experimento
    const onExperimentPricesUpdated = (e: Event) => {
      const detail = (e as CustomEvent).detail as any
      if (detail && !detail.isLoading) {
        setExperimentPrices(detail)
        if (detail.currency) {
          setCurrency(detail.currency)
        }
        setIsLoading(false)
      }
    }

    window.addEventListener("experimentPricesUpdated", onExperimentPricesUpdated)
    
    // Fallback timeout: If no prices loaded after 500ms, show defaults
    const fallbackTimer = setTimeout(() => {
      setIsLoading((prev) => {
        if (prev) return false
        return prev
      })
    }, 500)

    return () => {
      window.removeEventListener("experimentPricesUpdated", onExperimentPricesUpdated)
      clearTimeout(fallbackTimer)
    }
  }, [])

  // Calcular el porcentaje de descuento
  const discountPercentage = Math.round(
    ((experimentPrices.litePlan.originalPrice - experimentPrices.litePlan.price) /
      experimentPrices.litePlan.originalPrice) *
      100,
  )

  // Determinar las clases según el tamaño
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  // Si está cargando, mostrar un placeholder
  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {showPrefix && <span className="text-white whitespace-nowrap">{prefixText}</span>}
        <span className={cn("bg-gray-200 text-transparent font-bold px-8 py-1 rounded-full animate-pulse whitespace-nowrap", sizeClasses[size])}>
          &#8203;
        </span>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showPrefix && <span className="text-white whitespace-nowrap">{prefixText}</span>}

      <span
        className={cn(
          "text-white/80 line-through whitespace-nowrap",
          sizeClasses[size] === "text-lg" ? "text-base" : "text-xs",
        )}
      >
        {formatPrice(experimentPrices.litePlan.originalPrice, currency)}
      </span>

      <span className={cn("bg-white text-black font-bold px-2 py-1 rounded-full whitespace-nowrap", sizeClasses[size])}>
        {formatPrice(experimentPrices.litePlan.price, currency)}
      </span>

      <span className="bg-red-500 text-white font-bold px-2 py-1 rounded-full text-xs whitespace-nowrap">
        -{discountPercentage}%
      </span>
    </div>
  )
}

