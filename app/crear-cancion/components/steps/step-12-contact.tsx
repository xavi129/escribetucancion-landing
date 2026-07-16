"use client"

import type { CSSProperties } from "react"
import dynamic from "next/dynamic"
import { Input } from "@/components/ui/input"
import type { FormData } from "../../types"
import { isValidWhatsApp } from "../../utils"
import { User, MessageCircle } from "lucide-react"

// Lazy load PhoneInput
const PhoneInput = dynamic(() => import("react-phone-number-input"), {
  ssr: false,
  loading: () => (
    <input
      className="w-full h-16 bg-slate-800 border border-slate-700 rounded-xl px-4"
      placeholder="Cargando..."
      disabled
    />
  ),
})

interface Step12ContactProps {
  formData: FormData
  onInputChange: (field: keyof FormData, value: string) => void
  detectedCountry: string
}

export default function Step12Contact({ formData, onInputChange, detectedCountry }: Step12ContactProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 id="contact-section-title" className="text-2xl font-bold text-white">
          Tus datos de contacto
        </h2>
        <p className="text-slate-400 mt-2">
          Para enviarte la cancion y mantenerte informado del progreso.
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Campo de nombre */}
        <div className="space-y-2">
          <label
            htmlFor="customer-name-input"
            className="flex items-center gap-2 text-white font-medium"
          >
            <User className="w-4 h-4 text-brand-terracotta" />
            Tu nombre
          </label>
          <Input
            id="customer-name-input"
            aria-required="true"
            aria-describedby="customer-name-help"
            placeholder="¿Como te llamas?"
            value={formData.customerName}
            onChange={(e) => onInputChange("customerName", e.target.value)}
            className="w-full p-5 text-lg shadow-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-brand-terracotta focus:ring-brand-terracotta/50 rounded-xl"
            autoFocus
          />
          <p id="customer-name-help" className="text-xs text-slate-500">
            Para dirigirnos a ti correctamente
          </p>
        </div>

        {/* Campo de WhatsApp */}
        <div className="space-y-2">
          <label
            htmlFor="whatsapp-input"
            className="flex items-center gap-2 text-white font-medium"
          >
            <MessageCircle className="w-4 h-4 text-green-400" />
            Tu WhatsApp
          </label>
          <PhoneInput
            id="whatsapp-input"
            aria-label="Tu numero de WhatsApp"
            aria-required="true"
            aria-invalid={formData.whatsapp ? !isValidWhatsApp(formData.whatsapp) : undefined}
            aria-describedby="whatsapp-help whatsapp-error"
            international
            countryCallingCodeEditable={false}
            defaultCountry={detectedCountry as any}
            value={formData.whatsapp}
            onChange={(value) => onInputChange("whatsapp", value || "")}
            placeholder="Numero de WhatsApp"
            className={`phone-input-custom p-4 rounded-xl border transition-all ${
              formData.whatsapp && !isValidWhatsApp(formData.whatsapp)
                ? "border-red-500/50 bg-red-500/10"
                : "border-white/10 bg-white/5 focus-within:border-brand-terracotta focus-within:ring-1 focus-within:ring-brand-terracotta/50"
            }`}
            style={{
              "--PhoneInput-color--focus": "rgb(168, 85, 247)",
            } as CSSProperties}
          />
          {formData.whatsapp && !isValidWhatsApp(formData.whatsapp) ? (
            <p
              id="whatsapp-error"
              className="text-red-400 text-sm animate-pulse"
              role="alert"
            >
              Por favor, ingresa un numero valido
            </p>
          ) : (
            <p id="whatsapp-help" className="text-xs text-slate-500">
              Te enviaremos la cancion por este medio
            </p>
          )}
        </div>

        {/* Indicador de datos completos */}
        {formData.customerName && formData.whatsapp && isValidWhatsApp(formData.whatsapp) && (
          <div className="flex items-center justify-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
            <span className="text-green-400 text-sm">
              ¡Listo! Haz clic en "Completar Solicitud" para finalizar
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
