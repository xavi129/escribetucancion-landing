"use client"

import { useRef, useEffect } from "react"
import { Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Emoji } from "@/components/ui/emoji"
import type { FormData } from "../../types"
import { motion, AnimatePresence } from "framer-motion"

interface Step3NameProps {
  formData: FormData
  onInputChange: (field: keyof FormData, value: string) => void
  onNext: () => void
}

export default function Step3Name({ formData, onInputChange, onNext }: Step3NameProps) {
  const inputContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleIncludeNameChange = (value: string) => {
    onInputChange("includeName", value)
    // Si selecciona "no", limpiar el nombre
    if (value === "no") {
      onInputChange("personName", "")
    }
  }

  // Scroll al input cuando aparece y el teclado se abre
  useEffect(() => {
    if (formData.includeName === "yes" && inputContainerRef.current) {
      // Esperar a que termine la animación y el teclado se abra
      const timer = setTimeout(() => {
        inputContainerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
        // Focus en el input después del scroll
        inputRef.current?.focus()
      }, 400)

      return () => clearTimeout(timer)
    }
  }, [formData.includeName])

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 id="question-include-name" className="text-2xl font-bold text-white">
          ¿Quieres incluir un nombre en la cancion?
        </h2>
        <p className="text-slate-400 mt-2">
          Podemos personalizar la cancion con el nombre de la persona.
        </p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        role="radiogroup"
        aria-labelledby="question-include-name"
      >
        <button
          type="button"
          role="radio"
          aria-checked={formData.includeName === "yes"}
          onClick={() => handleIncludeNameChange("yes")}
          className={`relative p-6 rounded-2xl border-2 text-left transition-all ${formData.includeName === "yes"
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
            Si, incluir nombre
          </h3>
          <p className="text-sm text-slate-400">Mencionar el nombre en la letra</p>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={formData.includeName === "no"}
          onClick={() => handleIncludeNameChange("no")}
          className={`relative p-6 rounded-2xl border-2 text-left transition-all ${formData.includeName === "no"
            ? "border-brand-terracotta bg-brand-terracotta/20"
            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-brand-terracotta/30"
            }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Emoji emoji="🎵" size={28} />
            {formData.includeName === "no" && (
              <div className="text-brand-terracotta">
                <Check className="w-6 h-6" />
              </div>
            )}
          </div>
          <h3 className={`font-bold text-lg mb-1 transition-colors-fast ${formData.includeName === "no" ? "text-brand-terracotta" : "text-white"}`}>
            No, sin nombre
          </h3>
          <p className="text-sm text-slate-400">La cancion sera mas general</p>
        </button>
      </div>

      {/* Campo de nombre condicional con animacion */}
      <AnimatePresence mode="wait">
        {formData.includeName === "yes" && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div ref={inputContainerRef} className="max-w-md mx-auto space-y-3 pb-4">
              <label
                htmlFor="person-name-input"
                className="block text-center text-white font-medium"
              >
                ¿Como se llama esa persona?
              </label>
              <p className="text-slate-400 text-sm text-center">
                Escribe el nombre tal como quieres que suene en la cancion.
              </p>
              <Input
                ref={inputRef}
                id="person-name-input"
                aria-required="true"
                aria-describedby="person-name-help"
                placeholder="Ej: Maria, Juan, Mi amor..."
                value={formData.personName}
                onChange={(e) => onInputChange("personName", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing && formData.personName.trim()) {
                    e.preventDefault()
                    onNext()
                  }
                }}
                className="w-full p-6 text-lg shadow-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-brand-terracotta focus:ring-brand-terracotta/50 rounded-xl"
              />
              <p id="person-name-help" className="text-xs text-slate-500 text-center">
                Presiona Enter para continuar
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
