"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Clock, ShieldCheck, AlertTriangle, Store, ArrowRight, Loader2 } from "lucide-react"
import UrgencyCountdown from "./urgency-countdown"
import { cn } from "@/lib/utils"

interface OxxoPaymentGuideProps {
  className?: string
  orderId?: string
  amount: number
  referenceNumber?: string
  onConfirmation?: (data: { oxxoReference: string; paymentDate: string; comments: string }) => void
}

export default function OxxoPaymentGuide({
  className,
  orderId = "ORD-"+Math.floor(Math.random() * 10000),
  amount,
  referenceNumber = "OXXO-"+Math.floor(Math.random() * 1000000),
  onConfirmation
}: OxxoPaymentGuideProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reservationTime, setReservationTime] = useState<number | null>(null)
  
  // Establecer tiempo de reserva al cargar el componente
  useEffect(() => {
    // Reservar por 24 horas (en milisegundos)
    const reservationPeriod = 24 * 60 * 60 * 1000
    const expiryTime = Date.now() + reservationPeriod
    setReservationTime(expiryTime)
    
    // Guardar en localStorage
    localStorage.setItem(`reservation_${orderId}`, expiryTime.toString())
  }, [orderId])
  
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Registrar evento de copia
      import("@/app/utils/statsig").then(({ logEvent }) => {
        logEvent("payment_info_copied", undefined, {
          field_copied: field
        })
      })
    })
  }
  
  const handleConfirm = () => {
    setIsSubmitting(true)
    
    // Registrar evento
    import("@/app/utils/statsig").then(({ logEvent }) => {
      logEvent("oxxo_confirmation_submitted", undefined, {
        simplified_flow: true
      })
    })
    
    // Simular procesamiento
    setTimeout(() => {
      setIsSubmitting(false)
      
      if (onConfirmation) {
        onConfirmation({
          oxxoReference: referenceNumber,
          paymentDate: new Date().toISOString().split('T')[0],
          comments: "Pago en OXXO confirmado mediante flujo simplificado"
        })
      }
    }, 1000)
  }
  
  return (
    <Card className={cn("shadow-md border-green-100 w-full max-w-full overflow-visible", className)}>
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <CardTitle className="text-lg md:text-xl flex items-center">
            <Store className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Pago en OXXO
          </CardTitle>
          
          {reservationTime && (
            <Badge className="bg-yellow-500 text-black font-medium text-xs md:text-sm">
              <Clock className="h-3 w-3 mr-1" />
              Reservado por 24h
            </Badge>
          )}
        </div>
        <CardDescription className="text-emerald-100 text-sm md:text-base">
          Tu pedido #{orderId} está reservado. Completa tu pago para comenzar a crear tu canción.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto">
        {/* Contador de urgencia */}
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
          <AlertDescription className="text-yellow-800 flex flex-wrap items-center justify-between text-sm gap-2">
            <span>Tu reserva expirará en:</span>
            {reservationTime && (
              <UrgencyCountdown 
                variant="inline" 
                showLabel={false}
                initialHours={24}
                initialMinutes={0}
                initialSeconds={0}
                className="font-bold text-yellow-800"
              />
            )}
          </AlertDescription>
        </Alert>
        
        {/* Información de pago simplificada */}
        <div className="space-y-4">
          <div className="bg-green-50 p-4 md:p-5 rounded-lg border border-green-100 text-center">
            <h3 className="font-bold text-lg md:text-xl text-emerald-800 mb-2 md:mb-3">Confirmación de Pago OXXO</h3>
            
            <div className="bg-white p-3 rounded-md border border-gray-200 mb-3 md:mb-4">
              <p className="text-sm text-gray-700 mb-1">Solo pagarás un adelanto de:</p>
              <p className="font-bold text-xl md:text-2xl text-emerald-800">$90 MXN</p>
            </div>
            
            <div className="bg-white p-3 rounded-md border border-gray-200 mb-3 md:mb-4">
              <p className="text-sm text-gray-500 mb-1">Número de referencia:</p>
              <div className="flex items-center justify-center flex-wrap gap-2">
                <p className="font-medium font-mono text-base md:text-lg break-all">{referenceNumber}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 h-8 w-8 p-0 flex-shrink-0"
                  onClick={() => handleCopy(referenceNumber, "reference")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Alert className="bg-green-50 border-green-200 mb-3 md:mb-4">
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
              <AlertDescription className="text-green-800 text-sm">
                Al hacer clic en "Confirmar" te enviaremos a WhatsApp para finalizar tu pedido.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={handleConfirm} 
              className="w-full bg-green-600 hover:bg-green-700 mb-2 py-3 text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Procesando...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Confirmar y continuar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-t">
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex items-center text-sm text-gray-600">
            <ShieldCheck className="h-4 w-4 mr-1 text-green-600 flex-shrink-0" />
            Pago 100% seguro
          </div>
          <Button 
            variant="link" 
            className="text-emerald-600 p-0 h-auto text-sm"
            onClick={() => window.location.href = "https://wa.me/000000000000"}
          >
            ¿Necesitas ayuda? <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
