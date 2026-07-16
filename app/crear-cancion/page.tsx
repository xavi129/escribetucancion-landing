"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { trackFormStart, trackFormStepComplete, trackFormSubmit } from "@/app/utils/analytics"
import FormProgressIndicator from "@/app/components/form-progress-indicator"
import AutoFillButton from "@/app/components/auto-fill-button"
import FormHeader from "@/app/components/form-header"
import dynamic from "next/dynamic"

// Import types and constants
import type { FormData } from "./types"
import { RELATIONSHIPS, OCCASION_CATEGORIES } from "./constants"

// Import utilities
import {
  isValidWhatsApp,
  getStepName,
  getSongTypePrice,
  validateStep,
  formatWhatsAppMessageFreemium,
  prepareOrderData,
  generateReferenceId,
} from "./utils"

// Eager load step components (1-4) - critical for initial experience
import {
  Step1SongType,
  Step2Occasion,
  Step3Name,
  Step4Relationship,
} from "./components/steps"

// Lazy load step components (5-10) - loaded as user progresses
const Step5VoiceGender = dynamic(() => import("./components/steps/step-8-voice-gender"), {
  loading: () => <div className="h-48 bg-brand-inkSoft/50 animate-pulse rounded-xl" />,
})
const Step6Music = dynamic(() => import("./components/steps/step-6-music"), {
  loading: () => <div className="h-64 bg-brand-inkSoft/50 animate-pulse rounded-xl" />,
})
const Step7Details = dynamic(() => import("./components/steps/step-10-details"), {
  loading: () => <div className="h-64 bg-brand-inkSoft/50 animate-pulse rounded-xl" />,
})
const Step8Delivery = dynamic(() => import("./components/steps/step-11-delivery"), {
  loading: () => <div className="h-64 bg-brand-inkSoft/50 animate-pulse rounded-xl" />,
})
const Step9Extras = dynamic(() => import("./components/steps/step-12-extras"), {
  loading: () => <div className="h-48 bg-brand-inkSoft/50 animate-pulse rounded-xl" />,
})
const Step10Contact = dynamic(() => import("./components/steps/step-12-contact"), {
  loading: () => <div className="h-48 bg-brand-inkSoft/50 animate-pulse rounded-xl" />,
})

// Import hooks
import { usePriceExperiment } from "@/app/hooks/use-price-experiment"
import { useGeoCountry } from "@/app/hooks/use-geo-country"
import { useCurrency } from "@/app/hooks/use-currency"
import { formatPrice } from "@/lib/format-price"

// Import analytics
import {
  logEvent,
  logPriceSelection,
  logFunnelStart,
  logFunnelStepComplete,
  logFunnelAbandonment,
  logFunnelComplete
} from "@/app/utils/statsig"

// Import components
import StepWrapper from "./components/step-wrapper"
import { DesktopNavigation, MobileNavigation } from "./components/form-navigation"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

/**
 * Multi-step form UI for creating and submitting a personalized song request.
 *
 * Renders a 14-step interactive flow that collects song preferences and customer data,
 * applies price experiment variants, validates inputs per step, tracks funnel and step
 * analytics, offers delivery and distribution upsells, and supports two submission paths:
 * a freemium WhatsApp handoff (saves a lead/order and prepares a WhatsApp message) and a
 * Stripe checkout flow. Integrations include experiment-driven pricing, geo-based phone
 * defaults, Statsig analytics events, Supabase order persistence, and localStorage
 * persistence for confirmation navigation. The component also includes optional lead
 * capture UI and a dynamic "spots remaining" urgency indicator for promotional delivery.
 *
 * @returns A React element that renders the multi-step song-creation form and its UI.
 */
