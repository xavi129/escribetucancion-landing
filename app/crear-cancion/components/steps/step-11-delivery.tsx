"use client"

import { Check } from "lucide-react"
import { Emoji } from "@/components/ui/emoji"
import { formatPrice } from "@/lib/format-price"
import type { CurrencyCode } from "@/lib/currency-config"
import type { FormData } from "../../types"

interface Step11Props {
  formData: FormData
  onInputChange: (field: keyof FormData, value: string) => void
  spotsRemaining: number
  currency: CurrencyCode
  currencyPrices: {
    express_delivery: number
    [key: string]: number
  }
}

export default function Step11Delivery({
  formData,
  onInputChange,
  spotsRemaining,
  currency,
  currencyPrices,
}: Step11Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white"><Emoji emoji="🚀" size={24} /> ¿Qué velocidad de entrega requieres?</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Opción 1: Estándar (Lenta/Decoy) */}
        <button
          type="button"
          onClick={() => onInputChange("deliveryType", "slow")}
          className={`relative p-6 rounded-2xl border-2 text-left ${formData.deliveryType === "slow"
            ? "border-slate-500 bg-slate-500/20"
            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-slate-500/30"
            }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-500/20 flex items-center justify-center grayscale opacity-70">
                <Emoji emoji="🚚" size={28} />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${formData.deliveryType === "slow" ? "text-slate-300" : "text-slate-400"}`}>
                  Entrega Estándar
                </h3>
                <p className="text-sm text-slate-500">10 - 12 días</p>
              </div>
            </div>
            <div className="text-right">
              <span className="block font-bold text-slate-400">Sin costo</span>
            </div>
          </div>
          {formData.deliveryType === "slow" && (
            <div className="absolute top-4 right-4 text-slate-500">
              <Check className="w-5 h-5" />
            </div>
          )}
        </button>

        {/* Opción 2: Rápida (Target/Promo Black Week) */}
        <button
          type="button"
          onClick={() => onInputChange("deliveryType", "standard")}
          className={`relative p-6 rounded-2xl border-2 text-left ${formData.deliveryType === "standard"
            ? "border-brand-terracotta bg-brand-terracotta/20"
            : "border-brand-terracotta/30 bg-brand-bordeaux/10 hover:bg-brand-bordeaux/20 hover:border-brand-terracotta/50"
            }`}
        >
          {/* Badge Black Week */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg flex items-center gap-1 border border-white/20 whitespace-nowrap z-10">
            <Emoji emoji="🔥" size={14} /> OFERTA LIMITADA: GRATIS
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-terracotta to-brand-bordeaux flex items-center justify-center shadow-lg">
                <Emoji emoji="🏃" size={28} />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${formData.deliveryType === "standard" ? "text-white" : "text-white"}`}>
                  Entrega Rápida
                </h3>
                <p className="text-sm text-brand-terracotta/80">3 - 5 Días</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-red-400 font-medium">¡Primeros 40 cupos!</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="block font-bold text-green-400 text-lg">Sin costo</span>
              <div className="text-xs text-orange-400 font-medium mt-1">
                Cupos restantes: {spotsRemaining}
              </div>
            </div>
          </div>
          {formData.deliveryType === "standard" && (
            <div className="absolute top-4 right-4 bg-brand-terracotta rounded-full p-1 shadow-lg">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </button>

        {/* Opción 3: Urgente (Upsell) */}
        <button
          type="button"
          onClick={() => onInputChange("deliveryType", "express")}
          className={`relative p-6 rounded-2xl border-2 text-left ${formData.deliveryType === "express"
            ? "border-amber-500 bg-amber-500/20"
            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-500/30"
            }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Emoji emoji="⚡" size={28} />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${formData.deliveryType === "express" ? "text-amber-400" : "text-white"}`}>
                  Entrega Urgente
                </h3>
                <p className="text-sm text-slate-400">24 horas</p>
              </div>
            </div>
            <div className="text-right">
              <span className="block font-bold text-amber-400 text-lg">{formatPrice(currencyPrices.express_delivery, currency)}</span>
              <span className="text-xs text-slate-500 line-through">{formatPrice(currencyPrices.express_delivery * 2, currency)}</span>
            </div>
          </div>
          {formData.deliveryType === "express" && (
            <div className="absolute top-4 right-4 text-amber-400">
              <Check className="w-5 h-5" />
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
