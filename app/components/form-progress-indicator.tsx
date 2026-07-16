"use client"

import { cn } from "@/lib/utils"

interface FormProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  stepNames?: string[]
  className?: string
  variant?: "default" | "compact" | "detailed"
  showLabels?: boolean
  showPercentage?: boolean
  activeColor?: string
  inactiveColor?: string
}

export default function FormProgressIndicator({
  currentStep,
  totalSteps,
  stepNames,
  className,
  variant = "default",
  showLabels = true,
  showPercentage = true,
  activeColor = "bg-gradient-to-r from-brand-terracotta via-brand-bordeaux to-brand-forest",
  inactiveColor = "bg-white/10",
}: FormProgressIndicatorProps) {
  // Calcular el progreso como porcentaje
  const progressPercentage = Math.round((currentStep / totalSteps) * 100)

  // Mensaje motivacional basado en el progreso
  const getMotivationalMessage = () => {
    if (progressPercentage <= 25) return "¡Empezamos bien!"
    if (progressPercentage <= 50) return "¡Vas genial!"
    if (progressPercentage <= 75) return "¡Ya falta poco!"
    if (progressPercentage < 100) return "¡Casi terminas!"
    return "¡Completado!"
  }

  // Determinar si mostrar pasos individuales o solo una barra de progreso
  const showSteps = variant === "detailed" && totalSteps <= 10

  // Generar nombres de pasos predeterminados si no se proporcionan
  const defaultStepNames = Array.from({ length: totalSteps }, (_, i) => `Paso ${i + 1}`)
  const displayStepNames = stepNames || defaultStepNames

  // Determinar qué etiquetas mostrar según la variante
  const getStepLabel = (index: number) => {
    if (variant === "detailed") {
      return displayStepNames[index]
    } else if (variant === "default") {
      // Para la variante predeterminada, mostrar solo etiquetas clave
      if (index === 0) return "Inicio"
      if (index === totalSteps - 1) return "Final"
      if (index === Math.floor(totalSteps / 2)) return "Mitad"
      return ""
    }
    return ""
  }

  // Renderizar pasos individuales para la variante detallada
  const renderSteps = () => {
    return (
      <div className="flex justify-between w-full mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index < currentStep
          const isCurrent = index === currentStep - 1

          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className={cn(
                  "w-4 h-4 rounded-full transition-all duration-300",
                  isCurrent ? "ring-2 ring-brand-terracotta ring-offset-2 ring-offset-brand-ink shadow-[0_0_10px_rgba(255,107,107,0.5)]" : "",
                  isActive ? activeColor : inactiveColor
                )}
              />
              {showLabels && (
                <span className={cn(
                  "text-xs mt-1 transition-all duration-300",
                  isCurrent ? "font-bold text-white sm:text-transparent sm:bg-clip-text sm:bg-gradient-to-r sm:from-brand-terracotta sm:to-brand-gold sm:webkit-text-gradient" : "text-slate-500",
                  variant === "compact" && !isCurrent ? "hidden" : ""
                )}>
                  {getStepLabel(index)}
                </span>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Mostrar pasos individuales para la variante detallada con pocos pasos */}
      {showSteps && renderSteps()}

      {/* Barra de progreso principal */}
      <div className="w-full bg-brand-inkSoft/50 rounded-full h-3 mb-1 backdrop-blur-sm border border-white/5 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(236,72,153,0.6)] relative", activeColor)}
          style={{ width: `${progressPercentage}%` }}
        >
          {/* Shine effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent"></div>
        </div>
      </div>

      {/* Información de progreso */}
      <div className="flex justify-between items-center text-xs mt-1">
        <span className="font-medium text-slate-300">
          {getMotivationalMessage()}
        </span>
        {showPercentage && (
          <span className="font-bold text-white sm:text-transparent sm:bg-clip-text sm:bg-gradient-to-r sm:from-brand-terracotta sm:to-brand-gold sm:webkit-text-gradient">{progressPercentage}%</span>
        )}
      </div>
    </div>
  )
}
