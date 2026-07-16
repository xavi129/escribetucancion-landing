type EventNames =
  | "begin_checkout"
  | "add_to_cart"
  | "purchase"
  | "form_start"
  | "form_step_complete"
  | "form_submit"
  | "song_play"
  | "song_demo_play"
  | "song_demo_complete"
  | "CompleteRegistration"
  | "confirmation_view"
  | "contact_click"
  | "landing_page_view"

type EventProps = {
  [key: string]: string | number | boolean | undefined
}

// Utilidades para evitar duplicados por sesión
const hasSentOnce = (eventName: string) => {
  if (typeof window === "undefined") return false
  try {
    return sessionStorage.getItem(`__evt_once__${eventName}`) === "1"
  } catch {
    return false
  }
}

const markSentOnce = (eventName: string) => {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(`__evt_once__${eventName}`, "1")
  } catch {
    // ignore
  }
}

// Función auxiliar para convertir snake_case a Title Case
const toTitleCase = (str: string) => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

// Función auxiliar para enviar evento a Microsoft Clarity
const sendToClarity = (eventName: string, eventProps?: EventProps) => {
  if (typeof window === "undefined" || !window.clarity) return

  try {
    // 1. Determine readable name
    // Clarity prefiere nombres legibles y únicos para "Smart Events"
    // Para steps del funnel, usamos nombres distintos para facilitar la creación de funnels
    let readableName = toTitleCase(eventName)

    if (eventName === "form_step_complete" && eventProps?.step_number) {
      readableName = `Form Step ${eventProps.step_number} Complete`
    } else if (eventName === "form_start" && eventProps?.form_type) {
        // Opcional: Distinguir por tipo de formulario si fuera necesario
        // readableName = `Form Start: ${toTitleCase(String(eventProps.form_type))}`
    }

    // 2. Send Event
    window.clarity("event", readableName)

    // 3. Set Tags for properties
    // Clarity permite filtrar sesiones por "Custom Tags"
    if (eventProps) {
      Object.entries(eventProps).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Clarity tags must be strings
          window.clarity("set", key, String(value))
        }
      })
    }
  } catch (error) {
    console.error("[Clarity] Error sending event:", error)
  }
}

// Función auxiliar para enviar evento a TikTok Pixel con reintentos
const sendToTikTokPixel = (eventName: string, maxRetries = 10, retryDelay = 100) => {
  if (typeof window === "undefined") return

  const trySend = (attempt: number) => {
    if (window.ttq && typeof window.ttq.track === "function") {
      try {
        window.ttq.track(eventName)
        if (process.env.NODE_ENV === "development") {
          console.log(`[TikTok Pixel] Event sent: ${eventName}`)
        }
      } catch (error) {
        console.error(`[TikTok Pixel] Error sending event ${eventName}:`, error)
      }
    } else if (attempt < maxRetries) {
      // Si TikTok Pixel no está disponible, intentar de nuevo después de un delay
      setTimeout(() => trySend(attempt + 1), retryDelay)
    } else {
      console.warn(`[TikTok Pixel] Event ${eventName} could not be sent after ${maxRetries} attempts`)
    }
  }

  trySend(0)
}

