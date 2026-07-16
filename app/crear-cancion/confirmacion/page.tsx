"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle,
  Music,
  MessageCircle,
  Loader2,
  Check,
  Edit,
  Sparkles,
  Plus,
  Eye,
  EyeOff,
  Undo2,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { trackWhatsappClick, trackEvent } from "@/app/utils/analytics"
import { logConfirmationStep, logEditLyricButtonClick } from "@/app/utils/statsig"
import { saveOrderToSupabase } from "@/app/utils/supabase"
import { formatPrice } from "@/lib/format-price"
import type { CurrencyCode } from "@/lib/currency-config"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatWhatsAppMessageFreemium } from "@/app/crear-cancion/utils"

// Helper function to extract song price from formData
const getSongPrice = (formData: any): number => {
  // First, try to get the price directly from songTypePrice
  if (formData?.songTypePrice && typeof formData.songTypePrice === 'number') {
    return formData.songTypePrice
  }

  // If not available, try to extract from song_type string (format: "lite - 320 MXN")
  if (formData?.song_type && typeof formData.song_type === 'string') {
    const match = formData.song_type.match(/(\d+)\s*MXN/)
    if (match && match[1]) {
      return parseInt(match[1], 10)
    }
  }

  // Fallback: determine from songType
  const songType = formData?.songType || formData?.song_type?.split(' - ')[0] || 'lite'
  switch (songType.toLowerCase()) {
    case 'lite':
      return 320
    case 'estandar':
    case 'estándar':
      return 729
    case 'premium':
      return 929
    default:
      return 320
  }
}

