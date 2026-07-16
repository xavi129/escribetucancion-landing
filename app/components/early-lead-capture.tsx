"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { AlertCircle, Check, ArrowRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

interface EarlyLeadCaptureProps {
  onCapture: (data: { name: string; email: string; whatsapp: string }) => void
  onSkip: () => void
  className?: string
}

export default function EarlyLeadCapture({ onCapture, onSkip, className }: EarlyLeadCaptureProps) {
  const [name, setName] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [errors, setErrors] = useState<{ whatsapp?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Validación de WhatsApp
  const isValidWhatsApp = (whatsapp: string): boolean => {
    // Validar que sea un número válido con código de país
    const cleanNumber = whatsapp.replace(/\s/g, "")
    // Debe empezar con + y tener entre 10 y 15 dígitos
    const whatsappRegex = /^\+[1-9]\d{9,14}$/
    return whatsappRegex.test(cleanNumber)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Reiniciar errores
    const newErrors: { whatsapp?: string } = {}

    // Validar WhatsApp si se proporciona
    if (whatsapp && !isValidWhatsApp(whatsapp)) {
      newErrors.whatsapp = "Por favor, ingresa un número de WhatsApp válido"
    }

    // Si hay errores, mostrarlos y no continuar
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Si no hay WhatsApp, mostrar error
    if (!whatsapp) {
      setErrors({
        whatsapp: "Por favor, proporciona tu número de WhatsApp"
      })
      return
    }

    // Proceder con la captura del lead
    setIsSubmitting(true)

    // DESACTIVADO: Registro de early lead desactivado para mejorar conversión
    // Registrar el lead en Statsig
    // import("@/app/utils/statsig").then(({ logEvent }) => {
    //   logEvent("early_lead_captured", undefined, {
    //     has_name: !!name.trim(),
    //     has_email: false,
    //     has_whatsapp: !!whatsapp.trim(),
    //   })
    // })

    // Mostrar mensaje de éxito brevemente
    setShowSuccess(true)

    // Llamar al callback con los datos (email vacío para compatibilidad)
    setTimeout(() => {
      onCapture({ name, email: "", whatsapp })
      setIsSubmitting(false)
      setShowSuccess(false)
    }, 1500)
  }

  return (
    <Card className={`shadow-2xl border-white/10 bg-slate-900/50 backdrop-blur-xl ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-center text-purple-400">
          Ya llevas la mitad 🎉
        </CardTitle>
        <CardDescription className="text-center text-slate-400">
          ¿Te gustaría recibir un descuento? Comparte tu WhatsApp
        </CardDescription>
      </CardHeader>

      <CardContent>
        {showSuccess ? (
          <Alert className="bg-purple-900/20 border-purple-500/20 text-purple-400">
            <Check className="h-4 w-4" />
            <AlertDescription>
              ¡Gracias! Hemos guardado tu información. Continúa con tu canción personalizada.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Tu nombre (opcional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/50 rounded-xl"
              />
            </div>

            <div>
              <div className={`phone-input-custom dark-theme ${errors.whatsapp ? 'phone-input-error' : ''}`}>
                <PhoneInput
                  international
                  defaultCountry="MX"
                  placeholder="Tu WhatsApp"
                  value={whatsapp}
                  onChange={(value) => {
                    setWhatsapp(value || "")
                    if (errors.whatsapp) setErrors({ ...errors, whatsapp: undefined })
                  }}
                  className="bg-white/5 border border-white/10 rounded-xl text-white [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:text-white [&_.PhoneInputInput]:placeholder-slate-500 [&_.PhoneInputCountrySelect]:bg-slate-800 [&_.PhoneInputCountrySelect]:text-white"
                />
              </div>
              {errors.whatsapp && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> {errors.whatsapp}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-0 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:scale-[1.02]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : (
                  <>
                    Guardar y continuar <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full mt-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
                onClick={onSkip}
                disabled={isSubmitting}
              >
                Continuar sin guardar
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}