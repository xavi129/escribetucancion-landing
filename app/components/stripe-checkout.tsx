"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface StripeCheckoutProps {
  songType: string
  deliveryType: string
  customerName: string
  email: string
  formData: any
  onCheckout: () => void
}

export default function StripeCheckout({
  songType,
  deliveryType,
  customerName,
  email,
  formData,
  onCheckout,
}: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calcular el precio basado en el tipo de canción y entrega
  const calculatePrice = () => {
    // Adelanto fijo de 90 MXN
    return 90
  }

  const handleCheckout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Generar un ID de referencia único
      const referenceId = `MLD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

      // Guardar los datos del formulario en localStorage
      localStorage.setItem("formData", JSON.stringify(formData))

      // Notificar al componente padre que se está iniciando el checkout
      onCheckout()

      // Crear la sesión de checkout
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: calculatePrice(),
          songType,
          deliveryType,
          customerName,
          email,
          referenceId,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setIsLoading(false)
        return
      }

      // Redirigir al checkout de Stripe
      if (data.url) {
        window.location.href = data.url
      } else {
        setError("No se pudo crear la sesión de pago")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error)
      setError("Ocurrió un error al procesar el pago. Por favor, inténtalo de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-lg font-medium">Total a pagar: ${calculatePrice()} MXN</p>
        <p className="text-sm text-gray-500">Adelanto para iniciar tu canción personalizada</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">{error}</div>}

      <Button onClick={handleCheckout} disabled={isLoading} className="w-full bg-green-700 hover:bg-green-800">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...
          </>
        ) : (
          "Pagar con Stripe"
        )}
      </Button>

      <div className="text-center text-xs text-gray-500">
        <p>Pago seguro procesado por Stripe</p>
        <p>Aceptamos todas las tarjetas principales</p>
      </div>
    </div>
  )
}

