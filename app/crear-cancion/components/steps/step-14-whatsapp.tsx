"use client"

import type { CSSProperties } from "react"
import dynamic from "next/dynamic"
import type { FormData } from "../../types"
import { isValidWhatsApp } from "../../utils"

// Lazy load PhoneInput
const PhoneInput = dynamic(() => import("react-phone-number-input"), {
  ssr: false,
  loading: () => <input className="w-full h-16 bg-slate-800 border border-slate-700 rounded-xl px-4" placeholder="Cargando..." disabled />,
})

interface Step14Props {
  formData: FormData
  onInputChange: (field: keyof FormData, value: string) => void
  detectedCountry: string
}

export default function Step14WhatsApp({ formData, onInputChange, detectedCountry }: Step14Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Tu WhatsApp</h2>
        <p className="text-slate-400 mt-2">
          Te enviaremos la canción por este medio.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="space-y-2">
          <PhoneInput
            aria-label="Tu WhatsApp"
            international
            countryCallingCodeEditable={false}
            defaultCountry={detectedCountry as any}
            value={formData.whatsapp}
            onChange={(value) => onInputChange("whatsapp", value || "")}
            placeholder="Número de WhatsApp"
            className={`phone-input-custom p-4 rounded-xl border transition-all ${formData.whatsapp && !isValidWhatsApp(formData.whatsapp) ? "border-red-500/50 bg-red-500/10" : "border-white/10 bg-white/5 focus-within:border-brand-terracotta focus-within:ring-1 focus-within:ring-brand-terracotta/50"}`}
            style={{
              '--PhoneInput-color--focus': 'rgb(168, 85, 247)',
            } as CSSProperties}
          />
          {formData.whatsapp && !isValidWhatsApp(formData.whatsapp) && (
            <p className="text-red-400 text-sm text-center animate-pulse">
              Por favor, ingresa un número válido
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
