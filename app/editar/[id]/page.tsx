"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Check, Eye, EyeOff, Loader2, Music, Sparkles, Undo2 } from "lucide-react"
import {
  fetchOrderById,
  incrementLyricRevisionCount,
  updateOrderExtraEditions,
  updateSongLyrics,
} from "@/app/utils/supabase"
import { CURRENCY_CONFIGS, type CurrencyCode } from "@/lib/currency-config"
import { formatPrice } from "@/lib/format-price"

const AI_REGENERATION_LIMITS: Record<string, number> = {
  lite: 2,
  estandar: 4,
  premium: 6,
}

const EXTRA_EDITIONS_PER_ADDON = 3

type OrderRecord = {
  id: string
  song_type?: string | null
  generated_lyric?: string | null
  lyric_revision_count?: number | null
  extra_editions?: number | null
  currency?: CurrencyCode | null
  occasion?: string | null
  include_name?: boolean | null
  person_name?: string | null
  relationship?: string | null
  genre?: string | null
  styles?: string[] | null
}

type DiffPart = {
  type: "added" | "removed" | "unchanged"
  value: string
}

const getSongTypeKey = (songType?: string | null) => {
  if (!songType) return "lite"
  const base = songType.split(" - ")[0]?.trim().toLowerCase() || "lite"
  const normalized = base.normalize("NFD").replace(/\p{Diacritic}/gu, "")
  if (normalized.includes("estandar")) return "estandar"
  if (base.includes("premium")) return "premium"
  return "lite"
}

const computeDiff = (oldText: string, newText: string): DiffPart[] => {
  const splitIntoTokens = (text: string) => {
    const tokens: string[] = []
    let current = ""
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      if (char === " " || char === "\n" || char === "\r") {
        if (current) {
          tokens.push(current)
          current = ""
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

  const lcs = (a: string[], b: string[]) => {
    const m = a.length
    const n = b.length
    const dp: number[][] = Array(m + 1)
      .fill(0)
      .map(() => Array(n + 1).fill(0))

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
        }
      }
    }

    const result: DiffPart[] = []
    let i = m
    let j = n

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
        result.unshift({ type: "unchanged", value: a[i - 1] })
        i--
        j--
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        result.unshift({ type: "added", value: b[j - 1] })
        j--
      } else if (i > 0) {
        result.unshift({ type: "removed", value: a[i - 1] })
        i--
      }
    }

    return result
  }

  return lcs(oldTokens, newTokens)
}

