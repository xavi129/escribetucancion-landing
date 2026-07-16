"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { MessageCircle, Copy, Check, ArrowRight, AlertCircle, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { trackWhatsappClick } from "@/app/utils/analytics"
import { logEvent } from "@/app/utils/statsig"

interface EnhancedWhatsappTransferProps {
  whatsappLink: string
  referenceNumber: string
  formData: any
  className?: string
}

export default function EnhancedWhatsappTransfer({
  whatsappLink,
  referenceNumber,
  formData,
  className,
}: EnhancedWhatsappTransferProps) {
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState(15)
  const [showAlert, setShowAlert] = useState(false)
  const [whatsappClicked, setWhatsappClicked] = useState(false)

  // Cuenta regresiva para mostrar alerta si no se ha hecho clic en WhatsApp
  useEffect(() => {
    if (countdown > 0 && !whatsappClicked) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && !whatsappClicked) {
      setShowAlert(true)
      // Eliminamos la apertura automática de WhatsApp para evitar ciclos infinitos
    }
  }, [countdown, whatsappClicked])

  const handleWhatsappClick = () => {
    // Registrar el clic en WhatsApp
    trackWhatsappClick()
    
    // Registrar evento en Statsig
    logEvent("whatsapp_transfer_click", undefined, {
      reference_number: referenceNumber,
      song_type: formData?.songType || "unknown",
    })
    
    // Marcar como enviado en localStorage
    localStorage.setItem("whatsappSent", "true")
    
    // Actualizar estado
    setWhatsappClicked(true)
    setShowAlert(false)
    
    // Crear un mensaje básico con la referencia (para usar como respaldo)
    const basicMessage = encodeURIComponent(`Hola, quiero completar mi pedido de canción personalizada. `)
    const defaultPhone = "000000000000"
    
    // Preparar el enlace de WhatsApp
    let phoneNumber = defaultPhone
    let messageText = basicMessage
    
    // Extraer número de teléfono del enlace proporcionado si es válido
    if (whatsappLink && typeof whatsappLink === 'string' && whatsappLink.startsWith("https://wa.me/")) {
      try {
        // Extraer el número de teléfono del enlace
        const urlParts = whatsappLink.split('https://wa.me/')
        if (urlParts.length > 1) {
          const phoneAndParams = urlParts[1].split('?')
          if (phoneAndParams[0]) {
            phoneNumber = phoneAndParams[0]
            
            // Si hay parámetros en el enlace original, extraer el mensaje
            if (phoneAndParams.length > 1 && phoneAndParams[1].startsWith('text=')) {
              const originalMessage = decodeURIComponent(phoneAndParams[1].substring(5))
              if (originalMessage) {
                messageText = originalMessage + " " + basicMessage
              }
            }
          }
        }
      } catch (e) {
        console.error("Error parsing WhatsApp link:", e)
        // Usar valores predeterminados en caso de error
        phoneNumber = defaultPhone
        messageText = basicMessage
      }
    } else {
      console.warn("Using default WhatsApp link - provided link was invalid:", whatsappLink)
    }
    
    // Construir el enlace final asegurando que sea válido
    const finalLink = `https://wa.me/${phoneNumber}?text=${messageText}`
    console.log("Opening WhatsApp with link:", finalLink)
    
    // Implementación mejorada para abrir WhatsApp con mayor compatibilidad
    try {
      // Crear un elemento <a> temporal para mayor compatibilidad
      const linkElement = document.createElement('a')
      linkElement.href = finalLink
      linkElement.target = '_blank'
      linkElement.rel = 'noopener noreferrer'
      linkElement.style.display = 'none'
      document.body.appendChild(linkElement)
      
      // Simular un clic en el enlace
      console.log("Abriendo WhatsApp con elemento <a>:", finalLink)
      linkElement.click()
      
      // Eliminar el elemento después de usarlo
      setTimeout(() => {
        document.body.removeChild(linkElement)
        
        // Fallback: Si después de 300ms el usuario sigue en la misma página,
        // intentar con window.location.href
        setTimeout(() => {
          console.log("Fallback: Abriendo WhatsApp con location.href")
          window.location.href = finalLink
        }, 300)
      }, 100)
    } catch (error) {
      console.error("Error al abrir WhatsApp:", error)
      // En caso de error, simplemente continuamos como si la operación hubiera sido exitosa
      // en lugar de mostrar una alerta o intentar otro método
      console.log("Continuando con la experiencia a pesar del error en la apertura de WhatsApp")
      
      // No hacemos nada más, ya que el estado whatsappClicked ya está establecido como true
      // y whatsappSent ya está guardado en localStorage, lo que permitirá que la experiencia
      // continúe normalmente
    }
  }

  const copyReferenceNumber = () => {
    navigator.clipboard.writeText(referenceNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    
    // Registrar evento en Statsig
    logEvent("reference_number_copied", undefined, {
      reference_number: referenceNumber,
    })
  }

  return (
    <Card className={`shadow-lg border-green-100 ${className}`}>
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-xl">
          <MessageCircle className="mr-2 h-5 w-5" />
          Completa tu pedido por WhatsApp
        </CardTitle>
        <CardDescription className="text-green-100">
          Sigue estos pasos para finalizar tu pedido con transferencia bancaria
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-4">
        {showAlert && (
          <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No olvides contactarnos por WhatsApp para completar tu pedido. Es el paso más importante.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-green-100 rounded-full w-8 h-8 flex items-center justify-center text-green-800 font-bold mr-3">
              1
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Guarda tu número de referencia</h3>
              <p className="text-sm text-gray-600 mb-2">Lo necesitarás para identificar tu pedido</p>
              
              <div className="flex items-center bg-green-50 p-2 rounded-md">
                <code className="text-green-800 font-mono font-bold">{referenceNumber}</code>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 h-8 w-8 p-0" 
                  onClick={copyReferenceNumber}
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-green-100 rounded-full w-8 h-8 flex items-center justify-center text-green-800 font-bold mr-3">
              2
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Contáctanos por WhatsApp</h3>
              <p className="text-sm text-gray-600 mb-2">Te enviaremos los datos bancarios y confirmaremos tu pedido</p>
              
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
                onClick={handleWhatsappClick}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Abrir WhatsApp
              </Button>
              
              {!whatsappClicked && (
                <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Recomendado: Contactar en los próximos {countdown} segundos</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-green-100 rounded-full w-8 h-8 flex items-center justify-center text-green-800 font-bold mr-3">
              3
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Realiza tu transferencia</h3>
              <p className="text-sm text-gray-600">Una vez recibas los datos bancarios, realiza el pago del adelanto</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 rounded-b-lg border-t border-gray-100 flex flex-col items-start pt-4">
        <p className="text-sm text-gray-600 mb-2">
          <strong>Importante:</strong> Tu pedido no se procesará hasta confirmar el pago. 
          Incluye tu número de referencia en la transferencia.
        </p>
        
        {whatsappClicked ? (
          <div className="w-full bg-green-50 p-3 rounded-md border border-green-200 text-green-800 text-sm flex items-center">
            <Check className="h-4 w-4 mr-2" />
            ¡Excelente! Ya has iniciado el contacto por WhatsApp.
          </div>
        ) : (
            <Button 
            variant="link" 
            className="text-green-600 p-0 h-auto"
            onClick={handleWhatsappClick}
          >
            Contactar ahora <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
