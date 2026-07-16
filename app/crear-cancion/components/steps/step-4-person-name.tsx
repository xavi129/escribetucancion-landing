"use client"

import { Input } from "@/components/ui/input"
import type { FormData } from "../../types"

interface Step4Props {
  formData: FormData
  onInputChange: (field: keyof FormData, value: string) => void
  onNext: () => void
}

export default function Step4PersonName({ formData, onInputChange, onNext }: Step4Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 id="question-person-name" className="text-2xl font-bold text-white">¿Cómo se llama esa persona?</h2>
        <p className="text-slate-400 mt-2">
          Escribe el nombre tal como quieres que suene en la canción.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <Input
          aria-labelledby="question-person-name"
          placeholder="Ej: María, Juan, Mi amor..."
          value={formData.personName}
          onChange={(e) => onInputChange("personName", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              e.preventDefault()
              onNext()
            }
          }}
          className="w-full p-6 text-lg shadow-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-brand-terracotta focus:ring-brand-terracotta/50 rounded-xl"
          autoFocus
        />
      </div>
    </div>
  )
}
