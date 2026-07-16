"use client"

import { Check } from "lucide-react"
import { Emoji } from "@/components/ui/emoji"
import { formatPrice } from "@/lib/format-price"
import type { CurrencyCode } from "@/lib/currency-config"
import type { FormData } from "../../types"

interface Step12Props {
  formData: FormData
  onInputChange: (field: keyof FormData, value: string) => void
  currency: CurrencyCode
  currencyPrices: {
    video: number
    spotify_upload: number
    [key: string]: number
  }
}

export default function Step12Extras({
  formData,
  onInputChange,
  currency,
  currencyPrices,
}: Step12Props) {
  const isPremium = formData.songType === "premium"
  const isVideoSelected = isPremium || formData.video === "yes"

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Complementa tu experiencia <Emoji emoji="💎" size={24} /></h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Video Lyric */}
        <button
          type="button"
          disabled={isPremium}
          onClick={() => {
            if (!isPremium) {
              const newValue = formData.video === "yes" ? "no" : "yes"
              onInputChange("video", newValue)
            }
          }}
          className={`relative p-6 rounded-2xl border-2 text-left ${isVideoSelected
            ? isPremium
              ? "border-amber-500 bg-amber-500/20 cursor-default"
              : "border-brand-terracotta bg-brand-terracotta/20"
            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-brand-terracotta/30"
            }`}
        >
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Emoji emoji="🎬" size={40} />
                {isVideoSelected && (
                  <div className={`${isPremium ? "bg-amber-500" : "bg-brand-terracotta"} rounded-full p-1`}>
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <h3 className={`font-bold text-lg mb-1 ${isVideoSelected ? (isPremium ? "text-amber-400" : "text-brand-terracotta") : "text-white"}`}>
                Video Lyric
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Video estilo karaoke con la letra de tu canción.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10">
              {isPremium ? (
                <span className="inline-block bg-amber-500/20 text-amber-400 text-sm font-bold px-2 py-1 rounded border border-amber-500/30">
                  INCLUIDO EN PREMIUM
                </span>
              ) : (
                <span className="block font-bold text-brand-terracotta text-lg">+{formatPrice(currencyPrices.video, currency)}</span>
              )}
            </div>
          </div>
        </button>

        {/* Card 2: Spotify Upload */}
        <button
          type="button"
          onClick={() => {
            const newValue = formData.spotifyUpload === "yes" ? "no" : "yes"
            onInputChange("spotifyUpload", newValue)
          }}
          className={`relative p-6 rounded-2xl border-2 text-left ${formData.spotifyUpload === "yes"
            ? "border-green-500 bg-green-500/20"
            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-green-500/30"
            }`}
        >
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Emoji emoji="🚀" size={40} />
                {formData.spotifyUpload === "yes" && (
                  <div className="bg-green-500 rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <h3 className={`font-bold text-lg mb-1 ${formData.spotifyUpload === "yes" ? "text-green-400" : "text-white"}`}>
                Subir a Spotify
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Tu canción en Spotify, Apple Music y YouTube Music.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <span className="block font-bold text-green-400 text-lg">+{formatPrice(currencyPrices.spotify_upload, currency)}</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
