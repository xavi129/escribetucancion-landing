"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { MessageCircle, Music, Star, Clock, CreditCard, Check, ShieldCheck, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Añade esta importación
import { logPriceView } from "@/app/utils/statsig"

// Import the price experiment hook at the top of the file
import { usePriceExperiment } from "@/app/hooks/use-price-experiment"

// Importar el nuevo componente PriceDisplay:
import PriceDisplay from "./price-display"

export default function WhatsappForm() {
  const [message, setMessage] = useState("")
  const [showPricing, setShowPricing] = useState(false)
  const [name, setName] = useState("")
  const [countdown, setCountdown] = useState({ hours: 1, minutes: 29, seconds: 42 })
  const phoneNumber = "000000000000"

  // Add the hook inside the component, near the top after other hooks
  const prices = usePriceExperiment()

  // Añade este efecto después de obtener los precios
  useEffect(() => {
    // Log price views
    const logPrices = async () => {
      // Solo registrar los precios cuando no están cargando
      if (!prices.isLoading) {
        await logPriceView("lite", prices.lite_plan_price)
        await logPriceView("standard", prices.standard_plan_price)
        await logPriceView("premium", prices.premium_plan_price)
      }
    }

    if (showPricing) {
      logPrices()
    }
  }, [showPricing, prices.lite_plan_price, prices.standard_plan_price, prices.premium_plan_price, prices.isLoading])

  // Contador regresivo
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        // Reiniciar cuando llegue a cero
        return { hours: 1, minutes: 29, seconds: 59 }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Hacer que el campo de mensaje sea obligatorio
    if (!message.trim()) {
      alert("Por favor, escribe un mensaje antes de continuar")
      return
    }

    // Format and encode the message for WhatsApp
    const namePrefix = name ? `Hola, mi nombre es ${name}. ` : "Hola, "
    const fullMessage = `${namePrefix}${message}`
    const encodedMessage = encodeURIComponent(fullMessage)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    // Track WhatsApp click event
    import("@/app/utils/analytics").then(({ trackWhatsappClick }) => {
      trackWhatsappClick()
    })

    // Log event to Statsig
    import("@/app/utils/statsig").then(({ logEvent }) => {
      logEvent("whatsapp_contact", undefined, {
        from_homepage: true,
        has_name: !!name.trim(),
        message_length: message.length,
      })
    })

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Card className="shadow-lg border-green-100 max-w-md mx-auto bg-white">
      <CardHeader className="bg-gradient-to-br from-green-600 via-emerald-600 to-emerald-800 text-white rounded-t-lg pb-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl"></div>
        <div className="flex justify-between items-center mb-3 relative z-10">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-extrabold animate-pulse shadow-lg text-sm px-3 py-1">
            ⚡ ¡-60% DESCUENTO!
          </Badge>
          <div className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs flex items-center font-bold shadow-xl">
            <Clock className="h-4 w-4 mr-1 animate-spin" />
            <span>
              {String(countdown.hours).padStart(2, "0")}:{String(countdown.minutes).padStart(2, "0")}:
              {String(countdown.seconds).padStart(2, "0")}
            </span>
          </div>
        </div>
        <CardTitle className="flex items-center justify-center text-2xl font-extrabold relative z-10">
          <Music className="mr-2 h-7 w-7" />
          Crea Tu Canción Personalizada
        </CardTitle>
        <CardDescription className="text-white text-center mt-2 font-medium relative z-10">
          🎁 Un regalo único que nunca olvidarán
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {!showPricing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200 mb-4 shadow-md">
              <h3 className="font-bold text-emerald-900 mb-3 flex items-center text-base">
                <Star className="h-5 w-5 mr-2 text-yellow-500 fill-yellow-500" /> ¿Por qué más de 500 clientes nos eligen?
              </h3>
              <ul className="text-sm text-gray-800 space-y-2">
                <li className="flex items-start font-medium">
                  <span className="text-green-600 mr-2 text-lg">✓</span> 🎵 Compositores profesionales
                </li>
                <li className="flex items-start font-medium">
                  <span className="text-green-600 mr-2 text-lg">✓</span> ✍️ Letra 100% personalizada
                </li>
                <li className="flex items-start font-medium">
                  <span className="text-green-600 mr-2 text-lg">✓</span> ⏱️ Entrega rápida garantizada
                </li>
                <li className="flex items-start font-bold text-emerald-900">
                  <span className="text-green-600 mr-2 text-lg">✓</span> 🔒 100% Garantía de satisfacción
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-gray-700 mb-2 font-medium">Tu nombre</p>
                <Input
                  placeholder="Escribe tu nombre..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-green-200 focus:border-green-500"
                />
              </div>

              <div>
                <p className="text-gray-700 mb-2 font-medium">¿Qué quieres expresar en tu canción?</p>
                <Input
                  placeholder="Ej: Una canción de amor para mi pareja por nuestro aniversario..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border-green-200 focus:border-green-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <PriceDisplay
                    planType="lite"
                    showOriginalPrice={false}
                    size="sm"
                    prefixText="Desde"
                    showPrefix={true}
                  />
                  <span className="text-xs text-gray-500">¡Oferta por tiempo limitado!</span>
                </div>
              </div>
              <Button
                type="button"
                variant="link"
                className="text-emerald-600 p-0 h-auto font-bold"
                onClick={() => setShowPricing(true)}
              >
                Ver planes
              </Button>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border-2 border-yellow-300 shadow-md">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 text-emerald-600 mr-2" />
                <span className="text-sm font-bold text-emerald-900">🔥 17 personas viendo esto ahora</span>
              </div>
              <div className="bg-white/80 p-3 rounded-lg">
                <div className="flex mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <div className="text-xs text-gray-700 italic font-medium">
                  💕 "La canción que crearon para mi aniversario hizo llorar a mi esposa de emoción. ¡Gracias!" 
                  <span className="text-emerald-700 font-bold"> - Miguel R.</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                className="bg-gradient-to-r from-green-600 via-emerald-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold"
                onClick={() => (window.location.href = "/crear-cancion")}
              >
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs px-2 py-1 rounded-bl-xl font-bold animate-pulse shadow-lg">
                  -60%
                </span>
                <Music className="mr-2 h-4 w-4" />
                Personalizar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 animate-pulse shadow-xl font-bold">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-emerald-800">Nuestros Planes</h3>
              <div className="bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  {String(countdown.hours).padStart(2, "0")}:{String(countdown.minutes).padStart(2, "0")}:
                  {String(countdown.seconds).padStart(2, "0")}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="border border-green-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-emerald-700">Plan Lite</h4>
                  <div className="flex flex-col items-end">
                    <PriceDisplay planType="lite" size="sm" className="flex-row-reverse" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Canción personalizada básica con letra adaptada.</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" /> Entrega en 5-7 días
                </div>
              </div>

              <div className="border-2 border-emerald-500 rounded-lg p-3 relative bg-emerald-50 shadow-md">
                <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-black">POPULAR</Badge>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-emerald-700">Plan Estándar</h4>
                  <div className="flex flex-col items-end">
                    <PriceDisplay planType="standard" size="sm" className="flex-row-reverse" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Canción completamente personalizada con música original.</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" /> Entrega en 3-5 días
                </div>
                <div className="mt-2 text-xs text-green-600 font-medium flex items-center">
                  <Check className="h-3 w-3 mr-1" /> Más de 200 clientes satisfechos
                </div>
              </div>

              <div className="border border-green-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-emerald-700">Plan Premium</h4>
                  <div className="flex flex-col items-end">
                    <PriceDisplay planType="premium" size="sm" className="flex-row-reverse" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Canción premium con arreglos profesionales y calidad de estudio.
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" /> Entrega en 3-5 días
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
              <div className="flex items-center mb-1">
                <ShieldCheck className="h-4 w-4 text-green-600 mr-2" />
                <span className="font-medium text-green-800">100% Garantía de Satisfacción</span>
              </div>
              <p className="text-xs text-gray-600">
                Si no estás completamente satisfecho, te haremos revisiones sin costo adicional hasta que ames tu
                canción.
              </p>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                className="border-emerald-300 text-emerald-700"
                onClick={() => setShowPricing(false)}
              >
                Volver
              </Button>
              <Button
                type="button"
                className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 animate-pulse"
                onClick={() => (window.location.href = "/crear-cancion")}
              >
                Elegir plan
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-3 text-xs text-center text-gray-500 rounded-b-lg">
        <div className="w-full flex items-center justify-center">
          <ShieldCheck className="h-3 w-3 text-green-600 mr-1" />
          <span>Pago 100% seguro</span>
          <span className="mx-2">•</span>
          <Users className="h-3 w-3 text-emerald-600 mr-1" />
          <span>+500 clientes satisfechos</span>
        </div>
      </CardFooter>
    </Card>
  )
}

