"use client"

import { STYLES } from "../../constants"
import type { FormData } from "../../types"

interface Step9Props {
  formData: FormData
  onStyleChange: (style: string) => void
}

export default function Step9Styles({ formData, onStyleChange }: Step9Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Elige el estilo</h2>
        <p className="text-slate-400 mt-2">
          ¿Cómo quieres que se sienta la canción?
        </p>
        <div className="mt-2 inline-block px-3 py-1 rounded-full bg-brand-terracotta/20 text-brand-terracotta text-xs font-medium border border-brand-terracotta/30">
          Selecciona hasta 2 opciones
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {STYLES.map((option) => {
          const isSelected = formData.styles.includes(option.label)
          return (
            <button
              key={option.label}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onStyleChange(option.label)}
              className={`p-4 rounded-xl border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta ${isSelected
                ? "bg-brand-terracotta/20 border-brand-terracotta text-white font-semibold"
                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
                }`}
            >
              <span className="font-medium">
                {option.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