export default function Confirmacion() {
  const searchParams = useSearchParams()
  const reference = searchParams?.get("reference")

  const [whatsappLink, setWhatsappLink] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [whatsappSent, setWhatsappSent] = useState(false)
  const [formData, setFormData] = useState<any>(null)
  const [orderSaved, setOrderSaved] = useState(false)

  // Estados para la generación de letras
  const [editedLyric, setEditedLyric] = useState<string>("")
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false)
  const [lyricsGenerated, setLyricsGenerated] = useState(false)
  const [currentStep, setCurrentStep] = useState<"edit" | "complete">("edit")
  // Estados para ediciones con instrucciones
  const [editInstructions, setEditInstructions] = useState<string>("")
  const [isRegeneratingWithInstructions, setIsRegeneratingWithInstructions] = useState(false)
  // Contador de regeneraciones con IA
  const [aiRegenerationCount, setAiRegenerationCount] = useState<number>(0)
  // Estado para ediciones extra compradas
  const [extraEditionsPurchased, setExtraEditionsPurchased] = useState<number>(0)
  // Estado para mostrar diálogo de confirmación de compra de ediciones extra
  const [showExtraEditionsDialog, setShowExtraEditionsDialog] = useState(false)
  // Estado para la moneda
  const [currency, setCurrency] = useState<CurrencyCode>("MXN")
  // Estado para los precios de la moneda
  const [currencyPrices, setCurrencyPrices] = useState<any>({ video: 99, spotify_upload: 149, expressDelivery: 99 })
  // Precio de ediciones extra
  const [extraEditionsPrice, setExtraEditionsPrice] = useState<number>(49)
  // Estados para el diff de cambios en la letra
  const [previousLyric, setPreviousLyric] = useState<string>("")
  const [showDiff, setShowDiff] = useState(false)
  // Estado para el diálogo de confirmación de revertir
  const [showRevertDialog, setShowRevertDialog] = useState(false)

  // Límites de regeneraciones por paquete
  const AI_REGENERATION_LIMITS: Record<string, number> = {
    lite: 2,
    estandar: 4,
    estándar: 4,
    premium: 6,
  }

  // Cantidad de ediciones por addon
  const EXTRA_EDITIONS_PER_ADDON = 3

  // Obtener el límite según el paquete actual + ediciones extra compradas
  const getRegenerationLimit = (): number => {
    const songType = formData?.songType?.toLowerCase() || 'lite'
    const baseLimit = AI_REGENERATION_LIMITS[songType] || 1
    return baseLimit + extraEditionsPurchased
  }

  // Verificar si se alcanzó el límite (sin considerar ediciones extra disponibles para comprar)
  const hasReachedLimit = (): boolean => {
    return aiRegenerationCount >= getRegenerationLimit()
  }

  // Obtener regeneraciones restantes
  const getRemainingRegenerations = (): number => {
    return Math.max(0, getRegenerationLimit() - aiRegenerationCount)
  }

  // Función para calcular el diff entre dos textos
  type DiffPart = {
    type: 'added' | 'removed' | 'unchanged'
    value: string
  }

  const computeDiff = (oldText: string, newText: string): DiffPart[] => {
    // Dividir los textos en palabras, preservando espacios y saltos de línea
    const splitIntoTokens = (text: string) => {
      const tokens: string[] = []
      let current = ''
      for (let i = 0; i < text.length; i++) {
        const char = text[i]
        if (char === ' ' || char === '\n' || char === '\r') {
          if (current) {
            tokens.push(current)
            current = ''
          }
          tokens.push(char)
        } else {
          current += char
        }
      }
      if (current) tokens.push(current)
      return tokens
    }

    const oldTokens = splitIntoTokens(oldText)
    const newTokens = splitIntoTokens(newText)

    // Algoritmo de diff simple usando programación dinámica (LCS - Longest Common Subsequence)
    const lcs = (a: string[], b: string[]) => {
      const m = a.length
      const n = b.length
      const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0))

      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (a[i - 1] === b[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1] + 1
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
          }
        }
      }

      // Reconstruir la secuencia
      const result: DiffPart[] = []
      let i = m
      let j = n

      while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
          result.unshift({ type: 'unchanged', value: a[i - 1] })
          i--
          j--
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
          result.unshift({ type: 'added', value: b[j - 1] })
          j--
        } else if (i > 0) {
          result.unshift({ type: 'removed', value: a[i - 1] })
          i--
        }
      }

      return result
    }

    return lcs(oldTokens, newTokens)
  }

  // Componente para renderizar el diff visualmente
  const renderDiff = () => {
    if (!previousLyric || !editedLyric) return null

    const diffParts = computeDiff(previousLyric, editedLyric)

    return (
      <div
        className="min-h-[300px] sm:min-h-[350px] p-3 sm:p-4 rounded-lg border border-white/20 bg-slate-900/80 text-white text-sm sm:text-base leading-relaxed font-sans overflow-y-auto cursor-text hover:border-brand-terracotta/50 transition-colors"
        style={{ whiteSpace: 'pre-wrap', fontSize: '16px', lineHeight: '1.7' }}
        onClick={() => setShowDiff(false)}
        title="Haz clic para editar"
      >
        {diffParts.map((part, index) => {
          if (part.type === 'added') {
            return (
              <span
                key={index}
                className="bg-green-500/30 text-green-100 border-b-2 border-green-500 rounded px-0.5"
                title="Texto añadido"
              >
                {part.value}
              </span>
            )
          } else if (part.type === 'removed') {
            // No mostrar el texto eliminado
            return null
          } else {
            return <span key={index}>{part.value}</span>
          }
        })}
      </div>
    )
  }

  // Función para comprar ediciones extra
  const handlePurchaseExtraEditions = () => {
    // Incrementar las ediciones compradas
    const newExtraEditions = extraEditionsPurchased + EXTRA_EDITIONS_PER_ADDON
    setExtraEditionsPurchased(newExtraEditions)

    // Guardar en localStorage
    localStorage.setItem("extraEditionsPurchased", newExtraEditions.toString())
    localStorage.setItem("extraEditionsReferenceId", referenceNumber)

    // Log event
    import("@/app/utils/statsig").then(({ logEvent }) => {
      logEvent("extra_editions_purchased", 1, {
        reference_id: referenceNumber,
        editions_purchased: EXTRA_EDITIONS_PER_ADDON,
        total_extra_editions: newExtraEditions,
        package_type: formData?.songType || 'lite',
        price: extraEditionsPrice,
        currency: currency,
        timestamp: new Date().toISOString(),
      })
    })

    // Actualizar el formData para incluir el addon en el precio total
    if (formData) {
      const updatedFormData = {
        ...formData,
        extraEditions: newExtraEditions,
        extraEditionsPrice: extraEditionsPrice,
      }
      setFormData(updatedFormData)
      localStorage.setItem("formData", JSON.stringify(updatedFormData))
    }
  }

  // Registrar evento confirmation_view al cargar la página
  useEffect(() => {
    trackEvent("confirmation_view")
  }, [])

  // Función para generar letras de canciones
  const generateLyrics = async (data: any, refId?: string) => {
    const effectiveRefId = refId || referenceNumber
    setIsGeneratingLyrics(true)
    setCurrentStep("edit")

    // Log inicio de generación de letras
    logConfirmationStep("lyrics_generation", {
      reference_id: effectiveRefId,
      timestamp: new Date().toISOString(),
    })

    try {
      const response = await fetch("/api/generate-lyrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: data,
          generateSingle: true, // Nueva bandera para generar solo una letra
        }),
      })

      const responseData = await response.json()

      if (responseData.error) {
        console.error("Error al generar letras:", responseData.error)
        setIsGeneratingLyrics(false)
        return
      }

      // Solo tomar la primera letra generada
      if (!responseData.lyrics || responseData.lyrics.length === 0) {
        console.error("No se generaron letras")
        setIsGeneratingLyrics(false)
        return
      }

      const singleLyric = responseData.lyrics[0]
      setEditedLyric(singleLyric)
      setLyricsGenerated(true)
      setIsGeneratingLyrics(false)

      // Guardar la letra generada en localStorage
      localStorage.setItem("editedLyric", singleLyric)
      localStorage.setItem("lyricsGenerated", "true")

      // Log event to Statsig
      import("@/app/utils/statsig").then(({ logLyricsGenerated }) => {
        logLyricsGenerated(effectiveRefId, 1)
      })
    } catch (error) {
      console.error("Error al generar letras:", error)
      setIsGeneratingLyrics(false)
    }
  }

  useEffect(() => {
    // Limpiar keys de localStorage antiguas (migración de versión anterior)
    localStorage.removeItem("generatedLyrics")
    localStorage.removeItem("selectedLyricIndex")

    // Modelo freemium: no hay pago inicial, solo recuperar datos y preparar WhatsApp
    const formData = localStorage.getItem("formData")
    const referenceId = localStorage.getItem("referenceId")

    // Check if formData exists and is not empty
    if (formData && formData.trim() !== "") {
      try {
        const parsedData = JSON.parse(formData)
        setFormData(parsedData)

        // Obtener la moneda y precios de experimentPrices
        const experimentPrices = localStorage.getItem("experimentPrices")
        if (experimentPrices && experimentPrices.trim() !== "") {
          try {
            const parsedPrices = JSON.parse(experimentPrices)
            if (parsedPrices.currency) {
              setCurrency(parsedPrices.currency)
            }
            // Set currency prices
            setCurrencyPrices({
              video: parsedPrices.video || 149,
              spotify_upload: parsedPrices.spotifyUpload || 99,
              expressDelivery: parsedPrices.expressDelivery || 99,
            })
            // Obtener precio de ediciones extra
            if (parsedPrices.extraEditions) {
              setExtraEditionsPrice(parsedPrices.extraEditions)
            }
          } catch (e) {
            console.error("Error parsing experiment prices:", e)
          }
        }

        // Establecer número de referencia
        let effectiveRefId: string
        if (referenceId) {
          effectiveRefId = referenceId
          setReferenceNumber(referenceId)
        } else if (reference) {
          effectiveRefId = reference
          setReferenceNumber(reference)
        } else {
          effectiveRefId = `MLD-${Math.floor(100000 + Math.random() * 900000)}`
          setReferenceNumber(effectiveRefId)
          localStorage.setItem("referenceId", effectiveRefId)
        }

        // Obtener el enlace de WhatsApp (ya creado en el formulario)
        const storedWhatsappLink = localStorage.getItem("whatsappLink")
        if (storedWhatsappLink) {
          setWhatsappLink(storedWhatsappLink)
        } else {
          // Si no existe, crear uno básico (esto no debería pasar en el modelo freemium)
          const basicMessage = encodeURIComponent(`Hola, quiero completar mi pedido de canción personalizada. Referencia: ${effectiveRefId}`)
          const link = `https://wa.me/000000000000?text=${basicMessage}`
          setWhatsappLink(link)
          localStorage.setItem("whatsappLink", link)
        }

        // Verificar si ya se generó la letra
        const lyricsGeneratedStatus = localStorage.getItem("lyricsGenerated")
        const storedLyric = localStorage.getItem("editedLyric")
        if (lyricsGeneratedStatus === "true" && storedLyric) {
          setEditedLyric(storedLyric)
          setLyricsGenerated(true)
          setCurrentStep("edit")
        } else {
          // Generar letra automáticamente si no se ha generado
          generateLyrics(parsedData, effectiveRefId)
        }

        // Cargar contador de regeneraciones desde localStorage
        // Solo si es el mismo pedido (mismo referenceNumber)
        const storedReferenceForRegeneration = localStorage.getItem("aiRegenerationReferenceId")
        const storedRegenerationCount = localStorage.getItem("aiRegenerationCount")

        if (storedReferenceForRegeneration === effectiveRefId && storedRegenerationCount) {
          // Mismo pedido, mantener el contador
          setAiRegenerationCount(parseInt(storedRegenerationCount, 10))
        } else {
          // Nuevo pedido, resetear el contador
          setAiRegenerationCount(0)
          localStorage.setItem("aiRegenerationCount", "0")
          localStorage.setItem("aiRegenerationReferenceId", effectiveRefId)
        }

        // Cargar ediciones extra compradas desde localStorage
        const storedExtraEditionsRef = localStorage.getItem("extraEditionsReferenceId")
        const storedExtraEditions = localStorage.getItem("extraEditionsPurchased")

        if (storedExtraEditionsRef === effectiveRefId && storedExtraEditions) {
          setExtraEditionsPurchased(parseInt(storedExtraEditions, 10))
        } else {
          // Nuevo pedido, resetear las ediciones extra
          setExtraEditionsPurchased(0)
          localStorage.setItem("extraEditionsPurchased", "0")
          localStorage.setItem("extraEditionsReferenceId", effectiveRefId)
        }
      } catch (e) {
        console.error("Error parsing formData from localStorage:", e)
        return
      }
    }

    // Verificar si ya se envió por WhatsApp (para no mostrar el diálogo)
    const sentStatus = localStorage.getItem("whatsappSent")
    if (sentStatus === "true") {
      setWhatsappSent(true)
    }

    // Verificar si ya se guardó en Supabase
    const savedStatus = localStorage.getItem("orderSaved")
    if (savedStatus === "true") {
      setOrderSaved(true)
    }

  }, [reference])


  // Función para regenerar letra con instrucciones
  const handleRegenerateWithInstructions = async () => {
    if (!editInstructions.trim()) {
      alert("Por favor escribe las instrucciones de edición")
      return
    }

    // Verificar si se alcanzó el límite de regeneraciones
    if (hasReachedLimit()) {
      return // El botón ya está deshabilitado, pero por seguridad
    }

    // Loggear clic en el botón de edición con IA para seguimiento en Statsig
    logEditLyricButtonClick(referenceNumber, {
      instructions_length: editInstructions.trim().length,
      remaining_regenerations: getRemainingRegenerations(),
      package_type: formData?.songType || "lite",
    })

    setIsRegeneratingWithInstructions(true)

    try {
      const response = await fetch("/api/generate-lyrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: formData,
          currentLyric: editedLyric,
          editInstructions: editInstructions,
        }),
      })

      const responseData = await response.json()

      if (responseData.error) {
        console.error("Error al regenerar letra:", responseData.error)
        alert("Error al regenerar la letra. Por favor intenta de nuevo.")
        setIsRegeneratingWithInstructions(false)
        return
      }

      // Validar que la respuesta contenga letras
      if (!responseData.lyrics || responseData.lyrics.length === 0) {
        console.error("La API no devolvió ninguna letra")
        alert("Error: No se pudo generar la letra. Por favor intenta de nuevo.")
        setIsRegeneratingWithInstructions(false)
        return
      }

      // Actualizar la letra editada con la nueva versión
      let newLyric = responseData.lyrics[0]

      // Validar que la nueva letra no esté vacía antes de actualizar
      if (!newLyric || !newLyric.trim()) {
        console.error("La API devolvió una letra vacía")
        alert("Error: La letra generada está vacía. Por favor intenta de nuevo.")
        setIsRegeneratingWithInstructions(false)
        return
      }

      // Truncar la letra si excede los 2000 caracteres
      if (newLyric.length > 2000) {
        newLyric = newLyric.substring(0, 2000)
      }

      // Guardar la letra actual como versión anterior para el diff SOLO si la regeneración fue exitosa
      setPreviousLyric(editedLyric)

      setEditedLyric(newLyric)
      localStorage.setItem("editedLyric", newLyric)
      setEditInstructions("") // Limpiar las instrucciones después de aplicarlas

      // Activar el modo diff automáticamente para mostrar los cambios
      setShowDiff(true)

      // Incrementar el contador de regeneraciones
      const newCount = aiRegenerationCount + 1
      setAiRegenerationCount(newCount)
      localStorage.setItem("aiRegenerationCount", newCount.toString())
      localStorage.setItem("aiRegenerationReferenceId", referenceNumber)

      // Log event
      import("@/app/utils/statsig").then(({ logEvent }) => {
        logEvent("lyrics_regenerated_with_instructions", 1, {
          reference_id: referenceNumber,
          regeneration_count: newCount,
          package_type: formData?.songType || 'lite',
          timestamp: new Date().toISOString(),
        })
      })

      setIsRegeneratingWithInstructions(false)
    } catch (error) {
      console.error("Error al regenerar letra:", error)
      alert("Error al regenerar la letra. Por favor intenta de nuevo.")
      setIsRegeneratingWithInstructions(false)
    }
  }

  // Función para finalizar la edición de la letra
  const handleFinishEditing = async () => {
    setCurrentStep("complete")

    // Log finalización de edición de letra en el embudo
    logConfirmationStep("lyric_editing", {
      reference_id: referenceNumber,
      lyric_length: editedLyric.length.toString(),
      timestamp: new Date().toISOString(),
    })

    // Actualizar el enlace de WhatsApp con la letra editada
    if (formData) {
      // Guardar la letra editada en el formData
      const updatedFormData = {
        ...formData,
        generatedLyric: editedLyric,
      }
      setFormData(updatedFormData)
      localStorage.setItem("formData", JSON.stringify(updatedFormData))
      localStorage.setItem("editedLyric", editedLyric)

      // Guardar o actualizar el pedido en Supabase con la letra editada
      try {
        // Buscar el ID del pedido en los datos guardados (si está disponible)
        const savedOrderData = localStorage.getItem("savedOrderData")
        if (savedOrderData && savedOrderData.trim() !== "") {
          try {
            const parsedOrderData = JSON.parse(savedOrderData)
            if (parsedOrderData.id) {
            // Actualizar la letra en Supabase
            import("@/app/utils/supabase").then(({ updateSongLyrics }) => {
              updateSongLyrics(parsedOrderData.id, editedLyric).then((result) => {
                if (result.success) {
                  console.log("Lyrics updated in Supabase successfully")
                  setOrderSaved(true)
                  localStorage.setItem("orderSaved", "true")

                  // Log event to Statsig
                  import("@/app/utils/statsig").then(({ logLyricsUpdated }) => {
                    logLyricsUpdated(referenceNumber)
                  })
                } else {
                  console.error("Failed to update lyrics in Supabase:", result.error)
                }
              })
            })
          }
          } catch (e) {
            console.error("Error parsing savedOrderData:", e)
          }
        } else {
          // Si no hay pedido guardado, guardarlo ahora con la letra
          const basePrice = getSongPrice(formData)
          const songTypeWithPrice = basePrice ?
            `${formData.songType} - ${basePrice} ${currency}` : formData.songType || "";

          // Obtener precios de extras desde experimentPrices
          const experimentPrices = localStorage.getItem("experimentPrices")
          let expressPrice = 99, spotifyPrice = 149, videoPrice = 99
          if (experimentPrices && experimentPrices.trim() !== "") {
            try {
              const parsedPrices = JSON.parse(experimentPrices)
              expressPrice = parsedPrices.expressDelivery || 99
              spotifyPrice = parsedPrices.spotifyUpload || 149
              videoPrice = parsedPrices.video || 99
            } catch (e) {
              console.error("Error parsing experiment prices:", e)
            }
          }

          // Calcular los precios adicionales
          const deliveryExtra = formData.deliveryType === "express" ? expressPrice : 0
          const streamingExtra = formData.spotifyUpload === "yes" ? spotifyPrice : 0

          // Calcular si incluye video (premium lo incluye gratis, o puede ser addon)
          const isPremium = formData.songType === "premium" || (typeof formData.songType === 'string' && formData.songType.includes('premium'))
          const videoSelected = isPremium || formData.video === "yes"
          const videoExtra = (!isPremium && videoSelected) ? videoPrice : 0

          // Calcular ediciones extra (precio por cada paquete de addon)
          const numberOfAddons = Math.ceil(extraEditionsPurchased / EXTRA_EDITIONS_PER_ADDON)
          const extraEditionsTotal = numberOfAddons * extraEditionsPrice

          const totalPrice = basePrice + deliveryExtra + streamingExtra + videoExtra + extraEditionsTotal

          const orderData = {
            transaction_id: referenceNumber,
            customer_name: formData.customerName || "",
            email: formData.email || "",
            whatsapp: formData.whatsapp || "",
            country: formData.country || "",
            currency: currency,
            song_type: songTypeWithPrice,
            occasion: formData.occasion || "",
            include_name: formData.includeName === "yes",
            person_name: formData.personName || "",
            relationship: formData.relationship || "",
            genre: formData.genre === "Otro" ? formData.customGenre || "" : formData.genre || "",
            song_references: formData.references || "",
            voice_gender: formData.voiceGender || "",
            styles: formData.styles || [],
            details: formData.details || "",
            delivery_type: formData.deliveryType || "",
            payment_method: "freemium",
            base_price: basePrice,
            delivery_extra: deliveryExtra,
            extra_editions: extraEditionsPurchased,
            extra_editions_price: extraEditionsTotal,
            total_price: totalPrice,
            generated_lyric: editedLyric,
            spotify_upload: formData.spotifyUpload === "yes",
            video: videoSelected,
            status: "new",
            lyric_revision_count: 1, // Primera versión de la letra
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            payment_status: "pending",
          }

          import("@/app/utils/supabase").then(({ saveOrderToSupabase }) => {
            saveOrderToSupabase(orderData).then((result) => {
              if (result.success && result.data && result.data.length > 0) {
                localStorage.setItem("savedOrderData", JSON.stringify(result.data[0]))
                setOrderSaved(true)
                localStorage.setItem("orderSaved", "true")
              }
            })
          })
        }
      } catch (error) {
        console.error("Error updating lyrics in Supabase:", error)
      }
    }
  }

  // Modificar la función handleWhatsappClick para el modelo freemium
  const handleWhatsappClick = async () => {
    // Rastrear clic en WhatsApp
    trackWhatsappClick()

    // Log envío por WhatsApp en el embudo
    logConfirmationStep("whatsapp_sent", {
      reference_id: referenceNumber,
      timestamp: new Date().toISOString(),
    })

    // En el modelo freemium, el enlace de WhatsApp ya está creado y listo
    // Solo necesitamos asegurarnos de que esté disponible
    if (!whatsappLink && formData) {
      // Si por alguna razón no hay enlace, usar el del localStorage
      const storedLink = localStorage.getItem("whatsappLink")
      if (storedLink) {
        setWhatsappLink(storedLink)
      }
    }

    // Guardar/actualizar datos en Supabase con las selecciones actuales (incluyendo extras)
    // Siempre actualizar para asegurar que los extras seleccionados se guarden
    if (formData) {
      try {
        // Preparar los datos para guardar en Supabase
        const basePrice = getSongPrice(formData)
        const songTypeWithPrice = basePrice ?
          `${formData.songType} - ${basePrice} ${currency}` : formData.songType || "";

        // Obtener precios de extras desde experimentPrices
        const experimentPrices = localStorage.getItem("experimentPrices")
        let expressPrice = 99, spotifyPrice = 149, videoPrice = 99
        if (experimentPrices && experimentPrices.trim() !== "") {
          try {
            const parsedPrices = JSON.parse(experimentPrices)
            expressPrice = parsedPrices.expressDelivery || 99
            spotifyPrice = parsedPrices.spotifyUpload || 149
            videoPrice = parsedPrices.video || 99
          } catch (e) {
            console.error("Error parsing experiment prices:", e)
          }
        }

        // Calcular los precios adicionales
        const deliveryExtra = formData.deliveryType === "express" ? expressPrice : 0
        const streamingExtra = formData.spotifyUpload === "yes" ? spotifyPrice : 0

        // Calcular si incluye video (premium lo incluye gratis, o puede ser addon)
        const isPremium = formData.songType === "premium" || (typeof formData.songType === 'string' && formData.songType.includes('premium'))
        const videoSelected = isPremium || formData.video === "yes"
        const videoExtra = (!isPremium && videoSelected) ? videoPrice : 0

        // Calcular ediciones extra (precio por cada paquete de addon)
        const numberOfAddons = Math.ceil(extraEditionsPurchased / EXTRA_EDITIONS_PER_ADDON)
        const extraEditionsTotal = numberOfAddons * extraEditionsPrice

        const totalPrice = basePrice + deliveryExtra + streamingExtra + videoExtra + extraEditionsTotal

        const orderData = {
          transaction_id: referenceNumber,
          customer_name: formData.customerName || "",
          email: formData.email || "",
          whatsapp: formData.whatsapp || "",
          country: formData.country || "",
          currency: currency,
          song_type: songTypeWithPrice, // Incluye el tipo y el precio en un solo campo
          occasion: formData.occasion || "",
          include_name: formData.includeName === "yes",
          person_name: formData.personName || "",
          relationship: formData.relationship || "",
          genre: formData.genre === "Otro" ? formData.customGenre || "" : formData.genre || "",
          song_references: formData.references || "", // Using the renamed column from schema
          voice_gender: formData.voiceGender || "",
          styles: formData.styles || [],
          details: formData.details || "",
          delivery_type: formData.deliveryType || "",
          payment_method: "freemium",
          base_price: basePrice,
          delivery_extra: deliveryExtra,
          extra_editions: extraEditionsPurchased,
          extra_editions_price: extraEditionsTotal,
          total_price: totalPrice,
          generated_lyric: editedLyric,
          spotify_upload: formData.spotifyUpload === "yes",
          video: videoSelected,
          status: "new", // Estado: esperando demo
          created_at: new Date().toISOString(),
          payment_status: "pending",
        }

        // Guardar en Supabase
        const result = await saveOrderToSupabase(orderData)

        if (result.success) {
          // Marcar como guardado
          setOrderSaved(true)
          localStorage.setItem("orderSaved", "true")

          // Guardar los datos del pedido para futuras actualizaciones
          if (result.data && result.data.length > 0) {
            localStorage.setItem("savedOrderData", JSON.stringify(result.data[0]))
          }

          // Log event to Statsig
          import("@/app/utils/statsig").then(({ logOrderSaved }) => {
            logOrderSaved(referenceNumber, formData.songType, !!(formData.generatedLyric || editedLyric))
          })
        } else {
          console.error("Failed to save order to Supabase:", result.error)
        }
      } catch (error) {
        console.error("Error saving order to Supabase:", error)
      }
    }

    // Regenerar el enlace de WhatsApp con los datos actualizados (incluyendo extras seleccionados)
    let finalWhatsappLink = whatsappLink
    if (formData) {
      // Obtener precios actualizados para el mensaje
      const experimentPrices = localStorage.getItem("experimentPrices")
      let pricesForMessage = {
        express_delivery: 99,
        spotify_upload: 149,
        video: 99,
      }
      if (experimentPrices && experimentPrices.trim() !== "") {
        try {
          const parsedPrices = JSON.parse(experimentPrices)
          pricesForMessage = {
            express_delivery: parsedPrices.expressDelivery || 99,
            spotify_upload: parsedPrices.spotifyUpload || 149,
            video: parsedPrices.video || 99,
          }
        } catch (e) {
          console.error("Error parsing experiment prices:", e)
        }
      }

      // Regenerar mensaje de WhatsApp con formData actualizado (incluyendo extras)
      const updatedMessage = formatWhatsAppMessageFreemium(
        formData,
        referenceNumber,
        pricesForMessage as any,
        currency
      )

      const phoneNumber = "000000000000"
      finalWhatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(updatedMessage)}`

      // Actualizar el enlace en el estado y localStorage
      setWhatsappLink(finalWhatsappLink)
      localStorage.setItem("whatsappLink", finalWhatsappLink)
    }

    // Marcar como enviado cuando el usuario hace clic en el botón de WhatsApp
    setWhatsappSent(true)

    // Guardar estado en localStorage para mantener el estado si se recarga la página
    localStorage.setItem("whatsappSent", "true")

    // Abrir WhatsApp con el enlace actualizado
    if (finalWhatsappLink) {
        window.location.href = finalWhatsappLink;
    }
  }

  return (
    <div className="min-h-screen brand-night brand-flow py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-terracotta/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-bordeaux/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-brand-gold/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <Card className="max-w-md w-full shadow-2xl border-white/10 bg-brand-inkSoft/70 backdrop-blur-xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">
                {currentStep === "complete" ? "" : "Solicitud Recibida"}
            </CardTitle>
            <CardDescription className="text-slate-400">
                {currentStep === "complete" ? "" : "Escucha tu demo antes de pagar"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* UI para generación y edición de letra */}
            {isGeneratingLyrics && (
              <div className="bg-white/5 backdrop-blur-md border-2 border-brand-terracotta/50 p-6 sm:p-8 rounded-xl shadow-lg">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 text-brand-terracotta animate-spin" />
                    <Music className="h-6 w-6 sm:h-8 sm:w-8 text-brand-bordeaux absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-lg sm:text-xl mb-2">
                      Generando la letra de tu canción...
                    </p>
                    <p className="text-sm sm:text-base text-slate-400">
                      Esto puede tomar unos segundos. Por favor, espera.
                    </p>
                  </div>
                  {/* Barra de progreso animada */}
                  <div className="w-full max-w-xs bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-brand-terracotta to-brand-bordeaux h-2 rounded-full animate-pulse"
                      style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "edit" && !isGeneratingLyrics && (
              <div className="space-y-4 -mx-4 sm:mx-0">
                {/* Header compacto */}
                <div className="bg-gradient-to-r from-brand-terracotta/20 to-brand-bordeaux/20 border border-brand-terracotta/40 p-3 sm:p-4 rounded-lg shadow-sm backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 bg-brand-terracotta/30 p-2 rounded-full border border-brand-terracotta/50">
                      <Music className="h-5 w-5 text-brand-terracotta" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-base sm:text-lg">
                        ¡Tu letra está lista! 🎵
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400">
                        Revísala y haz los cambios que necesites
                      </p>
                    </div>
                  </div>
                </div>

                {/* Letra generada - área principal */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="lyric-editor" className="text-sm font-semibold text-white">
                      Tu canción:
                    </Label>
                    <div className="flex items-center gap-2">
                      {/* Botones de control de versiones (solo visible si hay letra anterior) */}
                      {previousLyric && (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowRevertDialog(true)}
                            className="text-xs px-2 py-1 h-auto bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200"
                          >
                            <Undo2 className="h-3 w-3 mr-1" />
                            Volver a anterior
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDiff(!showDiff)}
                            className="text-xs px-2 py-1 h-auto bg-brand-terracotta/10 border-brand-terracotta/30 text-brand-terracotta hover:bg-brand-terracotta/20 hover:text-brand-terracotta/80"
                          >
                            {showDiff ? (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Ocultar cambios
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Ver cambios
                              </>
                            )}
                          </Button>
                        </>
                      )}
                      <div className={`text-xs px-2 py-1 rounded-full ${editedLyric.length > 2000
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                        : editedLyric.length > 1800
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                          : 'bg-white/10 text-slate-400 border border-white/10'
                        }`}>
                        {editedLyric.length}/2000
                      </div>
                    </div>
                  </div>

                  {/* Leyenda de colores (solo visible en modo diff) */}
                  {showDiff && previousLyric && (
                    <div className="flex items-center gap-3 text-xs bg-slate-800/50 p-2 rounded-lg border border-white/5">
                      <span className="text-slate-400">Leyenda:</span>
                      <div className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 bg-green-500/30 border border-green-500 rounded"></span>
                        <span className="text-slate-300">Texto añadido por IA</span>
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    {showDiff && previousLyric && editedLyric ? (
                      // Mostrar vista de cambios resaltados (solo si ambas letras existen)
                      renderDiff()
                    ) : (
                      // Mostrar textarea editable normal
                      <Textarea
                        id="lyric-editor"
                        value={editedLyric}
                        onChange={(e) => {
                          const newValue = e.target.value
                          if (newValue.length <= 2000) {
                            setEditedLyric(newValue)
                            localStorage.setItem("editedLyric", newValue)
                          }
                        }}
                        maxLength={2000}
                        className={`min-h-[300px] sm:min-h-[350px] text-sm sm:text-base leading-relaxed font-sans resize-y
                                 border rounded-lg p-3 sm:p-4 transition-all
                                 bg-slate-900/80 text-white placeholder:text-slate-500
                                 ${editedLyric.length > 2000
                            ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
                            : 'border-white/20 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta/50'
                          }`}
                        placeholder="La letra de tu canción aparecerá aquí..."
                        style={{ fontSize: '16px', lineHeight: '1.7' }}
                      />
                    )}
                  </div>
                </div>

                {/* Sección de edición con IA - integrada debajo */}
                <div className={`relative group transition-all duration-300 ${hasReachedLimit() ? 'opacity-75' : ''}`}>
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-brand-terracotta to-brand-bordeaux rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 ${hasReachedLimit() ? 'hidden' : ''}`}></div>

                  <div className={`relative bg-slate-900/90 backdrop-blur-xl border rounded-xl p-4 sm:p-5 space-y-4 ${hasReachedLimit() ? 'border-slate-600/50' : 'border-white/10 shadow-2xl'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-brand-bordeaux/20 rounded-lg">
                          <Sparkles className="h-4 w-4 text-brand-bordeaux" />
                        </div>
                        <span className="text-sm font-bold text-white tracking-tight">Mejorar con IA</span>
                      </div>
                      {/* Contador de regeneraciones */}
                      <div className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${hasReachedLimit()
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : getRemainingRegenerations() === 1
                          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          : 'bg-brand-forest/10 text-brand-forest border-brand-forest/20'
                        }`}>
                        {hasReachedLimit()
                          ? 'Sin créditos'
                          : `${getRemainingRegenerations()} ${getRemainingRegenerations() === 1 ? 'edición' : 'ediciones'} de regalo`
                        }
                      </div>
                    </div>

                    {hasReachedLimit() ? (
                      // Mensaje cuando se alcanza el límite con opciones
                      <div className="space-y-4">
                        <div className="bg-slate-800/50 border border-white/5 rounded-lg p-3 text-center">
                          <p className="text-sm text-slate-300">
                            Has usado todas tus ediciones con IA del paquete <strong className="text-white capitalize">{formData?.songType || 'lite'}</strong>.
                          </p>
                        </div>

                        {/* Comprar addon de ediciones extra - solo mostrar si no ha comprado antes */}
                        {extraEditionsPurchased === 0 ? (
                          <button
                            onClick={() => setShowExtraEditionsDialog(true)}
                            className="w-full bg-gradient-to-r from-brand-bordeaux/20 to-brand-bordeaux/20 border border-brand-bordeaux/30 rounded-xl p-4 text-left hover:from-brand-bordeaux/30 hover:to-brand-bordeaux/30 transition-all group/btn"
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-gradient-to-br from-brand-bordeaux to-brand-bordeaux p-2.5 rounded-lg flex-shrink-0 shadow-lg group-hover/btn:scale-110 transition-transform">
                                <Plus className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold text-white">+{EXTRA_EDITIONS_PER_ADDON} ediciones extra</span>
                                  <span className="text-sm font-black text-brand-bordeaux">{formatPrice(extraEditionsPrice, currency)}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                  Añade más magia a tu letra ahora
                                </p>
                              </div>
                            </div>
                          </button>
                        ) : (
                          /* Mensaje si ya compró ediciones extra */
                          <div className="flex items-center justify-center gap-2 text-xs font-medium text-green-400 bg-green-500/5 py-2 rounded-lg border border-green-500/10">
                            <Check className="h-3 w-3" />
                            <span>{extraEditionsPurchased} ediciones extra desbloqueadas</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Describe lo que quieres cambiar (ej: <span className="italic">"hazlo más emotivo"</span> o <span className="italic">"menciona que nos conocimos en la playa"</span>) y nuestra IA reescribirá la letra para ti.
                        </p>

                        <div className="relative group/input">
                          <Textarea
                            id="edit-instructions"
                            value={editInstructions}
                            onChange={(e) => setEditInstructions(e.target.value)}
                            disabled={isRegeneratingWithInstructions}
                            className="min-h-[100px] text-sm leading-relaxed font-medium resize-none
                                     border-2 rounded-xl p-4 transition-all duration-300
                                     bg-slate-800/50 text-white placeholder:text-slate-500
                                     border-white/5 focus:border-brand-bordeaux/50 focus:bg-slate-800/80
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     shadow-inner"
                            placeholder='Ej: "Haz el coro más romántico y menciona su sonrisa..."'
                            style={{ fontSize: '16px' }}
                          />
                        </div>

                        <Button
                          onClick={handleRegenerateWithInstructions}
                          disabled={isRegeneratingWithInstructions || !editInstructions.trim() || hasReachedLimit()}
                          className={`w-full h-12 text-sm font-bold rounded-xl transition-all duration-300 shadow-xl
                                  ${!editInstructions.trim()
                              ? 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
                              : 'bg-gradient-to-r from-brand-bordeaux to-brand-bordeaux text-white hover:from-brand-bordeaux hover:to-brand-bordeaux shadow-brand-bordeaux/20'
                            }`}
                        >
                          {isRegeneratingWithInstructions ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="animate-pulse">Transformando tu letra...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              <span>Aplicar cambios con IA</span>
                            </div>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Botón principal para continuar */}
                <div className="pt-2 sticky bottom-0 bg-brand-ink/95 backdrop-blur-md pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                  <Button
                    onClick={handleFinishEditing}
                    className="w-full h-12 text-base
                           bg-gradient-to-r from-brand-terracotta to-brand-bordeaux hover:from-brand-terracottaDeep hover:to-brand-bordeaux
                           text-white font-bold shadow-lg hover:shadow-xl transition-all
                           active:scale-[0.98]"
                  >
                    <Check className="mr-2 h-5 w-5" />
                    Continuar con esta letra
                  </Button>
                  <p className="text-center text-xs text-slate-500 mt-2">
                    Podrás revisar todo antes de confirmar
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Complete & Confirmation - REFACTORED (Replaced old AlertDialog flow) */}
            {currentStep === "complete" && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Success Banner */}
                <div className="bg-green-500/20 border border-green-500/50 p-4 rounded-xl flex items-center gap-3">
                  <div className="bg-green-500/20 p-2 rounded-full flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">¡Letra lista!</h3>
                    <p className="text-slate-300 text-sm">Ya guardamos tu letra.</p>
                  </div>
                </div>

                {/* Título y descripción movidos aquí */}
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-white mb-2">¡Ya casi tienes tu canción!</h2>
                  <p className="text-slate-400">Solo falta confirmar por WhatsApp.</p>
                </div>

                {/* Extras Section - Also in wizard Step 9, kept here as secondary upsell */}
                {formData && (() => {
                  const isPremium = formData.songType === "premium"
                  const isVideoSelected = isPremium || formData.video === "yes"

                  return (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-white mb-1">Añade extras (opcional) 💎</h3>
                        <p className="text-sm text-slate-400">Solo si quieres mejorar aún más tu canción.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Video Lyric Card */}
                        <button
                          type="button"
                          disabled={isPremium}
                          onClick={() => {
                            if (!isPremium) {
                              const newValue = formData.video === "yes" ? "no" : "yes"
                              const updatedFormData = { ...formData, video: newValue }
                              setFormData(updatedFormData)
                              localStorage.setItem("formData", JSON.stringify(updatedFormData))
                            }
                          }}
                          className={`relative p-4 sm:p-5 rounded-xl border-2 text-left transition-all ${isVideoSelected
                            ? isPremium
                              ? "border-amber-500 bg-amber-500/20 cursor-default"
                              : "border-brand-terracotta bg-brand-terracotta/20"
                            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-brand-terracotta/30"
                            }`}
                        >
                          <div className="flex flex-col h-full justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-3xl">🎬</span>
                                {isVideoSelected && (
                                  <div className={`${isPremium ? "bg-amber-500" : "bg-brand-terracotta"} rounded-full p-1`}>
                                    <Check className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>
                              <h3 className={`font-bold text-base mb-1 ${isVideoSelected ? (isPremium ? "text-amber-400" : "text-brand-terracotta") : "text-white"}`}>
                                Video Lyric
                              </h3>
                              <p className="text-xs text-slate-400 mb-3">
                                Video tipo karaoke con la letra de tu canción.
                              </p>
                            </div>
                            <div className="pt-3 border-t border-white/10">
                              {isPremium ? (
                                <span className="inline-block bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-1 rounded border border-amber-500/30">
                                  INCLUIDO
                                </span>
                              ) : (
                                <span className="block font-bold text-brand-terracotta text-base">
                                  +{formatPrice(currencyPrices.video, currency)}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Spotify Upload Card */}
                        <button
                          type="button"
                          onClick={() => {
                            const newValue = formData.spotifyUpload === "yes" ? "no" : "yes"
                            const updatedFormData = { ...formData, spotifyUpload: newValue }
                            setFormData(updatedFormData)
                            localStorage.setItem("formData", JSON.stringify(updatedFormData))
                          }}
                          className={`relative p-4 sm:p-5 rounded-xl border-2 text-left transition-all ${formData.spotifyUpload === "yes"
                            ? "border-green-500 bg-green-500/20"
                            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-green-500/30"
                            }`}
                        >
                          <div className="flex flex-col h-full justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-3xl">🚀</span>
                                {formData.spotifyUpload === "yes" && (
                                  <div className="bg-green-500 rounded-full p-1">
                                    <Check className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>
                              <h3 className={`font-bold text-base mb-1 ${formData.spotifyUpload === "yes" ? "text-green-400" : "text-white"}`}>
                                Subir a Spotify
                              </h3>
                              <p className="text-xs text-slate-400 mb-3">
                                Tu canción en Spotify y otras plataformas.
                              </p>
                            </div>
                            <div className="pt-3 border-t border-white/10">
                              <span className="block font-bold text-green-400 text-base">
                                +{formatPrice(currencyPrices.spotify_upload, currency)}
                              </span>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )
                })()}

                {/* Main Action Call */}
                <div className="text-center py-2">
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    Para recibir tu <strong>demo de 70 segundos</strong>, solo confirma tu pedido por WhatsApp.
                  </p>

                  {/* Freemium Pill */}
                  <div className="inline-flex items-center gap-2 bg-brand-terracotta/10 border border-brand-terracotta/20 rounded-full px-4 py-1.5 mb-6">
                    <Music className="h-4 w-4 text-brand-terracotta" />
                    <span className="text-brand-terracotta text-sm font-medium">Escucha tu demo antes de pagar</span>
                  </div>

                  {/* Price Summary */}
                  {formData && (
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5 mb-6 text-left">
                      <h4 className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3">Resumen del pedido</h4>
                      <div className="space-y-2 text-sm">
                        {(() => {
                          // Leer precios desde experimentPrices (misma lógica que handleFinishEditing/handleWhatsappClick)
                          const experimentPrices = localStorage.getItem("experimentPrices")
                          let expressPrice = 99, spotifyPrice = 149, videoPrice = 99
                          if (experimentPrices && experimentPrices.trim() !== "") {
                            try {
                              const parsedPrices = JSON.parse(experimentPrices)
                              expressPrice = parsedPrices.expressDelivery || 99
                              spotifyPrice = parsedPrices.spotifyUpload || 149
                              videoPrice = parsedPrices.video || 99
                            } catch (e) {
                              console.error("Error parsing experiment prices:", e)
                            }
                          }

                          // Calcular extras
                          const base = formData.songTypePrice || 0
                          const deliveryExtra = formData.deliveryType === 'express' ? expressPrice : 0
                          const streamingExtra = formData.spotifyUpload === 'yes' ? spotifyPrice : 0

                          // Video: premium lo incluye gratis, o puede ser addon
                          const isPremium = formData.songType === 'premium' || (typeof formData.songType === 'string' && formData.songType.includes('premium'))
                          const videoSelected = isPremium || formData.video === 'yes'
                          const videoExtra = (!isPremium && videoSelected) ? videoPrice : 0

                          // Calcular ediciones extra (precio por cada paquete de addon)
                          const numberOfAddons = Math.ceil(extraEditionsPurchased / EXTRA_EDITIONS_PER_ADDON)
                          const extraEditionsTotal = numberOfAddons * extraEditionsPrice

                          const total = base + deliveryExtra + streamingExtra + videoExtra + extraEditionsTotal

                          return (
                            <>
                              <div className="flex justify-between text-slate-300">
                                <span>Canción {formData.songType?.split(' - ')[0] || 'Personalizada'}</span>
                                <span>{formatPrice(base, currency)}</span>
                              </div>
                              {formData.deliveryType === 'express' && (
                                <div className="flex justify-between text-brand-terracotta">
                                  <span>Entrega Rápida</span>
                                  <span>+ {formatPrice(expressPrice, currency)}</span>
                                </div>
                              )}
                              {formData.spotifyUpload === 'yes' && (
                                <div className="flex justify-between text-brand-terracotta">
                                  <span>Subida a Spotify</span>
                                  <span>+ {formatPrice(spotifyPrice, currency)}</span>
                                </div>
                              )}
                              {videoSelected && (
                                <div className="flex justify-between text-brand-terracotta">
                                  <span>Video Musical</span>
                                  <span>{isPremium ? 'Incluido' : `+ ${formatPrice(videoPrice, currency)}`}</span>
                                </div>
                              )}
                              {extraEditionsPurchased > 0 && (
                                <div className="flex justify-between text-brand-bordeaux">
                                  <span>+{extraEditionsPurchased} Ediciones extra</span>
                                  <span>+ {formatPrice(extraEditionsTotal, currency)}</span>
                                </div>
                              )}
                              <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-bold text-white">
                                <span>Total a pagar (si te gusta)</span>
                                <span>{formatPrice(total, currency)}</span>
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Action Button */}
                <Button
                  className={`w-full h-12 text-base font-bold shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]
                    ${whatsappSent
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"}`}
                  onClick={handleWhatsappClick}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {whatsappSent ? "Abrir WhatsApp de nuevo" : "Enviar solicitud por WhatsApp"}
                </Button>

                <p className="text-center text-xs text-slate-500 mt-4">
                  Al hacer clic, se abrirá WhatsApp con los detalles de tu pedido listos para enviar.
                </p>

                {whatsappSent && (
                  <div className="pt-4 mt-4 border-t border-white/10 text-center">
                    <Link href="/" className="text-sm text-brand-terracotta hover:text-brand-terracotta underline">
                      Volver al inicio
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="text-center text-xs text-slate-500 mt-6">
              <p>Referencia: {referenceNumber}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo de confirmación para ediciones extra */}
      <AlertDialog open={showExtraEditionsDialog} onOpenChange={setShowExtraEditionsDialog}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Agregar ediciones extra
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Estás a punto de agregar <strong className="text-brand-bordeaux">+{EXTRA_EDITIONS_PER_ADDON} ediciones extra</strong> por{" "}
              <strong className="text-brand-bordeaux">{formatPrice(extraEditionsPrice, currency)}</strong>.
              <br /><br />
              Este costo se sumará al total de tu pedido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handlePurchaseExtraEditions()
                setShowExtraEditionsDialog(false)
              }}
              className="bg-gradient-to-r from-brand-bordeaux to-brand-bordeaux hover:from-brand-bordeaux hover:to-brand-bordeaux text-white"
            >
              Sí, agregar ediciones
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmación para revertir a letra anterior */}
      <AlertDialog open={showRevertDialog} onOpenChange={setShowRevertDialog}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              ¿Revertir a la letra anterior?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              La letra generada por IA se perderá y no podrás recuperarla.
              Si quieres regenerarla después, necesitarás usar otro crédito de edición.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // Restaurar la letra anterior
                setEditedLyric(previousLyric)
                localStorage.setItem("editedLyric", previousLyric)
                // Limpiar para evitar loops
                setPreviousLyric("")
                setShowDiff(false)
                // Log event
                import("@/app/utils/statsig").then(({ logEvent }) => {
                  logEvent("lyrics_reverted_to_previous", 1, {
                    reference_id: referenceNumber,
                    package_type: formData?.songType || 'lite',
                    timestamp: new Date().toISOString(),
                  })
                })
              }}
              className="bg-gradient-to-r from-brand-terracotta to-brand-bordeaux hover:from-brand-terracottaDeep hover:to-brand-bordeaux text-white"
            >
              Sí, revertir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
