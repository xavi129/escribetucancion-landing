"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Sparkles, Music, Palette } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { STYLES, getGenresByCountry } from "../../constants"
import { useGeoCountry } from "@/app/hooks/use-geo-country"
import type { FormData } from "../../types"
import { motion, AnimatePresence } from "framer-motion"

interface Step6MusicProps {
  formData: FormData
  onInputChange: (field: keyof FormData, value: string) => void
  onStyleChange: (style: string) => void
  showAllMap: Record<string, boolean>
  toggleShowAll: (key: string) => void
}

export default function Step6Music({
  formData,
  onInputChange,
  onStyleChange,
  showAllMap,
  toggleShowAll,
}: Step6MusicProps) {
  const [showReferences, setShowReferences] = useState(!!formData.references)

  // Get user's country to filter genres
  const country = useGeoCountry()
  const countryGenres = getGenresByCountry(country)

  const visibleGenres = (showAllMap.genres ? countryGenres : countryGenres.slice(0, 8)).filter(
    (genre) => genre.label !== "Otro"
  )
  const totalGenresWithoutOtro = countryGenres.filter((genre) => genre.label !== "Otro").length
  const remainingGenres = totalGenresWithoutOtro - visibleGenres.length

  return (
    <div id="step-7-music-preferences" className="space-y-8">
      {/* Encabezado principal */}
      <div className="text-center">
        <h2 id="question-music" className="text-2xl font-bold text-white">
          Preferencias musicales
        </h2>
        <p className="text-slate-400 mt-2">
          Define el sonido de tu cancion
        </p>
      </div>

      {/* Seccion 1: Genero Musical */}
      <div id="genre-section" className="space-y-4">
        <div className="flex items-center gap-2 text-white font-medium">
          <Music className="w-5 h-5 text-brand-terracotta" />
          <span>Genero musical</span>
          <span className="text-red-400 text-sm">*</span>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
          role="radiogroup"
          aria-labelledby="question-music"
        >
          {visibleGenres.map((option) => {
            const isSelected = formData.genre === option.label
            return (
              <button
                key={option.label}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onInputChange("genre", option.label)}
                className={`p-3 rounded-xl border-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta ${
                  isSelected
                    ? "bg-brand-terracotta/20 border-brand-terracotta text-white font-semibold"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {option.label}
              </button>
            )
          })}
          <button
            type="button"
            role="radio"
            aria-checked={formData.genre === "Otro"}
            onClick={() => onInputChange("genre", "Otro")}
            className={`p-3 rounded-xl border-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta ${
              formData.genre === "Otro"
                ? "bg-brand-terracotta/20 border-brand-terracotta text-white font-semibold"
                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
            }`}
          >
            Otro
          </button>
        </div>

        {/* Boton para mostrar mas generos */}
        {(remainingGenres > 0 || showAllMap.genres) && (
          <button
            type="button"
            onClick={() => toggleShowAll("genres")}
            className="w-full p-2 rounded-xl border border-dashed border-white/20 text-slate-400 text-sm hover:bg-white/5 hover:border-white/30 transition-colors"
          >
            {showAllMap.genres ? "Mostrar menos" : `+${remainingGenres} generos mas`}
          </button>
        )}

        {/* Input para genero personalizado */}
        <AnimatePresence mode="wait">
          {formData.genre === "Otro" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                placeholder="Escribe el genero musical..."
                value={formData.customGenre || ""}
                onChange={(e) => onInputChange("customGenre", e.target.value)}
                className="w-full p-4 text-base bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-brand-terracotta focus:ring-brand-terracotta/50 rounded-xl"
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10" />

      {/* Seccion 2: Estilo */}
      <div id="style-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-medium">
            <Palette className="w-5 h-5 text-brand-bordeaux" />
            <span>Estilo de la cancion</span>
            <span className="text-red-400 text-sm">*</span>
          </div>
          <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-full">
            Hasta 2 opciones
          </span>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-5 gap-2"
          role="group"
          aria-label="Estilos de cancion"
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
                className={`p-3 rounded-xl border-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta ${
                  isSelected
                    ? "bg-brand-bordeaux/20 border-brand-bordeaux text-white font-semibold"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>

        {/* Indicador de seleccion */}
        {formData.styles.length > 0 && (
          <p className="text-xs text-slate-500 text-center">
            {formData.styles.length === 1
              ? `Seleccionado: ${formData.styles[0]}`
              : `Seleccionados: ${formData.styles.join(" + ")}`}
          </p>
        )}
      </div>

      {/* Seccion 3: Referencias (opcional, expandible) */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setShowReferences(!showReferences)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
          aria-expanded={showReferences}
          aria-controls="references-section"
        >
          <Sparkles className="w-4 h-4 text-brand-terracotta" />
          <span className="text-sm font-medium">
            {showReferences ? "Ocultar" : "Agregar"} referencias musicales (opcional)
          </span>
          {showReferences ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        <AnimatePresence mode="wait">
          {showReferences && (
            <motion.div
              id="references-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-2">
                <Textarea
                  aria-describedby="references-help"
                  placeholder="Ej: Bad Bunny, Karol G, Peso Pluma, 'Feliz Cumpleanos' de Banda MS..."
                  value={formData.references}
                  onChange={(e) => onInputChange("references", e.target.value)}
                  className="min-h-[80px] p-4 text-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-brand-terracotta focus:ring-brand-terracotta/50 rounded-xl resize-none"
                />
                <p id="references-help" className="text-xs text-slate-500">
                  Menciona artistas o canciones similares al estilo que buscas
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Resumen de selecciones */}
      {(formData.genre || formData.styles.length > 0) && (
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <p className="text-xs text-slate-400 text-center">
            {formData.genre && <span className="text-brand-terracotta">{formData.genre === "Otro" ? formData.customGenre || "Genero personalizado" : formData.genre}</span>}
            {formData.genre && formData.styles.length > 0 && " · "}
            {formData.styles.length > 0 && <span className="text-brand-bordeaux">{formData.styles.join(" + ")}</span>}
          </p>
        </div>
      )}
    </div>
  )
}
