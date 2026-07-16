"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, Star, Video } from "lucide-react"
import { Emoji } from "@/components/ui/emoji"
import PriceDisplay from "@/app/components/price-display"
import type { FormData } from "../../types"

interface Step1Props {
  formData: FormData
  onInputChange: (field: keyof FormData, value: string) => void
}

export default function Step1SongType({ formData, onInputChange }: Step1Props) {
  // Single source of truth for selected song type
  const selectedSongType = formData.songType || "lite"

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Elige tu experiencia musical</h2>
        <p className="text-slate-400 mt-2">Selecciona el paquete que mejor se adapte a tu historia</p>
      </div>

      <RadioGroup
        value={selectedSongType}
        onValueChange={(value) => onInputChange("songType", value)}
        className="grid grid-cols-1 gap-6"
      >
        {/* Paquete Lite */}
        <Label
          htmlFor="plan-lite"
          className={`relative overflow-hidden rounded-2xl cursor-pointer block ${selectedSongType === "lite"
            ? "bg-brand-inkSoft/80 ring-2 ring-brand-forest"
            : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-forest/30"
            } focus-within:ring-2 focus-within:ring-brand-forest`}
        >
          <RadioGroupItem value="lite" id="plan-lite" className="sr-only" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-forest to-brand-terracotta"></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-brand-forest/10 flex items-center justify-center">
                  <Emoji emoji="🎵" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Canción Lite</h3>
                  <p className="text-xs text-slate-400">Detalle sencillo y especial</p>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedSongType === "lite" ? "border-brand-forest bg-brand-forest" : "border-slate-600"}`}>
                  {selectedSongType === "lite" && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <PriceDisplay planType="lite" showOriginalPrice={true} size="lg" className="text-brand-forest" textColor="text-white" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-brand-forest/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-brand-forest" />
                </div>
                <span>Canción completa (2-3 min)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-brand-forest/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-brand-forest" />
                </div>
                <span>2 revisiones de letra</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-brand-forest/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-brand-forest" />
                </div>
                <span>Entrega en formato MP3</span>
              </div>
            </div>
          </div>
        </Label>

        {/* Paquete Estándar - MÁS POPULAR */}
        <Label
          htmlFor="plan-standard"
          className={`relative overflow-hidden rounded-2xl cursor-pointer block ${selectedSongType === "estandar"
            ? "bg-brand-inkSoft/80 ring-2 ring-brand-terracotta"
            : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-terracotta/30"
            } focus-within:ring-2 focus-within:ring-brand-terracotta`}
        >
          <RadioGroupItem value="estandar" id="plan-standard" className="sr-only" />
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-terracotta via-brand-bordeaux to-brand-gold"></div>

          {/* Badge Popular */}
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-brand-terracotta text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              MÁS POPULAR
            </span>
          </div>

          <div className="p-6 pt-12">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-brand-terracotta/10 flex items-center justify-center">
                  <Emoji emoji="🎁" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Canción Estándar</h3>
                  <p className="text-xs text-slate-400">La experiencia favorita</p>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedSongType === "estandar" ? "border-brand-terracotta bg-brand-terracotta" : "border-slate-600"}`}>
                  {selectedSongType === "estandar" && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <PriceDisplay planType="standard" showOriginalPrice={true} size="lg" className="text-brand-terracotta" textColor="text-white" />
              </div>
            </div>

            <div className="space-y-3 bg-brand-terracotta/10 p-4 rounded-xl border border-brand-terracotta/20">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <div className="w-5 h-5 rounded-full bg-brand-terracotta/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-brand-terracotta" />
                </div>
                <span>Todo lo del plan Lite</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <div className="w-5 h-5 rounded-full bg-brand-terracotta/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-brand-terracotta" />
                </div>
                <span>7 revisiones de letra</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <div className="w-5 h-5 rounded-full bg-brand-terracotta/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-brand-terracotta" />
                </div>
                <span>2 canciones completas incluidas (2-3 min)</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <div className="w-5 h-5 rounded-full bg-brand-terracotta/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-brand-terracotta" />
                </div>
                <span>Entrega en formato MP3</span>
              </div>
            </div>
          </div>
        </Label>

        {/* Paquete Premium - DUETO */}
        <Label
          htmlFor="plan-premium"
          className={`relative overflow-hidden rounded-2xl cursor-pointer block ${selectedSongType === "premium"
            ? "bg-brand-inkSoft/80 ring-2 ring-amber-400"
            : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30"
            } focus-within:ring-2 focus-within:ring-amber-400`}
        >
          <RadioGroupItem value="premium" id="plan-premium" className="sr-only" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 to-orange-400"></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Emoji emoji="🎤" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Canción Premium</h3>
                  <p className="text-xs text-slate-400">La experiencia definitiva</p>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedSongType === "premium" ? "border-amber-500 bg-amber-500" : "border-slate-600"}`}>
                  {selectedSongType === "premium" && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <PriceDisplay planType="premium" showOriginalPrice={true} size="lg" className="text-amber-400" textColor="text-white" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-amber-400" />
                </div>
                <span>Todo lo del plan Estándar</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-amber-400" />
                </div>
                <span>Revisiones ilimitadas</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-white bg-white/10 p-2 rounded-lg border border-amber-500/30">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Video className="w-3 h-3 text-amber-400" />
                </div>
                <span>Video Lyric (Karaoke) incluido</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-amber-400" />
                </div>
                <span>Entrega PRIORITARIA</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-amber-400" />
                </div>
                <span>2 canciones completas incluidas (2-3 min)</span>
              </div>
            </div>
          </div>
        </Label>
      </RadioGroup>
    </div>
  )
}
