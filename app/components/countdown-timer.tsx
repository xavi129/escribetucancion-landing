"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  className?: string
  variant?: "full" | "compact"
}

// Hook personalizado para compartir el tiempo entre componentes
export function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Calcular tiempo restante hasta las 23:59:59 de hoy
    const calculateTimeLeft = () => {
      const now = new Date()
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)

      const difference = endOfDay.getTime() - now.getTime()

      if (difference > 0) {
        return {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      }

      return { hours: 0, minutes: 0, seconds: 0 }
    }

    // Actualizar inmediatamente
    setTimeLeft(calculateTimeLeft())

    // Actualizar cada segundo
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return timeLeft
}

export const formatTime = (num: number) => String(num).padStart(2, '0')

export default function CountdownTimer({ className = "", variant = "full" }: CountdownTimerProps) {
  const timeLeft = useCountdown()

  if (variant === "compact") {
    return (
      <span className={className}>
        {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
      </span>
    )
  }

  return (
    <div className={className}>
      <div className="bg-slate-900/60 backdrop-blur-xl text-white px-4 py-2 rounded-full flex items-center shadow-[0_0_20px_rgba(168,85,247,0.2)] border border-white/10 w-full md:w-auto justify-center gap-2 group hover:bg-slate-900/80 transition-all duration-300">
        <div className="bg-red-500/20 p-1.5 rounded-full animate-pulse">
          <Clock className="h-4 w-4 text-red-400" />
        </div>
        <span className="font-medium text-xs sm:text-sm text-slate-300 uppercase tracking-wider whitespace-nowrap">Oferta termina en:</span>
        <div className="flex items-center gap-1">
          <span className="font-mono font-bold text-white text-sm sm:text-base bg-white/5 px-2 py-0.5 rounded-md border border-white/5 shadow-inner">
            {formatTime(timeLeft.hours)}
          </span>
          <span className="text-slate-500 font-bold">:</span>
          <span className="font-mono font-bold text-white text-sm sm:text-base bg-white/5 px-2 py-0.5 rounded-md border border-white/5 shadow-inner">
            {formatTime(timeLeft.minutes)}
          </span>
          <span className="text-slate-500 font-bold">:</span>
          <span className="font-mono font-bold text-white text-sm sm:text-base bg-white/5 px-2 py-0.5 rounded-md border border-white/5 shadow-inner">
            {formatTime(timeLeft.seconds)}
          </span>
        </div>
      </div>
    </div>
  )
}
