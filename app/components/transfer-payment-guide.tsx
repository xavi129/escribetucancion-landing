"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Clock, ShieldCheck, AlertTriangle, CreditCard, ArrowRight } from "lucide-react"
import UrgencyCountdown from "./urgency-countdown"
import { cn } from "@/lib/utils"

interface TransferPaymentGuideProps {
  className?: string
  orderId?: string
  amount: number
  bankName?: string
  accountNumber?: string
  clabe?: string
  beneficiary?: string
  onConfirmation?: (data: { transferId: string; transferDate: string; comments: string }) => void
}

export default function TransferPaymentGuide({
  className,
  orderId = "ORD-"+Math.floor(Math.random() * 10000),
  amount,
  bankName = "BBVA",
  accountNumber = "000000000000",
  clabe = "012345678901234567",
  beneficiary = "Haz Tu Canción S.A. de C.V.",
  onConfirmation
}: TransferPaymentGuideProps) {
  const [transferId, setTransferId] = useState("")
  const [transferDate, setTransferDate] = useState("")
  const [comments, setComments] = useState("")
  const [copied, setCopied] = useState<string | null>(null)
  const [errors, setErrors] = useState<{transferId?: string; transferDate?: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
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
      setCopied(field)
      setTimeout(() => setCopied(null), 2000)
      
      // Registrar evento de copia
      import("@/app/utils/statsig").then(({ logEvent }) => {
        logEvent("payment_info_copied", undefined, {
          field_copied: field
        })
      })
    })
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación
    const newErrors: {transferId?: string; transferDate?: string} = {}
    
    if (!transferId.trim()) {
      newErrors.transferId = "Por favor, ingresa el ID o referencia de tu transferencia"
    }
    
    if (!transferDate.trim()) {
      newErrors.transferDate = "Por favor, indica la fecha de tu transferencia"
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Procesar el envío
    setIsSubmitting(true)
    
    // Registrar evento
    import("@/app/utils/statsig").then(({ logEvent }) => {
      logEvent("transfer_confirmation_submitted", undefined, {
        has_comments: !!comments.trim()
      })
    })
    
    // Simular procesamiento
    setTimeout(() => {
      setShowSuccess(true)
      setIsSubmitting(false)
      
      if (onConfirmation) {
        onConfirmation({
          transferId,
          transferDate,
          comments
        })
      }
    }, 1500)
  }
  
  // Formatear la fecha actual como YYYY-MM-DD para el input date
  const today = new Date().toISOString().split('T')[0]
  
  return (
    <Card className={cn("shadow-md border-green-100", className)}>
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Pago por transferencia bancaria
          </CardTitle>
          
          {reservationTime && (
            <Badge className="bg-yellow-500 text-black font-medium">
              <Clock className="h-3 w-3 mr-1" />
              Reservado por 24h
            </Badge>
          )}
        </div>
        <CardDescription className="text-green-100">
          Tu pedido #{orderId} está reservado. Completa tu pago para comenzar a crear tu canción.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Contador de urgencia */}
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 flex items-center justify-between">
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
        
        {/* Información de pago */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800">Datos para tu transferencia:</h3>
          
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Monto a pagar:</p>
                <p className="font-bold text-lg text-green-800">${amount.toLocaleString('es-MX')} MXN</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={() => handleCopy(amount.toString(), "amount")}
              >
                {copied === "amount" ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Banco:</p>
                <p className="font-medium">{bankName}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Número de cuenta:</p>
                <p className="font-medium">{accountNumber}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={() => handleCopy(accountNumber, "account")}
              >
                {copied === "account" ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">CLABE interbancaria:</p>
                <p className="font-medium">{clabe}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={() => handleCopy(clabe, "clabe")}
              >
                {copied === "clabe" ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Beneficiario:</p>
                <p className="font-medium">{beneficiary}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={() => handleCopy(beneficiary, "beneficiary")}
              >
                {copied === "beneficiary" ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Concepto/Referencia:</p>
                <p className="font-medium">{orderId}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={() => handleCopy(orderId, "reference")}
              >
                {copied === "reference" ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Formulario de confirmación */}
        {!showSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-medium text-gray-800">Confirma tu pago:</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID o referencia de tu transferencia*
              </label>
              <Input
                value={transferId}
                onChange={(e) => setTransferId(e.target.value)}
                placeholder="Ej: 000000000000"
                className={errors.transferId ? "border-red-300" : ""}
              />
              {errors.transferId && (
                <p className="text-red-500 text-xs mt-1">{errors.transferId}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de la transferencia*
              </label>
              <Input
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                max={today}
                className={errors.transferDate ? "border-red-300" : ""}
              />
              {errors.transferDate && (
                <p className="text-red-500 text-xs mt-1">{errors.transferDate}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comentarios adicionales (opcional)
              </label>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Cualquier información adicional sobre tu pago..."
                className="resize-none"
                rows={3}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Procesando..."
              ) : (
                <span className="flex items-center justify-center">
                  Confirmar pago <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        ) : (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <p className="font-medium">¡Gracias por confirmar tu pago!</p>
              <p className="text-sm mt-1">Estamos verificando tu transferencia. Te notificaremos cuando sea confirmada y comenzaremos a trabajar en tu canción personalizada.</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t border-gray-100 flex items-center justify-center p-4">
        <div className="flex items-center text-sm text-gray-600">
          <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
          <span>Pago 100% seguro y verificado</span>
        </div>
      </CardFooter>
    </Card>
  )
}
