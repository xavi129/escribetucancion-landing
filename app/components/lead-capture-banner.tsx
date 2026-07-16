"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Check, ArrowRight, Mail, Gift, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import UrgencyCountdown from "./urgency-countdown"

interface LeadCaptureBannerProps {
  className?: string
  onCapture?: (data: { email: string; whatsapp?: string }) => void
  discountAmount?: string
}

export default function LeadCaptureBanner({ 
  className, 
  onCapture,
  discountAmount = "15%"
}: LeadCaptureBannerProps) {
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [errors, setErrors] = useState<{ email?: string; whatsapp?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Validación de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reiniciar errores
    const newErrors: { email?: string; whatsapp?: string } = {}
    
    // Validar email
    if (!email || !isValidEmail(email)) {
      newErrors.email = "Por favor, ingresa un correo electrónico válido"
    }
    
    // Si hay errores, mostrarlos y no continuar
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Proceder con la captura del lead
    setIsSubmitting(true)
    
    // Registrar el lead en Statsig
    import("@/app/utils/statsig").then(({ logEvent }) => {
      logEvent("lead_captured_from_banner", undefined, {
        has_email: !!email.trim(),
        has_whatsapp: !!whatsapp.trim(),
      })
    })
    
    // Mostrar mensaje de éxito brevemente
    setShowSuccess(true)
    
    // Llamar al callback con los datos si existe
    if (onCapture) {
      setTimeout(() => {
        onCapture({ email, whatsapp })
        setIsSubmitting(false)
        // Mantener el mensaje de éxito visible
      }, 1000)
    } else {
      // Si no hay callback, simplemente resetear el estado después de un tiempo
      setTimeout(() => {
        setIsSubmitting(false)
      }, 1000)
    }
  }

  return (
    <Card className={`shadow-md border-purple-100 overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold flex items-center">
                <Gift className="h-5 w-5 mr-2" />
                ¡Obtén {discountAmount} de descuento!
              </h3>
              <p className="text-sm opacity-90 mt-1">
                Regístrate ahora y recibe un código de descuento exclusivo para tu canción personalizada
              </p>
            </div>
            <div className="hidden md:block">
              <UrgencyCountdown 
                variant="compact" 
                showLabel={false}
                className="text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="md:hidden mb-3">
            <div className="flex items-center text-amber-600 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              <span className="font-medium">Oferta por tiempo limitado:</span>
            </div>
            <UrgencyCountdown 
              variant="compact" 
              showLabel={false}
              className="text-sm"
            />
          </div>
          
          {showSuccess ? (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription>
                ¡Gracias! Hemos enviado tu código de descuento a tu correo electrónico.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="email"
                    placeholder="Tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <span className="flex items-center justify-center">
                    Obtener mi descuento <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
              
              <p className="text-xs text-center text-gray-500">
                No compartimos tu información. Consulta nuestra política de privacidad.
              </p>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  )
}