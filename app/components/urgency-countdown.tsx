"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Clock, AlertTriangle, Tag } from "lucide-react"

interface UrgencyCountdownProps {
  className?: string
  variant?: "default" | "compact" | "hero" | "inline"
  showLabel?: boolean
  labelText?: string
  showDiscount?: boolean
  discountAmount?: string
  expiryMessage?: string
  onExpire?: () => void
  initialHours?: number
  initialMinutes?: number
  initialSeconds?: number
}

export default function UrgencyCountdown({
  className,
  variant = "default",
  showLabel = true,
  labelText = "¡Oferta especial termina en:",
  showDiscount = true,
  discountAmount,
  expiryMessage = "¡Oferta expirada!",
  onExpire,
  initialHours = 1,
  initialMinutes = 29,
  initialSeconds = 59,
}: UrgencyCountdownProps) {
  const [countdown, setCountdown] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  })
  const [isExpired, setIsExpired] = useState(false)
  const [isAlmostExpired, setIsAlmostExpired] = useState(false)
  const [liteDiscount, setLiteDiscount] = useState<number | null>(null)

  // Recuperar el tiempo del localStorage si existe
  useEffect(() => {
    // Guard against SSR and ensure localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    const savedCountdown = localStorage.getItem("offerCountdown")
    const savedExpiry = localStorage.getItem("offerExpiryTime")

    if (savedExpiry) {
      const expiryTime = parseInt(savedExpiry, 10)
      const now = Date.now()

      if (now >= expiryTime) {
        setIsExpired(true)
        setCountdown({ hours: 0, minutes: 0, seconds: 0 })
        if (onExpire) onExpire()
      } else {
        // Calcular el tiempo restante
        const remainingMs = expiryTime - now
        const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60))
        const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60))
        const remainingSeconds = Math.floor((remainingMs % (1000 * 60)) / 1000)

        setCountdown({
          hours: remainingHours,
          minutes: remainingMinutes,
          seconds: remainingSeconds,
        })

        // Verificar si está casi expirado (menos de 10 minutos)
        setIsAlmostExpired(remainingMs < 10 * 60 * 1000)
      }
    } else if (savedCountdown && savedCountdown.trim() !== "") {
      // Compatibilidad con versión anterior
      try {
        setCountdown(JSON.parse(savedCountdown))
      } catch (error) {
        console.error("Error parsing saved countdown:", error)
      }
    } else {
      // Si no hay datos guardados, establecer tiempo de expiración
      const totalSeconds = initialHours * 3600 + initialMinutes * 60 + initialSeconds
      const expiryTime = Date.now() + totalSeconds * 1000
      localStorage.setItem("offerExpiryTime", expiryTime.toString())
    }
  }, [])

  // Contador regresivo
  useEffect(() => {
    if (isExpired) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59, hours: prev.hours }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else {
          // Tiempo expirado
          setIsExpired(true)
          if (onExpire) onExpire()
          return { hours: 0, minutes: 0, seconds: 0 }
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isExpired, onExpire])

  // Guardar el tiempo en localStorage cada vez que cambie
  useEffect(() => {
    // Guard against SSR
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    if (!isExpired) {
      localStorage.setItem("offerCountdown", JSON.stringify(countdown))
    }
  }, [countdown, isExpired])

  // Verificar si está casi expirado (menos de 10 minutos)
  useEffect(() => {
    const totalSeconds = countdown.hours * 3600 + countdown.minutes * 60 + countdown.seconds
    setIsAlmostExpired(totalSeconds < 10 * 60 && totalSeconds > 0)
  }, [countdown])

  // Calcular el descuento del plan Lite dinámicamente
  useEffect(() => {
    // Guard against SSR
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    // Obtener precios del experimento desde localStorage
    const storedPrices = localStorage.getItem("experimentPrices")
    if (storedPrices && storedPrices.trim() !== "") {
      try {
        const parsedPrices = JSON.parse(storedPrices)
        const litePrice = parsedPrices.litePlan?.price || 199
        const liteOriginalPrice = parsedPrices.litePlan?.originalPrice || 499

        // Calcular el porcentaje de descuento
        const discountPercentage = Math.round(((liteOriginalPrice - litePrice) / liteOriginalPrice) * 100)
        setLiteDiscount(discountPercentage)
      } catch (error) {
        console.error("Error parsing stored prices:", error)
        // Valores por defecto si hay error (deben coincidir con price-display.tsx)
        const defaultPrice = 199
        const defaultOriginalPrice = 499
        const discountPercentage = Math.round(((defaultOriginalPrice - defaultPrice) / defaultOriginalPrice) * 100)
        setLiteDiscount(discountPercentage)
      }
    } else {
      // Valores por defecto si no hay precios almacenados (deben coincidir con price-display.tsx)
      const defaultPrice = 199
      const defaultOriginalPrice = 499
      const discountPercentage = Math.round(((defaultOriginalPrice - defaultPrice) / defaultOriginalPrice) * 100)
      setLiteDiscount(discountPercentage)
    }
  }, [])

  // Determinar el descuento a mostrar: usar el prop si se proporciona, sino usar el calculado del plan Lite
  const displayDiscount = discountAmount || (liteDiscount !== null ? `${liteDiscount}%` : "30%")

  // Clases según la variante
  const containerClasses = {
    default: "flex flex-col items-center bg-white/90 backdrop-blur-sm border border-purple-300 rounded-lg p-3 shadow-md",
    compact: "flex items-center bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm",
    hero: "flex flex-col items-center bg-purple-600/90 backdrop-blur-sm border-2 border-purple-400 rounded-lg p-4 shadow-lg transform rotate-2",
    inline: "flex items-center space-x-2 text-sm",
  }

  const timerClasses = {
    default: "font-mono font-bold text-xl",
    compact: "font-mono font-medium",
    hero: "font-mono font-bold text-2xl text-white",
    inline: "font-mono font-medium",
  }

  const labelClasses = {
    default: "text-sm font-medium mb-1",
    compact: "mr-2 font-medium",
    hero: "text-base font-bold text-white mb-1",
    inline: "font-medium",
  }

  const discountClasses = {
    default: "mt-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full",
    compact: "ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full",
    hero: "mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg",
    inline: "bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2",
  }

  if (isExpired) {
    return (
      <div className={cn("flex items-center justify-center p-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded backdrop-blur-sm", className)}>
        {expiryMessage}
      </div>
    )
  }

  return (
    <div
      className={cn(
        containerClasses[variant],
        isAlmostExpired ? "animate-pulse" : "",
        className
      )}
    >
      {showLabel && <div className={labelClasses[variant]}>{labelText}</div>}

      <div className="flex items-center">
        <Clock
          className={cn(
            "mr-2",
            variant === "hero" ? "h-5 w-5 text-white" : "h-4 w-4",
            isAlmostExpired ? "text-red-500" : ""
          )}
        />
        <span className={timerClasses[variant]}>
          {String(countdown.hours).padStart(2, "0")}:{String(countdown.minutes).padStart(2, "0")}:
          {String(countdown.seconds).padStart(2, "0")}
        </span>

        {showDiscount && (
          <div className={discountClasses[variant]}>
            <span className="flex items-center">
              <Tag className="h-3 w-3 mr-0.5" /> -{displayDiscount}
            </span>
          </div>
        )}
      </div>

      {isAlmostExpired && variant !== "compact" && variant !== "inline" && (
        <div className="flex items-center mt-1 text-red-500 text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          <span>¡Casi termina!</span>
        </div>
      )}
    </div>
  )
}