export default function CrearCancion() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showLeadCapture, setShowLeadCapture] = useState(false)
  const [leadCaptured, setLeadCaptured] = useState(false)

  // Estados para tracking del embudo
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now())
  const [funnelStartTime, setFunnelStartTime] = useState<number>(Date.now())
  const [hasTrackedStart, setHasTrackedStart] = useState(false)

  // Refs para tracking de abandono (para evitar problemas de dependencias en useEffect)
  const stepRef = useRef(step)
  const funnelStartTimeRef = useRef<number>(Date.now())
  const stepStartTimeRef = useRef<number>(Date.now())
  const hasTrackedStartRef = useRef(false)

  // Actualizar refs cuando cambian los valores
  useEffect(() => {
    stepRef.current = step
    funnelStartTimeRef.current = funnelStartTime
    stepStartTimeRef.current = stepStartTime
    hasTrackedStartRef.current = hasTrackedStart
  }, [step, funnelStartTime, stepStartTime, hasTrackedStart])

  // Función para manejar el auto-rellenado del formulario
  const handleAutoFill = (testData: any) => {
    // Actualizar el estado del formulario con los datos de prueba
    setFormData(testData)

    // Marcar como capturado si hay datos de cliente
    if (testData.customerName && testData.email) {
      setLeadCaptured(true)
      localStorage.setItem("leadCaptured", "true")
    }

    // Avanzar hasta el último paso (paso 9)
    setStep(10)

    window.scrollTo(0, 0)
  }

  const [formData, setFormData] = useState({
    songType: "lite",
    occasion: "",
    includeName: "",
    personName: "",
    relationship: "",
    genre: "",
    customGenre: "", // Para almacenar el género personalizado cuando selecciona "Otros"
    references: "", // This will be stored as song_references in the database
    voiceGender: "",
    styles: [] as string[],
    details: "",
    deliveryType: "",
    spotifyUpload: "", // Nueva opción para subir a Spotify
    video: "", // Nueva opción para Video Lyric
    customerName: "",
    whatsapp: "",
    email: "",
    paymentMethod: "",
  })

  // Estado para manejar si el usuario quiere escribir una ocasión personalizada
  const [customOccasion, setCustomOccasion] = useState(false)
  // Estado para manejar si el usuario quiere escribir una relación personalizada
  const [customRelationship, setCustomRelationship] = useState(false)

  // Estado para el contador de cupos restantes (Black Week)
  const [spotsRemaining, setSpotsRemaining] = useState(7)

  // Efecto para disminuir los cupos aleatoriamente cuando el usuario está en el paso 8 (entrega)
  useEffect(() => {
    if (step === 8) {
      // Reiniciar si volvemos al paso
      if (spotsRemaining <= 2) setSpotsRemaining(7)

      const interval = setInterval(() => {
        setSpotsRemaining((prev) => {
          if (prev <= 2) return prev // No bajar de 2 para mantener urgencia creíble
          // 30% de probabilidad de bajar en cada intervalo
          return Math.random() > 0.7 ? prev - 1 : prev
        })
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [step])

  // Estado para controlar si mostramos todas las opciones en listas largas (máx 10 visible por defecto)
  const [showAllMap, setShowAllMap] = useState<Record<string, boolean>>({
    occasions: false,
    genres: false,
    relationships: false,
  })

  const toggleShowAll = (key: string) => {
    setShowAllMap((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Función para filtrar las relaciones según la ocasión seleccionada
  const getFilteredRelationships = () => {
    const occasion = formData.occasion
    const allowedCategories = OCCASION_CATEGORIES[occasion] || ["romantic", "family", "friends", "general", "memorial"]

    // Filtrar relaciones según las categorías permitidas
    const filtered = RELATIONSHIPS.filter(rel =>
      rel.categories.some(cat => allowedCategories.includes(cat))
    )

    // Si no hay relaciones filtradas (ocasión personalizada), mostrar todas
    return filtered.length > 0 ? filtered : RELATIONSHIPS
  }

  // Add the hook inside the component, near the top after other hooks
  const prices = usePriceExperiment()
  // Get currency and prices based on user's country
  const { currency, prices: currencyPrices, advance } = useCurrency()
  // Detect user's country by IP for phone number prefix
  const detectedCountry = useGeoCountry("MX")

  useEffect(() => {
    // Rastrear inicio del formulario
    trackFormStart("song_creation")

    // Inicializar tracking del embudo
    const startTime = Date.now()
    setFunnelStartTime(startTime)
    setStepStartTime(startTime)

    // Log inicio del embudo en Statsig
    logFunnelStart({
      timestamp: new Date().toISOString(),
    })
    setHasTrackedStart(true)

    // Clear localStorage data from previous song creations
    // Limpiar datos de letras de canciones anteriores para evitar mostrar letras en caché
    localStorage.removeItem("whatsappSent")
    localStorage.removeItem("orderSaved")
    localStorage.removeItem("generatedLyrics")
    localStorage.removeItem("lyricsGenerated")
    localStorage.removeItem("selectedLyricIndex")
    localStorage.removeItem("editedLyric")
    localStorage.removeItem("referenceId")
    localStorage.removeItem("savedOrderData")
    // Nota: formData y whatsappLink se mantienen temporalmente hasta que se complete el nuevo formulario

    // Verificar si ya se capturó un lead anteriormente
    const capturedLead = localStorage.getItem("leadCaptured")
    if (capturedLead === "true") {
      setLeadCaptured(true)
    }

    // Tracking de abandono cuando el usuario sale de la página
    const handleBeforeUnload = () => {
      if (hasTrackedStartRef.current && stepRef.current <= 10) {
        const totalTime = Math.floor((Date.now() - funnelStartTimeRef.current) / 1000)
        const stepTime = Math.floor((Date.now() - stepStartTimeRef.current) / 1000)
        logFunnelAbandonment(stepRef.current, getStepName(stepRef.current), totalTime, {
          step_time_seconds: stepTime.toString(),
        })
      }
    }

    // Tracking cuando la página pierde visibilidad (usuario cambia de pestaña o cierra)
    const handleVisibilityChange = () => {
      if (document.hidden && hasTrackedStartRef.current && stepRef.current <= 10) {
        const totalTime = Math.floor((Date.now() - funnelStartTimeRef.current) / 1000)
        const stepTime = Math.floor((Date.now() - stepStartTimeRef.current) / 1000)
        logFunnelAbandonment(stepRef.current, getStepName(stepRef.current), totalTime, {
          step_time_seconds: stepTime.toString(),
          abandonment_type: "visibility_change",
        })
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // Reiniciar el tiempo del paso cuando cambia
  useEffect(() => {
    if (hasTrackedStart) {
      setStepStartTime(Date.now())
    }
  }, [step, hasTrackedStart])

  const totalSteps = 10 // Número total de pasos (modelo freemium - extras restaurados como paso 9)
  const progress = Math.min((step / totalSteps) * 100, 100)

  const handleInputChange = (field: string, value: string | string[]) => {
    // Usar versión funcional para evitar estados obsoletos al avanzar de paso
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStyleChange = (style: string) => {
    // Determine current state properly
    const currentStyles = formData.styles
    const isSelected = currentStyles.includes(style)

    if (isSelected) {
      setFormData((prev) => ({ ...prev, styles: prev.styles.filter((s) => s !== style) }))
      return
    }

    if (currentStyles.length >= 2) {
      toast({
        variant: "default",
        title: "Límite alcanzado",
        description: "Solo puedes mezclar hasta 2 estilos musicales.",
      })
      return
    }

    setFormData((prev) => ({ ...prev, styles: [...prev.styles, style] }))
  }

  // Modificar la función handleNext para incluir validaciones específicas
  const handleNext = () => {
    // Validar el paso actual usando la función de utilidad
    const validation = validateStep(step, formData)
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: validation.errorTitle,
        description: validation.errorDescription,
      })
      
      // Hacer scroll al paso de personalización/estilo de canción (paso 7) si hay error
      if (step === 7) {
        setTimeout(() => {
          // Determinar qué sección falta y hacer scroll a ella
          // IMPORTANTE: El orden debe coincidir con el orden de validación en utils.ts
          let targetElement: HTMLElement | null = null

          if (!formData.genre) {
            // 1. Falta género musical
            targetElement = document.getElementById("genre-section")
          } else if (formData.genre === "Otro" && !formData.customGenre?.trim()) {
            // 2. Falta género personalizado (cuando seleccionó "Otro")
            targetElement = document.getElementById("genre-section")
          } else if (!formData.styles?.length) {
            // 3. Falta estilo de canción
            targetElement = document.getElementById("style-section")
          }

          // Si no se encontró una sección específica, hacer scroll al contenedor principal
          if (!targetElement) {
            targetElement = document.getElementById("step-7-music-preferences")
          }

          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        }, 100)
      }
      
      return
    }

    // Log price selection when user completes step 1
    if (step === 1) {
      const songPrices: { [key: string]: number } = {
        lite: prices.lite_plan_price,
        estandar: prices.standard_plan_price,
        premium: prices.premium_plan_price,
      }
      const songPrice = songPrices[formData.songType] || 0
      logPriceSelection(formData.songType, songPrice)
    }

    // Guardar datos en Supabase cuando el usuario completa el paso de contacto (paso 9)
    // Y redirigir directamente a la página de confirmación (modelo freemium)
    if (step === 10 && formData.whatsapp && isValidWhatsApp(formData.whatsapp)) {
      try {
        setIsLoading(true)

        // Obtener el precio del tipo de canción
        const songTypePrice = getSongTypePrice(formData.songType, currencyPrices)

        // Generar un ID de referencia único para el pedido
        const referenceId = `MLD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

        // Preparar datos del formulario
        const formDataWithExperiment = {
          ...formData,
          songTypePrice,
          paymentMethod: "freemium", // Marcar como modelo freemium
        }

        // Calcular los precios
        const deliveryExtra = formData.deliveryType === "express" ? currencyPrices.express_delivery : 0
        const streamingExtra = formData.spotifyUpload === "yes" ? currencyPrices.spotify_upload : 0
        // Calcular costo de Video Lyric (gratis para premium, $149 para otros)
        const isPremium = formData.songType === "premium"
        const videoSelected = isPremium || formData.video === "yes"
        const videoExtra = (!isPremium && videoSelected) ? currencyPrices.video : 0

        const totalPrice = songTypePrice + deliveryExtra + streamingExtra + videoExtra

        // Preparar los datos para guardar en Supabase
        const orderData = {
          transaction_id: referenceId,
          customer_name: formData.customerName || "",
          email: formData.email || "",
          whatsapp: formData.whatsapp || "",
          currency: currency,
          song_type: formData.songType ? `${formData.songType} - ${songTypePrice} ${currency}` : "",
          occasion: formData.occasion || "",
          include_name: formData.includeName === "yes",
          person_name: formData.personName || "",
          relationship: formData.relationship || "",
          genre: formData.genre === "Otro" ? formData.customGenre || "" : formData.genre || "",
          song_references: formData.references || "",
          voice_gender: formData.voiceGender || "",
          styles: formData.styles || [],
          details: formData.details || "",
          // Map 'slow' to 'standard' for database compatibility
          delivery_type: formData.deliveryType === "slow" ? "standard" : formData.deliveryType || "",
          spotify_upload: formData.spotifyUpload === "yes",
          video: videoSelected, // Boolean field for Video Lyric
          payment_method: "freemium",
          base_price: songTypePrice,
          delivery_extra: deliveryExtra,
          total_price: totalPrice,
          generated_lyric: "",
          status: "lead", // Estado: esperando demo
          created_at: new Date().toISOString(),
          payment_status: "pending",
        }

        // Guardar en Supabase
        import("@/app/utils/supabase").then(({ saveOrderToSupabase }) => {
          saveOrderToSupabase(orderData).then((result) => {
            if (result.success) {
              console.log("Order saved to Supabase successfully (freemium model)")

              // Log event to Statsig
              import("@/app/utils/statsig").then(({ logEvent }) => {
                logEvent("freemium_order_created", undefined, {
                  reference_id: referenceId,
                  song_type: formData.songType || "",
                  email: formData.email || ""
                })
              })
            } else {
              console.error("Failed to save order to Supabase:", result.error)
            }
          })
        })

        // Formatear los datos del formulario para WhatsApp (modelo freemium)
        const formattedMessage = formatWhatsAppMessageFreemium(
          formDataWithExperiment,
          referenceId,
          currencyPrices,
          currency
        )

        // Codificar el mensaje para URL
        const encodedMessage = encodeURIComponent(formattedMessage)

        // Crear el enlace de WhatsApp
        const whatsappLink = `https://wa.me/000000000000?text=${encodedMessage}`

        // Guardar datos en localStorage para la página de confirmación
        localStorage.setItem("formData", JSON.stringify(formDataWithExperiment))
        localStorage.setItem("whatsappLink", whatsappLink)
        localStorage.setItem("referenceId", referenceId)

        // Log evento de creación de pedido freemium
        logEvent("freemium_order_initiated", undefined, {
          song_type: formData.songType,
          reference_id: referenceId
        })

        // Rastrear completado del paso actual
        trackFormStepComplete("song_creation", step, getStepName(step))

        // Calcular tiempo en el paso actual y tiempo total
        const stepTime = Math.floor((Date.now() - stepStartTime) / 1000)
        const totalTime = Math.floor((Date.now() - funnelStartTime) / 1000)

        // Log completado del paso final en Statsig
        logFunnelStepComplete(step, getStepName(step), stepTime, {
          timestamp: new Date().toISOString(),
          song_type: formData.songType || "",
        })

        // Log completado del embudo completo
        logFunnelComplete(totalSteps, totalTime, {
          timestamp: new Date().toISOString(),
          song_type: formData.songType || "",
          reference_id: referenceId,
        })

        // Redirigir a la página de confirmación
        router.push("/crear-cancion/confirmacion")
        return
      } catch (error) {
        console.error("Error saving order to Supabase:", error)
        setIsLoading(false)
      }
    }

    // Rastrear completado del paso actual
    trackFormStepComplete("song_creation", step, getStepName(step))

    // Calcular tiempo en el paso actual
    const stepTime = Math.floor((Date.now() - stepStartTime) / 1000)

    // Log completado del paso en Statsig
    logFunnelStepComplete(step, getStepName(step), stepTime, {
      timestamp: new Date().toISOString(),
      song_type: formData.songType || "",
    })

    // Avanzar al siguiente paso
    setStep(step + 1)

    window.scrollTo(0, 0)
  }

  // Función para manejar la captura temprana de leads
  const handleLeadCapture = (data: { name: string; email: string; whatsapp: string }) => {
    // Actualizar el estado del formulario con los datos capturados
    setFormData({
      ...formData,
      customerName: data.name || formData.customerName,
      email: data.email || formData.email,
      whatsapp: data.whatsapp || formData.whatsapp
    })

    // Marcar como capturado
    setLeadCaptured(true)
    setShowLeadCapture(false)
    localStorage.setItem("leadCaptured", "true")

    // DESACTIVADO: Registro de early lead desactivado para mejorar conversión
    // Guardar lead temprano en Supabase
    // try {
    //   // Generar un ID de referencia único para el lead temprano
    //   const referenceId = `EARLY-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    //   // Preparar los datos para guardar
    //   const earlyLeadData = {
    //     transaction_id: referenceId,
    //     customer_name: data.name || "",
    //     email: data.email || "",
    //     whatsapp: data.whatsapp || "",
    //     song_type: formData.songType || "lite",  // Valor predeterminado para campo requerido
    //     purpose: formData.purpose || "",
    //     status: "early_lead",
    //     created_at: new Date().toISOString(),
    //     delivery_type: "standard",
    //     spotify_upload: formData.spotifyUpload,
    //   }

    //   // Guardar en Supabase
    //   import("@/app/utils/supabase").then(({ saveOrderToSupabase }) => {
    //     saveOrderToSupabase(earlyLeadData).then((result) => {
    //       if (result.success) {
    //         console.log("Early lead saved to Supabase successfully")

    //         // Log event to Statsig
    //         import("@/app/utils/statsig").then(({ logEvent }) => {
    //           logEvent("early_lead_captured", undefined, {
    //             reference_id: referenceId,
    //             song_type: formData.songType || "",
    //             email: data.email || "",
    //             step: step
    //           })
    //         })
    //       } else {
    //         console.error("Failed to save early lead to Supabase:", result.error)
    //       }
    //     })
    //   })
    // } catch (error) {
    //   console.error("Error saving early lead to Supabase:", error)
    // }

    // Continuar con el siguiente paso
    setStep(step + 1)
    window.scrollTo(0, 0)
  }

  // Función para omitir la captura de leads
  const handleSkipLeadCapture = () => {
    setShowLeadCapture(false)
    setStep(step + 1)
    window.scrollTo(0, 0)

    // DESACTIVADO: Registro de early lead desactivado para mejorar conversión
    // Registrar que el usuario omitió la captura
    // import("@/app/utils/statsig").then(({ logEvent }) => {
    //   logEvent("early_lead_skipped", undefined, {
    //     step: step,
    //     song_type: formData.songType || ""
    //   })
    // })
  }

  const handleBack = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }

  // Función handleStripeCheckout
  const handleStripeCheckout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Generar un ID de referencia único
      const referenceId = `MLD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

      // Preparar datos del formulario
      const formDataWithExperiment = {
        ...formData,
        songTypePrice: getSongTypePrice(formData.songType, currencyPrices),
      }

      // Guardar los datos del formulario en localStorage
      localStorage.setItem("formData", JSON.stringify(formDataWithExperiment))

      // Log checkout start event to Statsig
      logEvent("checkout_start", undefined, {
        song_type: `${formData.songType} - ${getSongTypePrice(formData.songType, currencyPrices)} ${currency}`,
        delivery_type: formData.deliveryType,
        payment_method: "card",
        song_type_price: getSongTypePrice(formData.songType, currencyPrices),
        currency: currency,
      })

      // Log price selection event
      const songPrice = getSongTypePrice(formData.songType, currencyPrices)
      logPriceSelection(formData.songType, songPrice)

      // Obtener el precio del tipo de canción
      const songTypePrice = getSongTypePrice(formData.songType, currencyPrices)

      // Crear la sesión de checkout
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: advance,
          currency: currency,
          songType: `${formData.songType} - ${songTypePrice} ${currency}`,
          deliveryType: formData.deliveryType === "slow" ? "standard" : formData.deliveryType, // Normalize slow -> standard
          customerName: formData.customerName,
          email: formData.email,
          referenceId,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setIsLoading(false)

        // Log checkout error event to Statsig
        logEvent("checkout_error", undefined, {
          error: data.error,
          song_type: `${formData.songType} - ${getSongTypePrice(formData.songType, currencyPrices)} ${currency}`,
          currency: currency,
        })

        return
      }

      // Rastrear evento de compra
      const deliveryExtra = formData.deliveryType === "express" ? currencyPrices.express_delivery : 0
      const streamingExtra = formData.spotifyUpload === "yes" ? currencyPrices.spotify_upload : 0
      // Calcular costo de Video Lyric (gratis para premium)
      const isPremium = formData.songType === "premium"
      const videoSelected = isPremium || formData.video === "yes"
      const videoExtra = (!isPremium && videoSelected) ? currencyPrices.video : 0

      const totalPrice = songPrice + deliveryExtra + streamingExtra + videoExtra

      // Generar un ID de transacción único
      const transactionId = `MLD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

      // Rastrear la compra
      import("@/app/utils/analytics").then(({ trackPurchase }) => {
        trackPurchase(transactionId, totalPrice, currency, formData.songType)
      })

      // Log checkout success event to Statsig
      logEvent("checkout_redirect", totalPrice, {
        transaction_id: transactionId,
        song_type: `${formData.songType} - ${getSongTypePrice(formData.songType, currencyPrices)} ${currency}`,
        delivery_type: formData.deliveryType,
        currency: currency,
      })

      // Redirigir al checkout de Stripe
      if (data.url) {
        window.location.href = data.url
      } else {
        setError("No se pudo crear la sesión de pago")
        setIsLoading(false)

        // Log checkout error event to Statsig
        logEvent("checkout_error", undefined, {
          error: "No URL returned",
          song_type: `${formData.songType} - ${getSongTypePrice(formData.songType, currencyPrices)} ${currency}`,
          currency: currency,
        })
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error)
      setError("Ocurrió un error al procesar el pago. Por favor, inténtalo de nuevo.")
      setIsLoading(false)

      // Log checkout error event to Statsig
      logEvent("checkout_error", undefined, {
        error: "Exception occurred",
        song_type: `${formData.songType} - ${getSongTypePrice(formData.songType, currencyPrices)} ${currency}`,
        currency: currency,
      })
    }
  }

  // Función para copiar al portapapeles
  const copyToClipboard = (text: string, e?: React.MouseEvent) => {
    // Detener la propagación del evento si se proporciona
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copiado",
          description: "Texto copiado al portapapeles",
        })
      })
      .catch((err) => {
        console.error("Error al copiar: ", err)
      })
  }

  // Prevenir envío por defecto del formulario (la lógica real está en handleNext)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // La lógica de envío se maneja en handleNext cuando step === 14
  }

  return (
    <div className="min-h-screen brand-night brand-flow py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-terracotta/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-forest/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-brand-bordeaux/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <FormHeader
          title="Crea tu Canción Personalizada"
          description="Cuéntanos tu historia y la transformaremos en música"
          action={<AutoFillButton onFill={handleAutoFill} />}
        />

        <div className="mb-8">
          <FormProgressIndicator
            currentStep={step}
            totalSteps={totalSteps}
            variant="default"
            className="mb-2"
          />
        </div>

        {/* DESACTIVADO: Componente EarlyLeadCapture desactivado para mejorar conversión */}
        {/* {showLeadCapture ? (
          <EarlyLeadCapture
            onCapture={handleLeadCapture}
            onSkip={handleSkipLeadCapture}
            className="mb-4"
          />
        ) : ( */}
        <Card className="shadow-2xl border-white/10 bg-brand-inkSoft/70 backdrop-blur-xl rounded-3xl overflow-hidden ring-1 ring-white/5">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Song Type */}
              {step === 1 && (
                <StepWrapper keyProp={1}>
                  <Step1SongType formData={formData} onInputChange={handleInputChange} />
                </StepWrapper>
              )}

              {/* Step 2: Occasion */}
              {step === 2 && (
                <StepWrapper keyProp={2}>
                  <Step2Occasion
                    formData={formData}
                    onInputChange={handleInputChange}
                    customOccasion={customOccasion}
                    setCustomOccasion={setCustomOccasion}
                    showAllMap={showAllMap}
                    toggleShowAll={toggleShowAll}
                    onNext={handleNext}
                  />
                </StepWrapper>
              )}

              {/* Step 3: Name (combined: include name toggle + person name input) */}
              {step === 3 && (
                <StepWrapper keyProp={3}>
                  <Step3Name formData={formData} onInputChange={handleInputChange} onNext={handleNext} />
                </StepWrapper>
              )}

              {/* Step 4: Relationship */}
              {step === 4 && (
                <StepWrapper keyProp={4}>
                  <Step4Relationship
                    formData={formData}
                    onInputChange={handleInputChange}
                    customRelationship={customRelationship}
                    setCustomRelationship={setCustomRelationship}
                    showAllMap={showAllMap}
                    toggleShowAll={toggleShowAll}
                    onNext={handleNext}
                  />
                </StepWrapper>
              )}

              {/* Step 5: Voice Gender */}
              {step === 5 && (
                <StepWrapper keyProp={5}>
                  <Step5VoiceGender formData={formData} onInputChange={handleInputChange} />
                </StepWrapper>
              )}

              {/* Step 6: Details (your story) */}
              {step === 6 && (
                <StepWrapper keyProp={6}>
                  <Step7Details formData={formData} onInputChange={handleInputChange} />
                </StepWrapper>
              )}

              {/* Step 7: Music (Genre + Style + References combined) */}
              {step === 7 && (
                <StepWrapper keyProp={7}>
                  <Step6Music
                    formData={formData}
                    onInputChange={handleInputChange}
                    onStyleChange={handleStyleChange}
                    showAllMap={showAllMap}
                    toggleShowAll={toggleShowAll}
                  />
                </StepWrapper>
              )}

              {/* Step 8: Delivery Type */}
              {step === 8 && (
                <StepWrapper keyProp={8}>
                  <Step8Delivery
                    formData={formData}
                    onInputChange={handleInputChange}
                    spotsRemaining={spotsRemaining}
                    currency={currency}
                    currencyPrices={currencyPrices}
                  />
                </StepWrapper>
              )}

              {/* Step 9: Extras (Video Lyric + Spotify Upload) */}
              {step === 9 && (
                <StepWrapper keyProp={9}>
                  <Step9Extras
                    formData={formData}
                    onInputChange={handleInputChange}
                    currency={currency}
                    currencyPrices={currencyPrices}
                  />
                </StepWrapper>
              )}

              {/* Step 10: Contact (combined: customer name + WhatsApp) */}
              {step === 10 && (
                <StepWrapper keyProp={10}>
                  <Step10Contact
                    formData={formData}
                    onInputChange={handleInputChange}
                    detectedCountry={detectedCountry}
                  />
                </StepWrapper>
              )}

              <DesktopNavigation
                step={step}
                totalSteps={totalSteps}
                isLoading={isLoading}
                onBack={handleBack}
                onNext={handleNext}
              />

              {/* Spacer to prevent content from being hidden behind sticky footer on mobile */}
              <div className="h-36 sm:hidden"></div>
            </form>
          </CardContent>
        </Card>

        {/* Mobile Sticky Navigation Bar (Outside Card to ensure fixed positioning works) */}
        <MobileNavigation
          step={step}
          totalSteps={totalSteps}
          isLoading={isLoading}
          onBack={handleBack}
          onNext={handleNext}
        />
        {/* ) */}
        {/* } */}
      </div >
      <Toaster />
    </div >
  )
}
