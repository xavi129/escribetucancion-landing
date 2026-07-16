import { StatsigClient } from "@statsig/js-client"
// import { StatsigSessionReplayPlugin } from "@statsig/session-replay"
import { StatsigAutoCapturePlugin } from "@statsig/web-analytics"

// Singleton instance of StatsigClient
let statsigClient: StatsigClient | null = null
let inMemoryAnonymousId: string | null = null

// Obtiene o crea un userID estable para bucketing consistente
const getOrCreateStableUserId = (): string => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const key = "statsig_user_id"
      const existing = localStorage.getItem(key)
      if (existing && existing.trim().length > 0) {
        return existing
      }
      const created = `anon_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`
      localStorage.setItem(key, created)
      return created
    }
  } catch {
    // Ignorar errores de acceso a localStorage
  }
  // Fallback SSR o si localStorage falla: mantener en memoria durante la sesión
  if (!inMemoryAnonymousId) {
    inMemoryAnonymousId = `anon_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`
  }
  return inMemoryAnonymousId
}

// Initialize Statsig client
export const initializeStatsig = async (userId: string) => {
  if (statsigClient) {
    return statsigClient
  }

  // Create a unique user ID if not provided
  const userIdToUse = userId || getOrCreateStableUserId()

  // Obtener la key de Statsig desde variables de entorno
  const statsigClientKey = process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY

  if (!statsigClientKey) {
    console.error("NEXT_PUBLIC_STATSIG_CLIENT_KEY no está configurada en las variables de entorno")
    throw new Error("Statsig client key is not configured")
  }

  statsigClient = new StatsigClient(
    statsigClientKey,
    { userID: userIdToUse },
    {
      plugins: [
        // new StatsigSessionReplayPlugin(),
        new StatsigAutoCapturePlugin()
      ],
    },
  )

  await statsigClient.initializeAsync()
  return statsigClient
}

// Get Statsig client (initialize if needed)
export const getStatsigClient = async (userId?: string) => {
  if (!statsigClient) {
    return initializeStatsig(userId || "")
  }
  return statsigClient
}

// Get experiment value with fallback
export const getExperimentValue = async <T>(
  experimentName: string, 
  parameterName: string, 
  fallbackValue: T,
  userId?: string
)
: Promise<T> =>
{
  const client = await getStatsigClient(userId)

  try {
    const experiment = client.getExperiment(experimentName)
    return experiment.get(parameterName, fallbackValue) as T;
  } catch (error) {
    console.error(`Error getting experiment value for ${experimentName}:`, error)
    return fallbackValue;
  }
}

// Log custom event
export const logEvent = async (
  eventName: string,
  value?: string | number,
  metadata?: Record<string, string | number | boolean>,
) => {
  const client = await getStatsigClient()
  client.logEvent(
    eventName,
    value,
    metadata ? Object.fromEntries(Object.entries(metadata).map(([k, v]) => [k, String(v)])) : undefined,
  )
}

// Price experiment specific functions
export const PRICE_EXPERIMENT_NAME = "price_test"

export const getPriceExperiment = async (userId?: string) => {
  const client = await getStatsigClient(userId)
  const experiment = client.getExperiment(PRICE_EXPERIMENT_NAME)

  // Get price variants from the experiment
  // Valores por defecto actualizados a precios estáticos temporales
  const litePlanPrice = experiment.get("lite_plan_price", 199)
  const standardPlanPrice = experiment.get("standard_plan_price", 349)
  const premiumPlanPrice = experiment.get("premium_plan_price", 899)

  // Get original prices for comparison
  const litePlanOriginalPrice = experiment.get("lite_plan_original_price", 499)
  const standardPlanOriginalPrice = experiment.get("standard_plan_original_price", 1199)
  const premiumPlanOriginalPrice = experiment.get("premium_plan_original_price", 1599)

  // Get variant name for tracking - usar el método correcto del SDK
    const variantName = experiment.groupName || "control"

  // Log exposure to experiment
  client.logEvent("experiment_exposure", PRICE_EXPERIMENT_NAME, {
    variant: variantName,
    lite_price: litePlanPrice.toString(),
    standard_price: standardPlanPrice.toString(),
    premium_price: premiumPlanPrice.toString(),
  })

  return {
    lite_plan_price: litePlanPrice,
    standard_plan_price: standardPlanPrice,
    premium_plan_price: premiumPlanPrice,
    lite_plan_original_price: litePlanOriginalPrice,
    standard_plan_original_price: standardPlanOriginalPrice,
    premium_plan_original_price: premiumPlanOriginalPrice,
    variant: variantName,
  }
}

// Log price view event
export const logPriceView = async (planType: string, price: number, userId?: string) => {
  const client = await getStatsigClient(userId)
  client.logEvent("price_view", planType, {
    price: price.toString(),
    experiment: PRICE_EXPERIMENT_NAME,
  })
}

// Log price selection event (cuando el usuario hace clic en un plan)
export const logPriceSelection = async (planType: string, price: number, userId?: string) => {
  const client = await getStatsigClient(userId)
  client.logEvent("price_selection", planType, {
    price: price.toString(),
    experiment: PRICE_EXPERIMENT_NAME,
  })
}

// Log checkout started event
export const logCheckoutStarted = async (
  planType: string,
  price: number,
  userId?: string,
) => {
  const client = await getStatsigClient(userId)
  client.logEvent("checkout_started", price, {
    plan_type: planType,
    experiment: PRICE_EXPERIMENT_NAME,
  })
}

