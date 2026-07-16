"use client"

import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import { Emoji } from "@/components/ui/emoji"
import { OCCASIONS } from "../../constants"
import type { FormData } from "../../types"

interface Step2Props {
  formData: FormData
  onInputChange: (field: keyof FormData, value: string) => void
  customOccasion: boolean
  setCustomOccasion: (value: boolean) => void
  showAllMap: Record<string, boolean>
  toggleShowAll: (key: string) => void
  onNext: () => void
}

export default function Step2Occasion({
  formData,
  onInputChange,
  customOccasion,
  setCustomOccasion,
  showAllMap,
  toggleShowAll,
  onNext,
}: Step2Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Comencemos a construir tu melodía <Emoji emoji="⭐" size={24} /></h2>
        <p id="question-occasion" className="text-slate-400 mt-2">¿Cuál es la ocasión especial?</p>
      </div>

      {!customOccasion ? (
        <>
          {/* Opciones predefinidas populares */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {(() => {
              const displayed = showAllMap.occasions ? OCCASIONS : OCCASIONS.slice(0, 10)
              return displayed.map((option) => {
                const isSelected = formData.occasion === option.label
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => {
                      onInputChange("occasion", option.label)
                      // Limpiar relación si cambia la ocasión (para evitar inconsistencias)
                      if (formData.occasion !== option.label) {
                        onInputChange("relationship", "")
                      }
                      setCustomOccasion(false)
                    }}
                    className={`flex flex-col items-center justify-center gap-3 p-4 sm:p-6 rounded-xl border-2 ${isSelected
                      ? "bg-brand-terracotta/20 border-brand-terracotta text-white"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                  >
                    <div>
                      <Emoji emoji={option.emoji} size={40} className="sm:w-12 sm:h-12" />
                    </div>
                    <span className={`font-medium text-xs sm:text-sm text-center ${isSelected ? "text-white" : "text-slate-400"}`}>
                      {option.label}
                    </span>
                  </button>
                )
              })
            })()}
          </div>

          {/* Botón mostrar más ocasiones */}
          {!showAllMap.occasions && (
            <button
              type="button"
              onClick={() => toggleShowAll('occasions')}
              className="w-full p-3 mb-4 text-sm text-brand-terracotta hover:text-brand-terracotta flex items-center justify-center gap-2"
            >
              <span>Mostrar 4 opciones más</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          {showAllMap.occasions && (
            <button
              type="button"
              onClick={() => toggleShowAll('occasions')}
              className="w-full p-3 mb-4 text-sm text-slate-400 hover:text-slate-300 flex items-center justify-center gap-2"
            >
              <span>Mostrar menos</span>
            </button>
          )}

          {/* Botón para escribir ocasión personalizada */}
          <button
            type="button"
            onClick={() => {
              setCustomOccasion(true)
              onInputChange("occasion", "")
            }}
            className="w-full p-4 border-2 border-dashed border-white/20 rounded-xl hover:border-brand-terracotta/50 hover:bg-brand-terracotta/10 text-slate-400 hover:text-brand-terracotta flex items-center justify-center gap-2"
          >
            <Emoji emoji="✏️" size={20} />
            <span className="font-medium">Escribir mi propia ocasión</span>
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Input
              aria-labelledby="question-occasion"
              placeholder="Ej: Celebración de logro personal, agradecimiento, etc."
              value={formData.occasion}
              onChange={(e) => onInputChange("occasion", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  onNext()
                }
              }}
              className="w-full p-6 text-lg shadow-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-brand-terracotta focus:ring-brand-terracotta/50"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                setCustomOccasion(false)
                onInputChange("occasion", "")
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <span className="sr-only">Cerrar</span>
              ✕
            </button>
          </div>
          <p className="text-sm text-center text-slate-500">
            Presiona Enter para continuar o{" "}
            <button
              type="button"
              onClick={() => {
                setCustomOccasion(false)
                onInputChange("occasion", "")
              }}
              className="text-brand-terracotta hover:underline"
            >
              vuelve a las opciones
            </button>
          </p>
        </div>
      )}
    </div>
  )
}
