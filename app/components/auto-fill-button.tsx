"use client"

import { Button } from "@/components/ui/button"
import { Wand2, Sparkles } from "lucide-react"
import { useState } from "react"

interface AutoFillButtonProps {
  onFill: (data: any) => void
  className?: string
}

/**
 * Componente que proporciona un botón para auto-rellenar el formulario de creación de canciones
 * con datos de prueba completos y realistas.
 * 
 * Este componente solo debe usarse en entornos de desarrollo para facilitar las pruebas.
 */
export default function AutoFillButton({ onFill, className }: AutoFillButtonProps) {
  const [isFilling, setIsFilling] = useState(false)
  
  // Verificar si estamos en un entorno de desarrollo o si la variable NEXT_PUBLIC_SHOW_TEST_TOOLS está habilitada
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SHOW_TEST_TOOLS === 'true'
  
  // Si no estamos en desarrollo o no está habilitada la variable, no renderizar el botón
  if (!isDevelopment) return null
  
  const handleAutoFill = () => {
    setIsFilling(true)
    
    // Datos de prueba completos y realistas para rellenar el formulario
    const testData = {
      // Paso 1: Tipo de canción
      songType: "lite",
      
      // Paso 2: Ocasión
      occasion: "Cumpleaños",
      
      // Paso 3: Incluir nombre
      includeName: "yes",
      
      // Paso 4: Nombre de la persona
      personName: "María",
      
      // Paso 5: Relación
      relationship: "Pareja",
      
      // Paso 6: Género musical
      genre: "pop",
      customGenre: "", // Solo se usa si genre === "Otro"
      
      // Paso 7: Referencias musicales
      references: "Algo similar a 'Perfect' de Ed Sheeran, con un toque romántico y melódico",
      
      // Paso 8: Voz
      voiceGender: "male",
      
      // Paso 9: Estilos
      styles: ["romantico", "alegre"],
      
      // Paso 10: Detalles para la letra
      details: "Una canción que hable sobre nuestro amor y los momentos especiales que hemos compartido juntos. Quiero que mencione cómo nos conocimos en la universidad y cómo desde entonces hemos crecido juntos. Debe ser emotiva pero también alegre, reflejando nuestra personalidad como pareja.",
      
      // Paso 11: Tipo de entrega
      deliveryType: "standard",
      
      // Paso 12: Subir a Spotify
      spotifyUpload: "no",
      
      // Paso 13: Nombre del cliente
      customerName: "Carlos Rodríguez",
      
      // Paso 14: WhatsApp
      whatsapp: "000000000000",
      
      // Paso 15: Email
      email: "support@example.com",
      
      // Paso 16: Método de pago (freemium - no se usa en el flujo actual)
      paymentMethod: "freemium",
    }
    
    // Simular un pequeño delay para mejor UX
    setTimeout(() => {
      // Llamar a la función proporcionada con los datos de prueba
      onFill(testData)
      setIsFilling(false)
      
      // Registrar el uso del auto-rellenado en la consola
      console.log("✅ Formulario auto-rellenado con datos de prueba completos")
      console.log("📋 Datos:", testData)
    }, 300)
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      className={`bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-yellow-600 dark:text-yellow-400 hover:from-yellow-500/20 hover:to-orange-500/20 border-yellow-400/30 dark:border-yellow-500/30 transition-all duration-200 ${className}`}
      onClick={handleAutoFill}
      disabled={isFilling}
    >
      {isFilling ? (
        <>
          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
          Rellenando...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Auto-rellenar formulario
        </>
      )}
    </Button>
  )
}