export default function EditarLetra() {
  const params = useParams<{ id: string }>()
  const orderId = params?.id

  const [order, setOrder] = useState<OrderRecord | null>(null)
  const [editedLyric, setEditedLyric] = useState("")
  const [previousLyric, setPreviousLyric] = useState("")
  const [showDiff, setShowDiff] = useState(false)
  const [showRevertDialog, setShowRevertDialog] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [editInstructions, setEditInstructions] = useState("")
  const [aiRegenerationCount, setAiRegenerationCount] = useState(0)
  const [showExtraEditionsDialog, setShowExtraEditionsDialog] = useState(false)
  const [isUpdatingExtraEditions, setIsUpdatingExtraEditions] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const orderFormData = useMemo(() => {
    if (!order) return null
    return {
      occasion: order.occasion || "",
      includeName: order.include_name ? "yes" : "no",
      personName: order.person_name || "",
      relationship: order.relationship || "",
      genre: order.genre || "",
      styles: order.styles || [],
    }
  }, [order])

  const regenerationLimit = useMemo(() => {
    const baseLimit = AI_REGENERATION_LIMITS[getSongTypeKey(order?.song_type)] || 1
    return baseLimit + (order?.extra_editions || 0)
  }, [order])

  const remainingRegenerations = Math.max(0, regenerationLimit - aiRegenerationCount)
  const hasReachedLimit = aiRegenerationCount >= regenerationLimit

  const currencyCode = (order?.currency || "USD") as CurrencyCode
  const extraEditionsPrice =
    CURRENCY_CONFIGS[currencyCode]?.prices.extra_editions || CURRENCY_CONFIGS.USD.prices.extra_editions

  useEffect(() => {
    if (!orderId) return
    let isActive = true

    const loadOrder = async () => {
      setIsLoading(true)
      setErrorMessage(null)

      const result = await fetchOrderById(orderId)
      if (!isActive) return

      if (!result.success || !result.data) {
        setErrorMessage("No pudimos cargar la orden. Verifica el enlace e intenta de nuevo.")
        setIsLoading(false)
        return
      }

      setOrder(result.data)
      setEditedLyric(result.data.generated_lyric || "")
      setIsLoading(false)

      const storageKey = `aiRegenerationCount:${orderId}`
      const storedCount = localStorage.getItem(storageKey)
      const parsedCount = storedCount ? parseInt(storedCount, 10) : 0
      const initialCount = Math.max(parsedCount, Math.max(0, (result.data.lyric_revision_count || 0) - 1))
      setAiRegenerationCount(initialCount)
      localStorage.setItem(storageKey, initialCount.toString())

      if (parsedCount > Math.max(0, (result.data.lyric_revision_count || 0) - 1)) {
        try {
          const revisionResult = await incrementLyricRevisionCount(orderId)
          if (isActive && revisionResult.success && revisionResult.data) {
            const newCount = revisionResult.data.lyric_revision_count
            setOrder((prev) => (prev ? { ...prev, lyric_revision_count: newCount } : prev))
          }
        } catch (error) {
          console.error('Failed to sync revision count:', error)
        }
      }
    }

    loadOrder()

    return () => {
      isActive = false
    }
  }, [orderId])

  useEffect(() => {
    if (!orderId) return
    const storageKey = `aiRegenerationCount:${orderId}`
    localStorage.setItem(storageKey, aiRegenerationCount.toString())
  }, [aiRegenerationCount, orderId])

  const renderDiff = () => {
    if (!previousLyric || !editedLyric) return null

    const diffParts = computeDiff(previousLyric, editedLyric)

    return (
      <div
        className="min-h-[300px] sm:min-h-[350px] p-3 sm:p-4 rounded-lg border border-white/20 bg-slate-900/80 text-white text-sm sm:text-base leading-relaxed font-sans overflow-y-auto cursor-text hover:border-purple-500/50 transition-colors"
        style={{ whiteSpace: "pre-wrap", fontSize: "16px", lineHeight: "1.7" }}
        onClick={() => setShowDiff(false)}
        title="Haz clic para editar"
      >
        {diffParts.map((part, index) => {
          if (part.type === "added") {
            return (
              <span
                key={index}
                className="bg-green-500/30 text-green-100 border-b-2 border-green-500 rounded px-0.5"
                title="Texto añadido"
              >
                {part.value}
              </span>
            )
          }
          if (part.type === "removed") {
            return null
          }
          return <span key={index}>{part.value}</span>
        })}
      </div>
    )
  }

  const handleRegenerateWithInstructions = async () => {
    if (!editInstructions.trim()) {
      alert("Por favor escribe las instrucciones de edicion")
      return
    }

    setIsRegenerating(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    const latestOrderResult = await fetchOrderById(orderId || "")
    if (!latestOrderResult.success || !latestOrderResult.data) {
      setErrorMessage("No pudimos validar las ediciones disponibles. Intenta de nuevo.")
      setIsRegenerating(false)
      return
    }

    const latestOrder = latestOrderResult.data
    const latestBaseLimit = AI_REGENERATION_LIMITS[getSongTypeKey(latestOrder.song_type)] || 1
    const latestLimit = latestBaseLimit + (latestOrder.extra_editions || 0)
    const latestUsedEdits = Math.max(0, (latestOrder.lyric_revision_count || 0) - 1)

    setOrder(latestOrder)
    setAiRegenerationCount((current) => Math.max(current, latestUsedEdits))

    if (latestUsedEdits >= latestLimit) {
      setErrorMessage("Has alcanzado el límite de ediciones disponibles. Compra ediciones extra para continuar.")
      setIsRegenerating(false)
      return
    }

    try {
      const response = await fetch("/api/generate-lyrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: orderFormData || {},
          currentLyric: editedLyric,
          editInstructions: editInstructions,
        }),
      })

      const responseData = await response.json()

      if (responseData.error) {
        console.error("Error al regenerar letra:", responseData.error)
        alert("Error al regenerar la letra. Por favor intenta de nuevo.")
        setIsRegenerating(false)
        return
      }

      if (!responseData.lyrics || responseData.lyrics.length === 0) {
        console.error("La API no devolvio ninguna letra")
        alert("Error: No se pudo generar la letra. Por favor intenta de nuevo.")
        setIsRegenerating(false)
        return
      }

      let newLyric = responseData.lyrics[0]
      if (!newLyric || !newLyric.trim()) {
        console.error("La API devolvio una letra vacia")
        alert("Error: La letra generada esta vacia. Por favor intenta de nuevo.")
        setIsRegenerating(false)
        return
      }

      if (newLyric.length > 2000) {
        newLyric = newLyric.substring(0, 2000)
      }

      const revisionResult = await incrementLyricRevisionCount(orderId || "")
      if (!revisionResult.success) {
        setErrorMessage("No pudimos registrar la edicion. Intenta de nuevo.")
        setIsRegenerating(false)
        return
      }

      setPreviousLyric(editedLyric)
      setEditedLyric(newLyric)
      setEditInstructions("")
      setShowDiff(true)
      const updatedCount = revisionResult.data?.lyric_revision_count || latestUsedEdits + 1
      setAiRegenerationCount(Math.max(0, updatedCount - 1))
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              lyric_revision_count: updatedCount,
            }
          : prev
      )
      setIsRegenerating(false)
    } catch (error) {
      console.error("Error al regenerar letra:", error)
      alert("Error al regenerar la letra. Por favor intenta de nuevo.")
      setIsRegenerating(false)
    }
  }

  const handleSaveLyrics = async () => {
    if (!orderId) return
    setIsSaving(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      // Confirmar NO debe gastar una edición extra (no incrementa lyric_revision_count)
      const result = await updateSongLyrics(orderId, editedLyric, "confirmed", { incrementRevisionCount: false })
      if (!result.success) {
        setErrorMessage("No pudimos guardar la letra. Intenta de nuevo.")
        setIsSaving(false)
        return
      }

      const updatedRevisionCount =
        result.data?.[0]?.lyric_revision_count ?? order?.lyric_revision_count ?? 0
      const newUsedEdits = Math.max(0, updatedRevisionCount - 1)
      
      setOrder((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          generated_lyric: editedLyric,
          lyric_revision_count: updatedRevisionCount,
        }
      })
      
      setAiRegenerationCount((current) => Math.max(current, newUsedEdits))
      setSuccessMessage("Letra confirmada correctamente.")
      setIsSaving(false)
    } catch (error) {
      console.error("Error saving lyrics:", error)
      setErrorMessage("No pudimos guardar la letra. Intenta de nuevo.")
      setIsSaving(false)
    }
  }

  const handlePurchaseExtraEditions = async () => {
    if (!orderId || !order) return

    const newExtraEditions = (order.extra_editions || 0) + EXTRA_EDITIONS_PER_ADDON
    setIsUpdatingExtraEditions(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const result = await updateOrderExtraEditions(orderId, newExtraEditions)
    if (!result.success) {
      setErrorMessage("No pudimos agregar ediciones extra. Intenta de nuevo.")
      setIsUpdatingExtraEditions(false)
      return
    }

    setOrder((prev) => (prev ? { ...prev, extra_editions: newExtraEditions } : prev))
    setSuccessMessage("Ediciones extra agregadas correctamente.")
    setIsUpdatingExtraEditions(false)
    setShowExtraEditionsDialog(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Cargando orden...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <Card className="max-w-md w-full shadow-2xl border-white/10 bg-slate-900/50 backdrop-blur-xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Editar letra</CardTitle>
            <CardDescription className="text-slate-400">
              Actualiza tu letra y guarda los cambios.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert className="bg-red-500/10 border-red-500/50 text-red-200">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="bg-green-500/10 border-green-500/50 text-green-200">
                <AlertTitle>Listo</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            {!order && !errorMessage && (
              <Alert className="bg-yellow-500/10 border-yellow-500/50 text-yellow-200">
                <AlertTitle>Sin datos</AlertTitle>
                <AlertDescription>No encontramos la orden solicitada.</AlertDescription>
              </Alert>
            )}

            {order && (
              <div className="space-y-4 -mx-4 sm:mx-0">
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 p-3 sm:p-4 rounded-lg shadow-sm backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 bg-purple-500/30 p-2 rounded-full border border-purple-500/50">
                      <Music className="h-5 w-5 text-purple-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-base sm:text-lg">Tu letra actual</h3>
                      <p className="text-xs sm:text-sm text-slate-400">
                        Usa IA o edita manualmente.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="lyric-editor" className="text-sm font-semibold text-white">
                      Letra:
                    </Label>
                    <div className="flex items-center gap-2">
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
                            className="text-xs px-2 py-1 h-auto bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200"
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
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          editedLyric.length > 2000
                            ? "bg-red-500/20 text-red-400 border border-red-500/50"
                            : editedLyric.length > 1800
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                            : "bg-white/10 text-slate-400 border border-white/10"
                        }`}
                      >
                        {editedLyric.length}/2000
                      </div>
                    </div>
                  </div>

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
                      renderDiff()
                    ) : (
                      <Textarea
                        id="lyric-editor"
                        value={editedLyric}
                        onChange={(event) => {
                          const newValue = event.target.value
                          if (newValue.length <= 2000) {
                            setEditedLyric(newValue)
                          }
                        }}
                        maxLength={2000}
                        className={`min-h-[300px] sm:min-h-[350px] text-sm sm:text-base leading-relaxed font-sans resize-y
                                 border rounded-lg p-3 sm:p-4 transition-all
                                 bg-slate-900/80 text-white placeholder:text-slate-500
                                 ${
                                   editedLyric.length > 2000
                                     ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                                     : "border-white/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
                                 }`}
                        placeholder="La letra de tu cancion aparecera aqui..."
                        style={{ fontSize: "16px", lineHeight: "1.7" }}
                      />
                    )}
                  </div>
                </div>

                <div className={`relative group transition-all duration-300 ${hasReachedLimit ? "opacity-75" : ""}`}>
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 ${
                      hasReachedLimit ? "hidden" : ""
                    }`}
                  ></div>

                  <div
                    className={`relative bg-slate-900/90 backdrop-blur-xl border rounded-xl p-4 sm:p-5 space-y-4 ${
                      hasReachedLimit ? "border-slate-600/50" : "border-white/10 shadow-2xl"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-pink-500/20 rounded-lg">
                          <Sparkles className="h-4 w-4 text-pink-400" />
                        </div>
                        <span className="text-sm font-bold text-white tracking-tight">Mejorar con IA</span>
                      </div>
                      <div
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          hasReachedLimit
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : remainingRegenerations === 1
                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            : "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                        }`}
                      >
                        {hasReachedLimit
                          ? "Sin creditos"
                          : `${remainingRegenerations} ${remainingRegenerations === 1 ? "edicion" : "ediciones"} de regalo`}
                      </div>
                    </div>

                    {hasReachedLimit ? (
                      <div className="space-y-4">
                        <div className="bg-slate-800/50 border border-white/5 rounded-lg p-3 text-center">
                          <p className="text-sm text-slate-300">
                            Has usado todas tus ediciones con IA.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowExtraEditionsDialog(true)}
                          className="w-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 rounded-xl p-4 text-left hover:from-pink-600/30 hover:to-purple-600/30 transition-all group/btn"
                        >
                          <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-2.5 rounded-lg flex-shrink-0 shadow-lg group-hover/btn:scale-110 transition-transform">
                              <Check className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-white">+{EXTRA_EDITIONS_PER_ADDON} ediciones extra</span>
                                <span className="text-sm font-black text-pink-400">
                                  {formatPrice(extraEditionsPrice, currencyCode)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1">
                                Agrega mas creditos para seguir editando.
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Describe lo que quieres cambiar y nuestra IA reescribira la letra.
                        </p>
                        <div className="relative group/input">
                          <Textarea
                            id="edit-instructions"
                            value={editInstructions}
                            onChange={(event) => setEditInstructions(event.target.value)}
                            disabled={isRegenerating}
                            className="min-h-[100px] text-sm leading-relaxed font-medium resize-none
                                     border-2 rounded-xl p-4 transition-all duration-300
                                     bg-slate-800/50 text-white placeholder:text-slate-500
                                     border-white/5 focus:border-pink-500/50 focus:bg-slate-800/80
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     shadow-inner"
                            placeholder='Ej: "Haz el coro mas romantico y menciona su sonrisa..."'
                            style={{ fontSize: "16px" }}
                          />
                        </div>
                        <Button
                          onClick={handleRegenerateWithInstructions}
                          disabled={isRegenerating || !editInstructions.trim() || hasReachedLimit}
                          className={`w-full h-12 text-sm font-bold rounded-xl transition-all duration-300 shadow-xl
                                  ${
                                    !editInstructions.trim()
                                      ? "bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed"
                                      : "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-500 hover:to-purple-500 shadow-pink-500/20"
                                  }`}
                        >
                          {isRegenerating ? (
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

                <div className="pt-2 sticky bottom-0 bg-slate-950/95 backdrop-blur-md pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                  <Button
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={!editedLyric.trim()}
                    className="w-full h-12 text-base
                           bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
                           text-white font-bold shadow-lg hover:shadow-xl transition-all
                           active:scale-[0.98] disabled:opacity-60"
                  >
                    <Check className="mr-2 h-5 w-5" />
                    Confirmar letra
                  </Button>
                  <p className="text-center text-xs text-slate-500 mt-2">
                    Orden: {order.id}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showRevertDialog} onOpenChange={setShowRevertDialog}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              ¿Revertir a la letra anterior?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              La letra generada por IA se perdera y no podras recuperarla.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setEditedLyric(previousLyric)
                setPreviousLyric("")
                setShowDiff(false)
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Si, revertir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-slate-900 border-slate-700 max-w-lg">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div>
                <AlertDialogTitle className="text-white text-xl">
                  Confirmar letra final
                </AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription className="text-slate-300 space-y-4 pt-2">
              <p className="text-base leading-relaxed">
                Estas a punto de confirmar esta letra como version final. Una vez confirmada, la orden cambiara a estado <strong className="text-purple-400">"confirmado"</strong> y estara lista para produccion.
              </p>
              
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Orden:</span>
                  <span className="font-mono text-slate-300">{order?.id.substring(0, 8)}...</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Tipo de cancion:</span>
                  <span className="text-purple-300 font-medium capitalize">{getSongTypeKey(order?.song_type)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Ediciones usadas:</span>
                  <span className="text-pink-300 font-medium">{aiRegenerationCount} / {regenerationLimit}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Longitud letra:</span>
                  <span className="text-slate-300">{editedLyric.length} caracteres</span>
                </div>
              </div>

              <p className="text-sm text-slate-400">
                Podras seguir editando despues si necesitas hacer cambios.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirmDialog(false)
                handleSaveLyrics()
              }}
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-purple-500 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirmando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Si, confirmar letra
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showExtraEditionsDialog} onOpenChange={setShowExtraEditionsDialog}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Agregar ediciones extra
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Estas a punto de agregar <strong className="text-pink-400">+{EXTRA_EDITIONS_PER_ADDON} ediciones extra</strong> por{" "}
              <strong className="text-pink-400">{formatPrice(extraEditionsPrice, currencyCode)}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePurchaseExtraEditions}
              disabled={isUpdatingExtraEditions}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white"
            >
              {isUpdatingExtraEditions ? "Agregando..." : "Si, agregar ediciones"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
