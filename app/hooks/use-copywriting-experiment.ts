"use client"

import { useState, useEffect } from "react"
import { getStatsigClient } from "@/app/utils/statsig"

export const COPYWRITING_EXPERIMENT_NAME = "hero_copywriting_test"

// Definición de las variantes de copy
export interface CopywritingVariant {
  hero_title_line1: string
  hero_title_highlight: string
  hero_title_line2: string
  hero_subtitle: string
  benefit_1: string
  benefit_3: string
  cta_button_text: string
  cta_mobile_text: string
  secondary_button_text?: string
  variant: string
  isLoading: boolean
}
// italica para el highlight sus 
// Variante Control (actual)
const CONTROL_VARIANT: CopywritingVariant = {
  hero_title_line1: "Convierte en musica los",
  hero_title_highlight: "momentos",
  hero_title_line2: "compartidos",
  hero_subtitle: "Su nombre, historia y recuerdos juntos en una canción.",
  benefit_1: " Escucha tu demo • Solo pagas si refleja su historia",
  benefit_3: "⚡ En tu WhatsApp en menos de 24 horas",
  cta_button_text: "CREAR MI CANCIÓN",
  cta_mobile_text: "CREAR CANCIÓN",
  secondary_button_text: "Escuchar demo real",
  variant: "Control",
  isLoading: false,
}

// Variante Emocional Intenso
const EMOCIONAL_VARIANT: CopywritingVariant = {
  hero_title_line1: "El regalo que la hará",
  hero_title_highlight: "Llorar",
  hero_title_line2: "de emoción",
  hero_subtitle: "Una canción única con SU nombre, SU historia, SUS recuerdos. Demo en 24h.",
  benefit_1: "🎧 Escucha tu demo • Solo pagas si te enamoras",
  benefit_3: "⚡ En tu WhatsApp en menos de 24 horas",
  cta_button_text: "CREAR MI CANCIÓN",
  cta_mobile_text: "CREAR CANCIÓN",
  secondary_button_text: "Escuchar demo real",
  variant: "Emocional Intenso",
  isLoading: false,
}

// Variante Transformadora
const TRANSFORMADORA_VARIANT: CopywritingVariant = {
  hero_title_line1: "Transforma tus sentimientos",
  hero_title_highlight: "en música",
  hero_title_line2: "",
  hero_subtitle: "Cuéntanos tu historia: creamos una canción que la capture a la perfección.",
  benefit_1: "Escucha antes de pagar • Sin riesgo, sin compromiso",
  benefit_3: "Recíbela en WhatsApp en 24h",
  cta_button_text: "Crea tu canción ahora",
  cta_mobile_text: "Crea tu canción ahora",
  secondary_button_text: "Escucha este ejemplo",
  variant: "Transformadora",
  isLoading: false,
}

// Array de todas las variantes (índice = seed)
const ALL_VARIANTS: CopywritingVariant[] = [
  CONTROL_VARIANT,        // seed: 0
  EMOCIONAL_VARIANT,     // seed: 1
  TRANSFORMADORA_VARIANT, // seed: 2
]

// Mapa de variantes por nombre de grupo (para compatibilidad)
const VARIANT_MAP: Record<string, CopywritingVariant> = {
  "Control": CONTROL_VARIANT,
  "Emocional Intenso": EMOCIONAL_VARIANT,
  "Transformadora": TRANSFORMADORA_VARIANT,
}

export function useCopywritingExperiment() {
  const [copyVariant, setCopyVariant] = useState<CopywritingVariant>({
    ...CONTROL_VARIANT,
    isLoading: true,
  })

  useEffect(() => {
    // Guard against SSR
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    const fetchExperiment = async () => {
      try {
        const client = await getStatsigClient()
        const experiment = client.getExperiment(COPYWRITING_EXPERIMENT_NAME)

        // Obtener el seed numérico del experimento (0, 1, o 2)
        // Si no existe, usar el nombre del grupo como fallback
        const seed = 0
        const groupName = experiment.groupName || "Control"

        let variant: CopywritingVariant

        if (seed !== null && seed >= 0 && seed < ALL_VARIANTS.length) {
          // Usar el seed numérico para obtener la variante
          variant = {
            ...ALL_VARIANTS[seed],
            variant: groupName,
            isLoading: false,
          }
        } else {
          // Fallback: usar el nombre del grupo
          variant = {
            ...(VARIANT_MAP[groupName] || CONTROL_VARIANT),
            variant: groupName,
            isLoading: false,
          }
        }

        setCopyVariant(variant)

        // Log exposure al experimento
        client.logEvent("experiment_exposure", COPYWRITING_EXPERIMENT_NAME, {
          variant: groupName,
          seed: seed !== null ? seed.toString() : "unknown",
        })

        // Guardar en localStorage para otros componentes
        localStorage.setItem("copywritingVariant", JSON.stringify(variant))

        // Disparar evento para notificar a otros componentes
        window.dispatchEvent(new CustomEvent("copywritingVariantUpdated", { detail: variant }))
      } catch (error) {
        console.error("Error fetching copywriting experiment:", error)
        // En caso de error, usar variante control
        setCopyVariant(CONTROL_VARIANT)
      }
    }

    fetchExperiment()
  }, [])

  return copyVariant
}

// Función para obtener la variante de copywriting sin React hook
export const getCopywritingExperiment = async (): Promise<CopywritingVariant> => {
  try {
    const client = await getStatsigClient()
    const experiment = client.getExperiment(COPYWRITING_EXPERIMENT_NAME)
    
    // Obtener el seed numérico del experimento (0, 1, o 2)
    const seed = experiment.get("variant_seed", null) as number | null
    const groupName = experiment.groupName || "Control"
    
    if (seed !== null && seed >= 0 && seed < ALL_VARIANTS.length) {
      return {
        ...ALL_VARIANTS[seed],
        variant: groupName,
        isLoading: false,
      }
    }
    
    // Fallback: usar el nombre del grupo
    return {
      ...(VARIANT_MAP[groupName] || CONTROL_VARIANT),
      variant: groupName,
      isLoading: false,
    }
  } catch (error) {
    console.error("Error getting copywriting experiment:", error)
    return CONTROL_VARIANT
  }
}

