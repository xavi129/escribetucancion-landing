"use client"

import { Emoji } from "@/components/ui/emoji"
import type { FormData } from "../../types"

interface Step8Props {
  formData: FormData
  onInputChange: (field: keyof FormData, value: string) => void
}

export default function Step8VoiceGender({ formData, onInputChange }: Step8Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">¿Qué voz prefieres?</h2>
        <p className="text-slate-400 mt-2">
          Selecciona el tipo de voz para tu canción.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => onInputChange("voiceGender", "male")}
          className={`relative p-8 rounded-2xl border-2 text-center ${formData.voiceGender === "male"
            ? "border-brand-forest bg-brand-forest/20 text-brand-forest"
            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-brand-forest/30"
            }`}
        >
          <div className="mb-4">
            <Emoji emoji="👨" size={48} />
          </div>
          <h3 className={`font-bold text-xl mb-2 ${formData.voiceGender === "male" ? "text-brand-forest" : "text-white"}`}>
            Voz Masculina
          </h3>
        </button>

        <button
          type="button"
          onClick={() => onInputChange("voiceGender", "female")}
          className={`relative p-8 rounded-2xl border-2 text-center ${formData.voiceGender === "female"
            ? "border-brand-bordeaux bg-brand-bordeaux/20 text-brand-bordeaux"
            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-brand-bordeaux/30"
            }`}
        >
          <div className="mb-4">
            <Emoji emoji="👩" size={48} />
          </div>
          <h3 className={`font-bold text-xl mb-2 ${formData.voiceGender === "female" ? "text-brand-bordeaux" : "text-white"}`}>
            Voz Femenina
          </h3>
        </button>
      </div>
    </div>
  )
}
