import type { FormData } from "./types"
import { formatPrice as formatPriceLib } from "@/lib/format-price"
import type { CurrencyCode } from "@/lib/currency-config"

// ============================================
// Validation Functions
// ============================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidWhatsApp(whatsapp: string): boolean {
  if (!whatsapp) return false
  // Remove spaces and normalize
  let cleaned = whatsapp.replace(/\s/g, "")
  // Add '+' prefix if missing (user can enter with or without it)
  if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned
  }
  return /^\+[1-9]\d{9,14}$/.test(cleaned)
}

// ============================================
// Step Names for Analytics
// ============================================

const STEP_NAMES: Record<number, string> = {
  1: "Tipo de canción",
  2: "Ocasión",
  3: "Nombre en la canción",
  4: "Relación con la persona",
  5: "Género de voz",
  6: "Tu historia",
  7: "Preferencias musicales",
  8: "Tipo de entrega",
  9: "Extras",
  10: "Datos de contacto",
}

export function getStepName(stepNumber: number): string {
  return STEP_NAMES[stepNumber] || `Paso ${stepNumber}`
}

// ============================================
// Price Calculation Functions
// ============================================

export interface CurrencyPrices {
  lite: number
  standard: number
  premium: number
  express_delivery: number
  spotify_upload: number
  video: number
  [key: string]: number
}

export function getSongTypePrice(songType: string, prices: CurrencyPrices): number {
  switch (songType) {
    case "lite":
      return prices.lite
    case "estandar":
      return prices.standard
    case "premium":
      return prices.premium
    default:
      return 0
  }
}

export function calculateTotalPrice(
  formData: FormData,
  currencyPrices: CurrencyPrices,
  songTypePrice: number
): { total: number; deliveryExtra: number; streamingExtra: number; videoExtra: number } {
  const deliveryExtra = formData.deliveryType === "express" ? currencyPrices.express_delivery : 0
  const streamingExtra = formData.spotifyUpload === "yes" ? currencyPrices.spotify_upload : 0

  const isPremium = formData.songType === "premium"
  const videoSelected = isPremium || formData.video === "yes"
  const videoExtra = (!isPremium && videoSelected) ? currencyPrices.video : 0

  const total = songTypePrice + deliveryExtra + streamingExtra + videoExtra

  return { total, deliveryExtra, streamingExtra, videoExtra }
}

// ============================================
// Reference ID Generation
// ============================================

