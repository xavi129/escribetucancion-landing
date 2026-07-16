"use client"

import { Check } from "lucide-react"
import { Emoji } from "@/components/ui/emoji"
import type { FormData } from "../../types"

interface Step3Props {
  formData: FormData
  onInputChange: (field: keyof FormData, value: string) => void
}

export default function Step3IncludeName({ formData, onInputChange }: Step3Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">¿Quieres incluir un nombre?</h2>
        <p className="text-slate-400 mt-2">
          Podemos personalizar la canción con el nombre de la persona.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onInputChange("includeName", "yes")}
          className={`relative p-6 rounded-2xl border-2 text-left ${formData.includeName === "yes"
            ? "border-brand-terracotta bg-brand-terracotta/20"
            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-brand-terracotta/30"
            }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Emoji emoji="✨" size={28} />
            {formData.includeName === "yes" && (
              <div className="text-brand-terracotta">
                <Check className="w-6 h-6" />
              </div>
            )}
          </div>
          <h3 className={`font-bold text-lg mb-1 transition-colors-fast ${formData.includeName === "yes" ? "text-brand-terracotta" : "text-white"}`}>
            Sí, incluir nombre
          </h3>
          <p className="text-sm text-slate-400">Mencionar el nombre en la letra</p>
        </button>

        <button
          type="button"
          onClick={() => onInputChange("includeName", "no")}
          className={`relative p-6 rounded-2xl border-2 text-left ${formData.includeName === "no"
            ? "border-brand-terracotta bg-brand-terracotta/20"
            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-brand-terracotta/30"
            }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Emoji emoji="😶" size={28} />
            {formData.includeName === "no" && (
              <div className="text-brand-terracotta">
                <Check className="w-6 h-6" />
              </div>
            )}
          </div>
          <h3 className={`font-bold text-lg mb-1 transition-colors-fast ${formData.includeName === "no" ? "text-brand-terracotta" : "text-white"}`}>
            No, sin nombre
          </h3>
          <p className="text-sm text-slate-400">La canción será general</p>
        </button>
      </div>
    </div>
  )
}
