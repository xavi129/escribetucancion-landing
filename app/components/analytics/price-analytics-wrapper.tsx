"use client"

import { useEffect, useRef, ReactNode } from "react"
import { logPriceView, logPriceSelection, logCheckoutStarted } from "@/app/utils/statsig"

interface PriceAnalyticsWrapperProps {
  planType: "lite" | "standard" | "premium"
  price: number
  variant?: string
  children: ReactNode
  onCheckout?: () => void
  trackView?: boolean // Si debe rastrear la visualización automáticamente
  trackClick?: boolean // Si debe rastrear el clic en el plan
}

/**
 * Componente wrapper para rastrear automáticamente las interacciones con los precios
 * 
 * Uso:
 * <PriceAnalyticsWrapper 
 *   planType="standard" 
 *   price={749} 
 *   variant={variant}
 *   trackView={true}
 *   trackClick={true}
 * >
 *   <div>Contenido del plan</div>
 * </PriceAnalyticsWrapper>
 */
export default function PriceAnalyticsWrapper({
  planType,
  price,
  variant,
  children,
  onCheckout,
  trackView = true,
  trackClick = false,
}: PriceAnalyticsWrapperProps) {
  const hasTrackedView = useRef(false)

  // Rastrear visualización del precio
  useEffect(() => {
    if (trackView && !hasTrackedView.current && price && variant) {
      logPriceView(planType, price, variant)
      hasTrackedView.current = true
    }
  }, [planType, price, variant, trackView])

  // Manejar clic en el plan
  const handleClick = async () => {
    if (trackClick) {
      await logPriceSelection(planType, price, variant)
    }
  }

  // Manejar inicio de checkout
  const handleCheckoutClick = async () => {
    await logCheckoutStarted(planType, price, variant)
    if (onCheckout) {
      onCheckout()
    }
  }

  // Si trackClick está activado, envolver en un div con onClick
  if (trackClick) {
    return (
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>
    )
  }

  return <>{children}</>
}
