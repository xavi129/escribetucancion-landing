"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, X, Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecentPurchaseProps {
  customerName: string
  location: string
  timeAgo: string
  productType?: string
  autoHideDuration?: number
  className?: string
  onClose?: () => void
}

export default function RecentPurchaseNotification({
  customerName,
  location,
  timeAgo,
  productType = "canción personalizada",
  autoHideDuration = 5000, // 5 segundos por defecto
  className,
  onClose,
}: RecentPurchaseProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Configurar temporizador para ocultar la notificación
    const timer = setTimeout(() => {
      setVisible(false)
    }, autoHideDuration)

    // Limpiar temporizador cuando el componente se desmonte
    return () => clearTimeout(timer)
  }, [autoHideDuration])

  if (!visible) return null

  return (
    <Alert
      className={cn(
        "relative border-2 border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-xl animate-in fade-in slide-in-from-left-10 duration-500 hover:shadow-2xl transition-all",
        className
      )}
    >
      <div className="absolute right-2 top-2">
        <button
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="rounded-full p-1 hover:bg-green-200 transition-colors"
          aria-label="Cerrar notificación"
        >
          <X className="h-4 w-4 text-green-700" />
        </button>
      </div>
      
      <div className="flex items-start">
        <div className="mr-3 flex-shrink-0 bg-green-500 p-2.5 rounded-full shadow-md animate-pulse">
          <User className="h-5 w-5 text-white" />
        </div>
        
        <div className="flex-1 pr-8">
          <AlertTitle className="text-green-900 font-bold flex items-center gap-2 text-base">
            🎉 Nueva compra
            <Badge className="bg-green-500 text-white hover:bg-green-600 shadow-sm">
              <Clock className="h-3 w-3 mr-1" />
              {timeAgo}
            </Badge>
          </AlertTitle>
          <AlertDescription className="text-green-800 mt-1.5 font-medium">
            <strong>{customerName}</strong> de <strong>{location}</strong> acaba de comprar una {productType}.
          </AlertDescription>
        </div>
      </div>
    </Alert>
  )
}