// Función para enviar eventos a todas las plataformas de analítica
export const trackEvent = async (eventName: EventNames, eventProps?: EventProps) => {
  // Deduplicar CompleteRegistration por sesión
  if (eventName === "CompleteRegistration") {
    if (hasSentOnce(eventName)) {
      if (process.env.NODE_ENV === "development") {
        console.log(`[Analytics] Skipped duplicate ${eventName}`)
      }
      return
    }
    markSentOnce(eventName)
  }

  // Enviar a Microsoft Clarity
  // Se envía a Clarity antes que otros para asegurar captura
  sendToClarity(eventName, eventProps)

  // Enviar a Google Analytics
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventProps)
  }

  // Enviar a TikTok Pixel
  // Nota: TikTok Pixel no soporta eventProps, solo el nombre del evento
  // Para CompleteRegistration, usar función con reintentos para asegurar el envío
  if (eventName === "CompleteRegistration") {
    sendToTikTokPixel(eventName)
  } else {
    if (typeof window !== "undefined" && window.ttq) {
      window.ttq.track(eventName)
    }
  }

  // Enviar a Meta Pixel (Facebook)
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, eventProps)
  }

  // Enviar a dataLayer para GTM
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...(eventProps || {}),
    })
  }

  // Enviar a Statsig
  if (eventName === "CompleteRegistration") {
    try {
      const { logEvent } = await import("@/app/utils/statsig")
      // Filtrar valores undefined para cumplir con el tipo de Statsig
      const statsigProps = eventProps
        ? Object.fromEntries(
          Object.entries(eventProps).filter(([_, value]) => value !== undefined)
        ) as Record<string, string | number | boolean>
        : undefined
      await logEvent("complete_registration", undefined, statsigProps)
    } catch (error) {
      console.error("[Statsig] Error sending CompleteRegistration event:", error)
    }
  }

  if (eventName === "landing_page_view") {
    try {
      const { logEvent } = await import("@/app/utils/statsig")
      // Filtrar valores undefined para cumplir con el tipo de Statsig
      const statsigProps = eventProps
        ? Object.fromEntries(
          Object.entries(eventProps).filter(([_, value]) => value !== undefined)
        ) as Record<string, string | number | boolean>
        : undefined
      await logEvent("landing_page_view", undefined, statsigProps)
    } catch (error) {
      console.error("[Statsig] Error sending landing_page_view event:", error)
    }
  }

  // Log para desarrollo
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${eventName}`, eventProps)
  }
}

// Eventos específicos para el flujo de compra
export const trackFormStart = (formType: string) => {
  trackEvent("form_start", { form_type: formType }).catch((error) => {
    console.error("[Analytics] Error in trackFormStart:", error)
  })
}

export const trackFormStepComplete = (formType: string, stepNumber: number, stepName: string) => {
  trackEvent("form_step_complete", {
    form_type: formType,
    step_number: stepNumber,
    step_name: stepName,
  })
}

export const trackFormSubmit = (formType: string) => {
  trackEvent("form_submit", { form_type: formType })
}

export const trackPurchase = (transactionId: string, value: number, currency = "MXN", songType?: string) => {
  trackEvent("purchase", {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    song_type: songType,
  })
}

export const trackSongPlay = (songTitle: string, songGenre?: string) => {
  trackEvent("song_play", {
    song_title: songTitle,
    song_genre: songGenre,
  })
}

export const trackWhatsappClick = () => {
  trackEvent("CompleteRegistration")
}

export const trackLandingPageView = (eventProps?: EventProps) => {
  trackEvent("landing_page_view", eventProps).catch((error) => {
    console.error("[Analytics] Error in trackLandingPageView:", error)
  })
}

// Modificar el mensaje para incluir un recordatorio sobre el comprobante cuando el método de pago es transferencia
const formatWhatsAppMessage = (data: any, paymentMethod: string, reference: string, lyric?: string) => {
  let message = `*NUEVA SOLICITUD DE CANCIÓN PERSONALIZADA*
  
*Datos del Cliente:*
Nombre: ${data.customerName || "No especificado"}
WhatsApp: ${data.whatsapp || "No especificado"}
Email: ${data.email || "No especificado"}
País: ${data.country || "No especificado"}

*Detalles de la Canción:*
Tipo: ${data.songType || "No especificado"}
Ocasión: ${data.occasion || "No especificado"}
Incluir nombre: ${data.includeName === "yes" ? "Sí" : "No"}
${data.includeName === "yes" ? `Nombre a incluir: ${data.personName || "No especificado"}` : ""}
Relación: ${data.relationship || "No especificado"}
Género musical: ${data.genre || "No especificado"}
Referencias: ${data.references || "No especificado"}
Voz: ${data.voiceGender === "male" ? "Masculina" : data.voiceGender === "female" ? "Femenina" : "No especificado"}
Estilos: ${data.styles?.join(", ") || "No especificado"}

*Detalles para la letra:*
${data.details || "No especificado"}`

  // Añadir la letra si está disponible
  if (lyric && lyric.trim()) {
    message += `

*Letra propuesta:*
${lyric}`
  }

  message += `

*Entrega:*
Tipo: ${data.deliveryType === "standard" ? "Estándar (3-5 días)" : "Rápida (24 horas)"}
Método de pago: ${paymentMethod === "card" ? "Tarjeta (Pagado)" : "Transferencia"}
${paymentMethod === "transfer" ? "\n*IMPORTANTE: Por favor adjunta el comprobante de transferencia junto con este mensaje*" : ""}

*Referencia:* ${reference}`

  return message
}

// Declaración de tipos para window
declare global {
  interface Window {
    gtag: (command: string, action: string, params?: any) => void
    ttq: any
    fbq: any
    dataLayer: any[]
    clarity: (command: "event" | "set" | "upgrade" | "consent" | "identify", ...args: any[]) => void
  }
}
