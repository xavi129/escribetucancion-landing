"use client"

import { Input } from "@/components/ui/input"
import { GENRE_COLORS, getGenresByCountry } from "../../constants"
import { useGeoCountry } from "@/app/hooks/use-geo-country"
import type { FormData } from "../../types"

interface Step6Props {
  formData: FormData
  onInputChange: (field: keyof FormData, value: string) => void
  showAllMap: Record<string, boolean>
  toggleShowAll: (key: string) => void
}

export default function Step6Genre({
  formData,
  onInputChange,
  showAllMap,
  toggleShowAll,
}: Step6Props) {
  // Get user's country to filter genres
  const country = useGeoCountry()
  const countryGenres = getGenresByCountry(country)

  const visibleGenres = (showAllMap.genres ? countryGenres : countryGenres.slice(0, 10)).filter(
    (genre) => genre.label !== "Otro"
  )
  const totalGenresWithoutOtro = countryGenres.filter((genre) => genre.label !== "Otro").length
  const remainingGenres = totalGenresWithoutOtro - visibleGenres.length

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 id="question-genre" className="text-2xl font-bold text-white">Elige el género musical</h2>
        <p className="text-slate-400 mt-2">¿Qué ritmo te gustaría para tu canción?</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {visibleGenres.map((option) => {
          const isSelected = formData.genre === option.label
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onInputChange("genre", option.label)}
              className={`p-4 rounded-xl border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta ${isSelected
                ? "bg-brand-terracotta/20 border-brand-terracotta text-white font-semibold"
                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
                }`}
            >
              <span className="font-medium">
                {option.label}
              </span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => onInputChange("genre", "Otro")}
          className={`p-4 rounded-xl border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta ${formData.genre === "Otro"
            ? "bg-brand-terracotta/20 border-brand-terracotta text-white font-semibold"
            : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
            }`}
        >
          <span className="font-medium">
            Otro
          </span>
        </button>
        {(remainingGenres > 0 || showAllMap.genres) && (
          <button
            type="button"
            onClick={() => toggleShowAll("genres")}
            className="col-span-2 sm:col-span-3 p-3 rounded-xl border border-dashed border-white/20 text-slate-400 hover:bg-white/5 hover:border-white/30"
          >
            {showAllMap.genres ? "Mostrar menos" : `Mostrar ${remainingGenres} géneros más`}
          </button>
        )}
      </div>

      {formData.genre === "Otro" && (
        <div className="mt-4">
          <Input
            aria-labelledby="question-genre"
            placeholder="Escribe el género musical..."
            value={formData.customGenre || ""}
            onChange={(e) => onInputChange("customGenre", e.target.value)}
            className="w-full p-6 text-lg shadow-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-brand-terracotta focus:ring-brand-terracotta/50 rounded-xl"
            autoFocus
          />
        </div>
      )}
    </div>
  )
}
