"use client"

import { Input } from "@/components/ui/input"
import type { FormData } from "../../types"

interface Step13Props {
  formData: FormData
  onInputChange: (field: keyof FormData, value: string) => void
}

export default function Step13CustomerName({ formData, onInputChange }: Step13Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">¿Cómo te llamas?</h2>
        <p className="text-slate-400 mt-2">
          Para dirigirnos a ti correctamente.
        </p>
      </div>
      <div className="max-w-md mx-auto">
        <Input
          aria-label="Tu nombre"
          placeholder="Tu nombre"
          value={formData.customerName}
          onChange={(e) => onInputChange("customerName", e.target.value)}
          className="w-full p-6 text-lg shadow-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-brand-terracotta focus:ring-brand-terracotta/50 rounded-xl"
          autoFocus
        />
      </div>
    </div>
  )
}
