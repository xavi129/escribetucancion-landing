"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { trackWhatsappClick } from "@/app/utils/analytics"
import { usePathname } from "next/navigation"

export default function WhatsappButton() {
  const pathname = usePathname()
  // Show on all pages except the confirmation page
  const isHomePage = pathname === "/"
  
  // Only render the button on the homepage
  if (!isHomePage) return null
  
  const phoneNumber = "000000000000"
  const message = encodeURIComponent("Hola, me interesa crear una canción personalizada. ¿Podrían ayudarme?")
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  const handleClick = () => {
    // Track the WhatsApp click event
    trackWhatsappClick()
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <div className="absolute -top-16 right-0 bg-black text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        ¿Dudas? ¡Contáctanos por WhatsApp!
        <div className="absolute bottom-0 right-5 transform translate-y-1/2 rotate-45 w-2 h-2 bg-black"></div>
      </div>
      <Button 
        onClick={handleClick}
        size="lg"
        className="rounded-full bg-green-500 hover:bg-green-600 shadow-lg h-16 w-16 p-0 flex items-center justify-center animate-bounce-slow"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="h-8 w-8 text-white" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold animate-pulse">1</span>
      </Button>
    </div>
  )
}
