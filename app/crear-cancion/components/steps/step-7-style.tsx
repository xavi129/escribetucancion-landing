"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { STYLES } from "../../constants"
import type { FormData } from "../../types"
import { motion, AnimatePresence } from "framer-motion"

interface Step7StyleProps {
  formData: FormData
  onStyleChange: (style: string) => void
  onInputChange: (field: keyof FormData, value: string) => void
}

export default function Step7Style({ formData, onStyleChange, onInputChange }: Step7StyleProps) {
  const [showAdvanced, setShowAdvanced] = useState(!!formData.references)

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 id="question-style" className="text-2xl font-bold text-white">
          Elige el estilo de la cancion
        </h2>
        <p className="text-slate-400 mt-2">
          ¿Como quieres que se sienta la cancion?
        </p>
        <div className="mt-2 inline-block px-3 py-1 rounded-full bg-brand-terracotta/20 text-brand-terracotta text-xs font-medium border border-brand-terracotta/30">
          Selecciona hasta 2 opciones
        </div>
      </div>

      {/* Grid de estilos */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        role="group"
        aria-labelledby="question-style"
      >
        {STYLES.map((option) => {
          const isSelected = formData.styles.includes(option.label)
          return (
            <button
              key={option.label}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => onStyleChange(option.label)}
              className={`p-4 rounded-xl border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta ${
                isSelected
                  ? "bg-brand-terracotta/20 border-brand-terracotta text-white font-semibold"
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <span className="font-medium">{option.label}</span>
            </button>
          )
        })}
      </div>

      {/* Seccion avanzada expandible */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
          aria-expanded={showAdvanced}
          aria-controls="advanced-references"
        >
          <Sparkles className="w-4 h-4 text-brand-terracotta" />
          <span className="text-sm font-medium">
            {showAdvanced ? "Ocultar" : "Agregar"} referencias musicales (opcional)
          </span>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        <AnimatePresence mode="wait">
          {showAdvanced && (
            <motion.div
              id="advanced-references"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-3">
                <label
                  htmlFor="references-input"
                  className="block text-sm text-slate-400"
                >
                  Menciona artistas o canciones que te gusten como referencia
                </label>
                <Textarea
                  id="references-input"
                  aria-describedby="references-help"
                  placeholder="Ej: Bad Bunny, Karol G, Peso Pluma, 'Feliz Cumpleanos' de Banda MS..."
                  value={formData.references}
                  onChange={(e) => onInputChange("references", e.target.value)}
                  className="min-h-[100px] p-4 text-base shadow-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-brand-terracotta focus:ring-brand-terracotta/50 rounded-xl resize-none"
                />
                <p id="references-help" className="text-xs text-slate-500">
                  Esto nos ayuda a entender mejor el estilo que buscas
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Indicador de seleccion */}
      {formData.styles.length > 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <span>
            {formData.styles.length === 1
              ? `Estilo seleccionado: ${formData.styles[0]}`
              : `Estilos seleccionados: ${formData.styles.join(" + ")}`}
          </span>
        </div>
      )}
    </div>
  )
}
