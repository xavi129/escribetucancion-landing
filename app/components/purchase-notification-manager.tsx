"use client"

import { useState, useEffect } from "react"
import RecentPurchaseNotification from "./recent-purchase-notification"

interface PurchaseNotification {
  id: string
  customerName: string
  location: string
  timeAgo: string
  productType?: string
}

export default function PurchaseNotificationManager() {
  const [notifications, setNotifications] = useState<PurchaseNotification[]>([])
  
  useEffect(() => {
    // Simular una notificación inicial de Carlos de Ciudad de México
    const initialNotification: PurchaseNotification = {
      id: "carlos-cdmx",
      customerName: "Carlos",
      location: "Ciudad de México",
      timeAgo: "hace 5 minutos",
      productType: "canción personalizada"
    }
    
    setNotifications([initialNotification])
    
    // Eliminar la notificación después de 8 segundos
    const timer = setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== "carlos-cdmx"))
    }, 8000)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Función para eliminar una notificación específica
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }
  
  if (notifications.length === 0) return null
  
  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-2 animate-in fade-in duration-300">
      {notifications.map(notification => (
        <RecentPurchaseNotification
          key={notification.id}
          customerName={notification.customerName}
          location={notification.location}
          timeAgo={notification.timeAgo}
          productType={notification.productType}
          autoHideDuration={8000}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}