// Log purchase completed event (evento clave para conversión)
export const logPurchaseCompleted = async (
  planType: string,
  price: number,
  userId?: string,
  metadata?: Record<string, string | number | boolean>,
) => {
  const client = await getStatsigClient(userId)
  client.logEvent("purchase_completed", price, {
    plan_type: planType,
    experiment: PRICE_EXPERIMENT_NAME,
    ...metadata,
  })
}

// Lyrics related events
export const logLyricsGenerated = async (
  transactionId: string,
  lyricsCount: number,
  metadata?: Record<string, string | number | boolean>,
) => {
  await logEvent("lyrics_generated", lyricsCount, {
    transaction_id: transactionId,
    ...metadata,
  })
}

export const logLyricSelected = async (
  transactionId: string,
  selectedIndex: number,
  metadata?: Record<string, string | number | boolean>,
) => {
  await logEvent("lyric_selected", selectedIndex, {
    transaction_id: transactionId,
    ...metadata,
  })
}

export const logLyricsUpdated = async (transactionId: string, metadata?: Record<string, string | number | boolean>) => {
  await logEvent("lyrics_updated", undefined, {
    transaction_id: transactionId,
    ...metadata,
  })
}

// Log cuando el usuario hace clic en el botón de editar letra con IA
export const logEditLyricButtonClick = async (
  transactionId: string,
  metadata?: Record<string, string | number | boolean>,
) => {
  await logEvent("edit_lyric_button_click", undefined, {
    transaction_id: transactionId,
    ...metadata,
  })
}

export const logOrderSaved = async (
  transactionId: string,
  songType: string,
  hasLyrics: boolean,
  metadata?: Record<string, string | number | boolean>,
) => {
  await logEvent("order_saved", undefined, {
    transaction_id: transactionId,
    song_type: songType, // Ya incluye el precio del paquete elegido
    has_lyrics: hasLyrics,
    ...metadata,
  })
}

// ============================================
// FUNCIONES DE TRACKING DEL EMBUDO
// ============================================

// Log cuando el usuario inicia el formulario de creación de canción
export const logFunnelStart = async (
  metadata?: Record<string, string | number | boolean>,
) => {
  await logEvent("funnel_start", undefined, {
    funnel_name: "song_creation",
    ...metadata,
  })
}

// Log cuando el usuario completa un paso del formulario
export const logFunnelStepComplete = async (
  stepNumber: number,
  stepName: string,
  timeSpent?: number, // tiempo en segundos
  metadata?: Record<string, string | number | boolean>,
) => {
  await logEvent("funnel_step_complete", stepNumber, {
    funnel_name: "song_creation",
    step_number: stepNumber.toString(),
    step_name: stepName,
    time_spent_seconds: timeSpent?.toString() || "0",
    ...metadata,
  })
}

// Log cuando el usuario abandona el formulario (sin completarlo)
export const logFunnelAbandonment = async (
  lastStep: number,
  lastStepName: string,
  totalTimeSpent?: number, // tiempo total en segundos
  metadata?: Record<string, string | number | boolean>,
) => {
  await logEvent("funnel_abandonment", lastStep, {
    funnel_name: "song_creation",
    last_step: lastStep.toString(),
    last_step_name: lastStepName,
    total_time_spent_seconds: totalTimeSpent?.toString() || "0",
    ...metadata,
  })
}

// Log cuando el usuario completa todo el formulario
export const logFunnelComplete = async (
  totalSteps: number,
  totalTimeSpent?: number, // tiempo total en segundos
  metadata?: Record<string, string | number | boolean>,
) => {
  await logEvent("funnel_complete", totalSteps, {
    funnel_name: "song_creation",
    total_steps: totalSteps.toString(),
    total_time_spent_seconds: totalTimeSpent?.toString() || "0",
    ...metadata,
  })
}

// Log eventos específicos de la página de confirmación
export const logConfirmationStep = async (
  stepName: "lyrics_generation" | "lyric_selection" | "lyric_editing" | "whatsapp_sent",
  metadata?: Record<string, string | number | boolean>,
) => {
  await logEvent("confirmation_step", undefined, {
    step_name: stepName,
    ...metadata,
  })
}

// ============================================
// COPYWRITING EXPERIMENT TRACKING
// ============================================

export const COPYWRITING_EXPERIMENT_NAME = "hero_copywriting_test"

// Log CTA click event para el experimento de copywriting
export const logCopywritingCTAClick = async (
  ctaLocation: "hero" | "mobile_sticky" | "other",
  variant: string,
  metadata?: Record<string, string | number | boolean>,
) => {
  await logEvent("cta_click", ctaLocation, {
    experiment: COPYWRITING_EXPERIMENT_NAME,
    variant,
    cta_location: ctaLocation,
    ...metadata,
  })
}

// Log hero section view para el experimento de copywriting
export const logCopywritingHeroView = async (
  variant: string,
  metadata?: Record<string, string | number | boolean>,
) => {
  await logEvent("hero_view", undefined, {
    experiment: COPYWRITING_EXPERIMENT_NAME,
    variant,
    ...metadata,
  })
}

// Cleanup Statsig when needed
export const shutdownStatsig = () => {
  if (statsigClient) {
    statsigClient.shutdown()
    statsigClient = null
  }
}

