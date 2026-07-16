"use client"

import { Textarea } from "@/components/ui/textarea"
import type { FormData } from "../../types"

interface Step7Props {
  formData: FormData
  onInputChange: (field: keyof FormData, value: string) => void
}

export default function Step7References({ formData, onInputChange }: Step7Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 id="question-references" className="text-2xl font-bold text-white">Referencias Musicales (Opcional)</h2>
        <p className="text-slate-400 mt-2">
          Menciona artistas o canciones que te gusten como referencia.
        </p>
        <p className="text-slate-500 text-sm mt-1">
          Esto nos ayuda a entender mejor el género y estilo que buscas.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <Textarea
          aria-labelledby="question-references"
          placeholder="Ej: Bad Bunny, Karol G, Peso Pluma..."
          value={formData.references}
          onChange={(e) => onInputChange("references", e.target.value)}
          className="min-h-[150px] p-4 text-lg shadow-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-brand-terracotta focus:ring-brand-terracotta/50 rounded-xl resize-none"
        />
      </div>
    </div>
  )
}
