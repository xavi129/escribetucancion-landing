"use client"

import { Input } from "@/components/ui/input"
import { Emoji } from "@/components/ui/emoji"
import { RELATIONSHIPS, OCCASION_CATEGORIES } from "../../constants"
import type { FormData, Relationship } from "../../types"

interface Step5Props {
  formData: FormData
  onInputChange: (field: keyof FormData, value: string) => void
  customRelationship: boolean
  setCustomRelationship: (value: boolean) => void
  showAllMap: Record<string, boolean>
  toggleShowAll: (key: string) => void
  onNext: () => void
}


function getFilteredRelationships(occasion: string): Relationship[] {
  const allowedCategories = OCCASION_CATEGORIES[occasion] || ["romantic", "family", "friends", "general", "memorial"]
  const filtered = RELATIONSHIPS.filter(rel =>
    rel.categories.some(cat => allowedCategories.includes(cat))
  )
  return filtered.length > 0 ? filtered : RELATIONSHIPS
}

export default function Step5Relationship({
  formData,
  onInputChange,
  customRelationship,
  setCustomRelationship,
  showAllMap,
  toggleShowAll,
  onNext,
}: Step5Props) {
  const filteredRelationships = getFilteredRelationships(formData.occasion)
  const visibleRelationships = filteredRelationships.length > 10 && !showAllMap.relationships
    ? filteredRelationships.slice(0, 10)
    : filteredRelationships

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 id="question-relationship" className="text-2xl font-bold text-white">¿Qué parentesco tiene contigo esa persona?</h2>
        <p className="text-slate-400 mt-2">(Nos ayudará a personalizar la letra de tu melodía)</p>
      </div>

      {!customRelationship ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {visibleRelationships.map((option) => {
              const isSelected = formData.relationship === option.label
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => {
                    onInputChange("relationship", option.label)
                    setCustomRelationship(false)
                  }}
                  className={`flex flex-col items-center justify-center gap-3 p-4 sm:p-6 rounded-xl border-2 ${isSelected
                    ? "bg-brand-terracotta/20 border-brand-terracotta text-white"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                    }`}
                >
                  <div>
                    <Emoji emoji={option.emoji} size={40} className="sm:w-12 sm:h-12" />
                  </div>
                  <span className={`font-medium text-xs sm:text-sm text-center ${isSelected ? "text-white font-semibold" : "text-slate-400"}`}>
                    {option.label}
                  </span>
                </button>
              )
            })}
            {filteredRelationships.length > 10 && (
              <button
                type="button"
                onClick={() => toggleShowAll("relationships")}
                className="col-span-2 sm:col-span-3 p-3 rounded-xl border border-dashed border-white/20 text-slate-400 hover:bg-white/5 hover:border-white/30"
              >
                {showAllMap.relationships ? "Mostrar menos" : `Mostrar ${filteredRelationships.length - 10} opciones más`}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setCustomRelationship(true)
              onInputChange("relationship", "")
            }}
            className="w-full p-4 border-2 border-dashed border-white/20 rounded-xl hover:border-brand-terracotta/50 hover:bg-brand-terracotta/10 text-slate-400 hover:text-brand-terracotta flex items-center justify-center gap-2"
          >
            <Emoji emoji="✏️" size={20} />
            <span className="font-medium">Escribir otro parentesco</span>
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Input
              aria-labelledby="question-relationship"
              placeholder="Ej: Mi jefe, Mi vecino, etc."
              value={formData.relationship}
              onChange={(e) => onInputChange("relationship", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  onNext()
                }
              }}
              className="w-full p-6 text-lg shadow-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-brand-terracotta focus:ring-brand-terracotta/50 rounded-xl"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                setCustomRelationship(false)
                onInputChange("relationship", "")
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <span className="sr-only">Cerrar</span>
              ✕
            </button>
          </div>
          <p className="text-sm text-center text-slate-500">
            Presiona Enter para continuar o{" "}
            <button
              type="button"
              onClick={() => {
                setCustomRelationship(false)
                onInputChange("relationship", "")
              }}
              className="text-brand-terracotta hover:underline"
            >
              vuelve a las opciones
            </button>
          </p>
        </div>
      )}
    </div>
  )
}