export function generateReferenceId(): string {
  return `MLD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

// ============================================
// WhatsApp Message Formatting
// ============================================

export function formatWhatsAppMessageFreemium(
  data: FormData & {
    songTypePrice?: number
    extraEditions?: number
    extra_editions?: number
    extraEditionsPrice?: number
    extra_editions_price?: number
  },
  referenceId: string,
  currencyPrices: CurrencyPrices,
  currency: string
): string {
  const formatPrice = (price: number) => formatPriceLib(price, currency as CurrencyCode)
  const songPrice = data.songTypePrice || 0
  const deliveryExtra = data.deliveryType === "express" ? currencyPrices.express_delivery : 0
  const streamingExtra = data.spotifyUpload === "yes" ? currencyPrices.spotify_upload : 0

  const isPremium = data.songType === "premium" || (data.songType && data.songType.toString().toLowerCase().includes("premium"))
  const videoSelected = isPremium || data.video === "yes"
  const videoExtra = (!isPremium && videoSelected) ? currencyPrices.video : 0

  const extraEditionsCount = Number(data.extraEditions ?? data.extra_editions ?? 0) || 0
  const extraEditionsPerAddon = 3
  const extraEditionsUnitPrice = Number(data.extraEditionsPrice ?? currencyPrices.extra_editions ?? 0) || 0
  const extraEditionsTotalFromData = Number(data.extra_editions_price ?? 0) || 0
  const extraEditionsTotal =
    extraEditionsTotalFromData > 0
      ? extraEditionsTotalFromData
      : extraEditionsCount > 0
        ? Math.ceil(extraEditionsCount / extraEditionsPerAddon) * extraEditionsUnitPrice
        : 0

  const totalPrice = songPrice + deliveryExtra + streamingExtra + videoExtra + extraEditionsTotal

  let deliveryText = "Estándar (3-5 días)"
  if (data.deliveryType === "slow") deliveryText = "Estándar (10-12 días)"
  if (data.deliveryType === "standard") deliveryText = "Rápida (3-5 días)"
  if (data.deliveryType === "express") deliveryText = "Urgente (24 horas)"

  return `*NUEVA SOLICITUD DE CANCIÓN PERSONALIZADA*

*DATOS DEL CLIENTE:*
Nombre: ${data.customerName || "No especificado"}
WhatsApp: ${data.whatsapp || "No especificado"}

*DETALLES DE LA CANCIÓN:*
Tipo: ${data.songType || "No especificado"}
Precio base: ${formatPrice(songPrice)}
${deliveryExtra > 0 ? `Entrega urgente: +${formatPrice(deliveryExtra)}\n` : ""}${streamingExtra > 0 ? `Distribución en plataformas: +${formatPrice(streamingExtra)}\n` : ""}${videoExtra > 0 ? `Video Lyric: +${formatPrice(videoExtra)}\n` : ""}${extraEditionsTotal > 0 ? `Ediciones de letra extra${extraEditionsCount > 0 ? ` (+${extraEditionsCount})` : ""}: +${formatPrice(extraEditionsTotal)}\n` : ""}*TOTAL: ${formatPrice(totalPrice)}*

Ocasión: ${data.occasion || "No especificado"}
Incluir nombre: ${data.includeName === "yes" ? "Sí" : "No"}
${data.includeName === "yes" ? `Nombre a incluir: ${data.personName || "No especificado"}\n` : ""}Relación: ${data.relationship || "No especificado"}
Género musical: ${data.genre === "Otro" ? data.customGenre || "No especificado" : data.genre || "No especificado"}
Referencias: ${data.references || "No especificado"}
Voz: ${data.voiceGender === "male" ? "Masculina" : data.voiceGender === "female" ? "Femenina" : "No especificado"}
Estilos: ${data.styles?.join(", ") || "No especificado"}

*DETALLES PARA LA LETRA:*
${data.details || "No especificado"}

*ENTREGA Y EXTRAS:*
Tipo: ${deliveryText}
Distribución en plataformas: ${data.spotifyUpload === "yes" ? "Sí (Spotify, Apple Music, YouTube Music)" : "No"}
Video Lyric: ${videoSelected ? (isPremium ? "Sí (Incluido en Premium)" : "Sí") : "No"}

*REFERENCIA:* ${referenceId}`
}

// ============================================
// Form Validation per Step
// ============================================

export interface ValidationResult {
  isValid: boolean
  errorTitle?: string
  errorDescription?: string
}

export function validateStep(step: number, formData: FormData): ValidationResult {
  switch (step) {
    case 1:
      if (!formData.songType) {
        return {
          isValid: false,
          errorTitle: "Campo requerido",
          errorDescription: "Por favor, selecciona el tipo de canción.",
        }
      }
      break

    case 2:
      if (!formData.occasion) {
        return {
          isValid: false,
          errorTitle: "Campo requerido",
          errorDescription: "Por favor, indica la ocasión para tu canción.",
        }
      }
      break

    case 3:
      // Paso combinado: incluir nombre + nombre de la persona
      if (!formData.includeName) {
        return {
          isValid: false,
          errorTitle: "Campo requerido",
          errorDescription: "Por favor, selecciona si deseas incluir un nombre en la letra.",
        }
      }
      if (formData.includeName === "yes" && !formData.personName?.trim()) {
        return {
          isValid: false,
          errorTitle: "Campo requerido",
          errorDescription: "Por favor, indica el nombre de la persona.",
        }
      }
      break

    case 4:
      if (!formData.relationship) {
        return {
          isValid: false,
          errorTitle: "Campo requerido",
          errorDescription: "Por favor, indica tu relación con la persona.",
        }
      }
      break

    case 5:
      if (!formData.voiceGender) {
        return {
          isValid: false,
          errorTitle: "Campo requerido",
          errorDescription: "Por favor, selecciona el género de voz.",
        }
      }
      break

    case 6:
      // Tu historia / detalles
      if (!formData.details) {
        return {
          isValid: false,
          errorTitle: "Campo requerido",
          errorDescription: "Por favor, cuéntanos tu historia para personalizar la canción.",
        }
      }
      break

    case 7:
      // Paso combinado: género + estilo + referencias (referencias opcionales)
      if (!formData.genre) {
        return {
          isValid: false,
          errorTitle: "Campo requerido",
          errorDescription: "Por favor, selecciona el género musical.",
        }
      }
      if (formData.genre === "Otro" && !formData.customGenre?.trim()) {
        return {
          isValid: false,
          errorTitle: "Campo requerido",
          errorDescription: "Por favor, escribe el género musical personalizado.",
        }
      }
      if (!formData.styles?.length) {
        return {
          isValid: false,
          errorTitle: "Campo requerido",
          errorDescription: "Por favor, selecciona al menos un estilo para tu canción.",
        }
      }
      break

    case 8:
      if (!formData.deliveryType) {
        return {
          isValid: false,
          errorTitle: "Campo requerido",
          errorDescription: "Por favor, selecciona el tipo de entrega.",
        }
      }
      break

    case 9:
      // Extras son opcionales - sin validación
      break

    case 10:
      // Paso combinado: nombre del cliente + WhatsApp
      if (!formData.customerName?.trim()) {
        return {
          isValid: false,
          errorTitle: "Campo requerido",
          errorDescription: "Por favor, ingresa tu nombre.",
        }
      }
      if (!formData.whatsapp) {
        return {
          isValid: false,
          errorTitle: "Campo requerido",
          errorDescription: "Por favor, ingresa tu número de WhatsApp.",
        }
      }
      if (!isValidWhatsApp(formData.whatsapp)) {
        return {
          isValid: false,
          errorTitle: "Número inválido",
          errorDescription: "Por favor, ingresa un número de WhatsApp válido (solo números, con o sin +).",
        }
      }
      break
  }

  return { isValid: true }
}

// ============================================
// Order Data Preparation
// ============================================

export interface OrderData {
  transaction_id: string
  customer_name: string
  email: string
  whatsapp: string
  currency: string
  song_type: string
  occasion: string
  include_name: boolean
  person_name: string
  relationship: string
  genre: string
  song_references: string
  voice_gender: string
  styles: string[]
  details: string
  delivery_type: string
  spotify_upload: boolean
  video: boolean
  payment_method: string
  base_price: number
  delivery_extra: number
  total_price: number
  generated_lyric: string
  status: string
  created_at: string
  payment_status: string
}

export function prepareOrderData(
  formData: FormData,
  referenceId: string,
  currency: string,
  songTypePrice: number,
  currencyPrices: CurrencyPrices
): OrderData {
  const { total, deliveryExtra } = calculateTotalPrice(formData, currencyPrices, songTypePrice)
  const isPremium = formData.songType === "premium"
  const videoSelected = isPremium || formData.video === "yes"

  return {
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
    delivery_type: formData.deliveryType === "slow" ? "standard" : formData.deliveryType || "",
    spotify_upload: formData.spotifyUpload === "yes",
    video: videoSelected,
    payment_method: "freemium",
    base_price: songTypePrice,
    delivery_extra: deliveryExtra,
    total_price: total,
    generated_lyric: "",
    status: "lead",
    created_at: new Date().toISOString(),
    payment_status: "pending",
  }
}
