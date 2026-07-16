"use client"

import { Textarea } from "@/components/ui/textarea"
import type { FormData } from "../../types"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Sparkles } from "lucide-react"

interface Step10Props {
  formData: FormData
  onInputChange: (field: keyof FormData, value: string) => void
}

const STORY_PROMPTS = [
  "Nos conocimos en ",
  "Lo que más me gusta de ti es ",
  "Recuerdo cuando ",
  "Quiero agradecerte por ",
  "Nunca olvidaré el día que ",
  "Eres especial porque ",
  "Mi momento favorito contigo fue ",
  "Nuestra canción siempre será ",
  "Te prometo que ",
  "Lo más divertido que nos pasó fue ",
]

export default function Step10Details({ formData, onInputChange }: Step10Props) {
  const handlePromptClick = (prompt: string) => {
    const currentText = formData.details
    const separator =
      currentText.length > 0
        ? currentText.endsWith("\n\n")
          ? ""
          : currentText.endsWith("\n")
            ? "\n"
            : "\n\n"
        : ""
    onInputChange("details", currentText + separator + prompt)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 id="question-details" className="text-2xl font-bold text-white">Cuéntanos tu historia</h2>
        <p className="text-slate-400 mt-2">
          Detalles, anécdotas, nombres, fechas importantes... ¡todo lo que quieras incluir!
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="relative">
          <Textarea
            aria-labelledby="question-details"
            placeholder="Ej: Nos conocimos en la universidad, le gusta el café, tenemos un perro llamado Firulais..."
            value={formData.details}
            onChange={(e) => onInputChange("details", e.target.value)}
            className="min-h-[200px] p-6 text-lg shadow-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-brand-terracotta focus:ring-brand-terracotta/50 rounded-xl resize-none"
          />
          <p className="text-right text-sm text-slate-500 mt-2">
            {formData.details.length} caracteres
          </p>
        </div>

        <div className="pt-2">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-slate-400 px-1">
            <Sparkles className="w-4 h-4 text-brand-terracotta" />
            <span>¿Necesitas inspiración? Toca una frase para agregarla:</span>
          </div>

          <Carousel
            opts={{
              align: "start",
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 py-1">
              {STORY_PROMPTS.map((prompt, index) => (
                <CarouselItem key={index} className="pl-2 basis-auto">
                  <button
                    type="button"
                    onClick={() => handlePromptClick(prompt)}
                    className="flex items-center whitespace-nowrap px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-slate-300 hover:text-white transition-all hover:border-brand-terracotta/30 active:scale-95"
                  >
                    {prompt}
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Navigation buttons are hidden on mobile by default in some designs, but let's see.
                Given the horizontal scroll nature on mobile, buttons might not be strictly necessary,
                but good for desktop. */}
            <div className="hidden sm:block">
              <CarouselPrevious className="-left-4 bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" />
              <CarouselNext className="-right-4 bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  )
}
