"use client"

import { useState, useEffect } from "react"
import { Check, X, HelpCircle, ArrowRight, Clock, Users, Star, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn } from "@/lib/utils"
import PriceDisplay from "./price-display"
import UrgencyCountdown from "./urgency-countdown"

interface PlanFeature {
  name: string
  lite: boolean | string
  standard: boolean | string
  premium: boolean | string
  tooltip?: string
}

const planFeatures: PlanFeature[] = [
  {
    name: "Letra personalizada",
    lite: true,
    standard: true,
    premium: true,
  },
  {
    name: "Duración de la canción",
    lite: "2 minutos",
    standard: "3 minutos",
    premium: "4 minutos",
    tooltip: "Duración aproximada de la canción terminada"
  },
  {
    name: "Tiempo de entrega",
    lite: "5-7 días",
    standard: "3-5 días",
    premium: "2-3 días",
    tooltip: "Tiempo estimado para la entrega estándar"
  },
  {
    name: "Revisiones de letra",
    lite: "1",
    standard: "2",
    premium: "3",
    tooltip: "Número de revisiones incluidas en el precio"
  },
  {
    name: "Calidad de producción",
    lite: "Estándar",
    standard: "Alta",
    premium: "Premium",
    tooltip: "Nivel de calidad en la producción musical"
  },
  {
    name: "Voces profesionales",
    lite: true,
    standard: true,
    premium: true,
  },
  {
    name: "Instrumentos en vivo",
    lite: false,
    standard: false,
    premium: true,
    tooltip: "Grabación con músicos reales para mayor calidad"
  },
  {
    name: "Mezcla y masterización",
    lite: "Básica",
    standard: "Profesional",
    premium: "Premium",
  },
  {
    name: "Archivo de letra",
    lite: true,
    standard: true,
    premium: true,
  },
  {
    name: "Archivo instrumental",
    lite: false,
    standard: true,
    premium: true,
  },
  {
    name: "Certificado de originalidad",
    lite: false,
    standard: true,
    premium: true,
    tooltip: "Documento que certifica que la canción es 100% original"
  },
  {
    name: "Derechos comerciales",
    lite: false,
    standard: false,
    premium: true,
    tooltip: "Permiso para usar la canción con fines comerciales"
  },
]

export default function PlanComparisonTable() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeUsers, setActiveUsers] = useState<number>(0)
  
  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    
    // Generar un número aleatorio de usuarios activos entre 8 y 15
    setActiveUsers(Math.floor(Math.random() * 8) + 8)
    
    return () => clearTimeout(timer)
  }, [])
  
  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan)
    
    // Registrar selección en Statsig
    import("@/app/utils/statsig").then(({ logEvent }) => {
      logEvent("plan_selected_from_comparison", undefined, {
        plan_type: plan
      })
    })
  }
  
  // Función para obtener el texto de recomendación según el plan
  const getPlanRecommendation = (plan: string) => {
    switch(plan) {
      case "lite":
        return "Ideal para regalos sencillos"
      case "standard":
        return "Perfecto para ocasiones especiales"
      case "premium":
        return "La mejor experiencia musical"
      default:
        return ""
    }
  }
  
  const renderValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-red-400 mx-auto" />
      )
    }
    return <span className="text-sm">{value}</span>
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[640px]">
        {/* Encabezado con contador de urgencia */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-green-800">Elige el plan perfecto para tu canción</h2>
          <div className="flex items-center space-x-2 bg-yellow-50 p-2 rounded-lg border border-yellow-200">
            <UrgencyCountdown 
              variant="inline" 
              showLabel={true}
              labelText="Oferta especial:"
              initialHours={1}
              initialMinutes={29}
              initialSeconds={59}
              className="text-sm"
            />
          </div>
        </div>
        
        {/* Indicador de usuarios activos */}
        <div className="mb-4 flex items-center text-sm text-gray-600 bg-green-50 p-2 rounded-lg">
          <Users className="h-4 w-4 mr-2 text-green-600" />
          <span><strong>{activeUsers} personas</strong> están viendo estos planes ahora</span>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {/* Header row */}
          <div className="p-4"></div>
          
          {/* Plan headers */}
          {["lite", "standard", "premium"].map((plan) => (
            <Card 
              key={plan}
              className={cn(
                "border transition-all duration-300", 
                selectedPlan === plan ? "border-green-500 shadow-lg ring-2 ring-green-200 transform scale-105" : "border-gray-200 hover:border-green-300 hover:shadow-md",
                plan === "standard" ? "relative" : ""
              )}
            >
              {plan === "standard" && (
                <Badge 
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white animate-pulse"
                >
                  Más popular
                </Badge>
              )}
              
              <CardHeader className="pb-2">
                <CardTitle className="text-center capitalize">
                  Plan {plan}
                </CardTitle>
                <CardDescription className="text-center text-xs text-green-700">
                  {getPlanRecommendation(plan)}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center">
                <PriceDisplay 
                  planType={plan as "lite" | "standard" | "premium"}
                  showOriginalPrice={true}
                  showDiscount={true}
                  size="lg"
                />
                
                {/* Garantía de satisfacción */}
                <div className="mt-2 mb-3 flex items-center justify-center text-xs text-gray-600">
                  <ShieldCheck className="h-3 w-3 mr-1 text-green-600" />
                  <span>100% Garantía de satisfacción</span>
                </div>
                
                {/* Tiempo de entrega destacado */}
                <div className="mb-3 flex items-center justify-center text-xs font-medium bg-green-50 p-1 rounded">
                  <Clock className="h-3 w-3 mr-1 text-green-600" />
                  <span>
                    {plan === "lite" ? "Entrega en 5-7 días" : 
                     plan === "standard" ? "Entrega en 3-5 días" : 
                     "Entrega rápida en 2-3 días"}
                  </span>
                </div>
                
                <Button 
                  className={cn(
                    "mt-2 w-full transition-all duration-300",
                    plan === "standard" ? "bg-green-600 hover:bg-green-700" : "",
                    selectedPlan === plan ? "animate-pulse" : ""
                  )}
                  variant={plan === "standard" ? "default" : "outline"}
                  onClick={() => handlePlanSelect(plan)}
                >
                  <Link href={`/crear-cancion?plan=${plan}`} className="flex items-center w-full justify-center">
                    Elegir plan <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                {/* Testimonios mini */}
                {plan === "standard" && (
                  <div className="mt-2 text-xs italic text-gray-500">
                    <Star className="h-3 w-3 inline text-yellow-400 fill-yellow-400" />
                    <Star className="h-3 w-3 inline text-yellow-400 fill-yellow-400" />
                    <Star className="h-3 w-3 inline text-yellow-400 fill-yellow-400" />
                    <Star className="h-3 w-3 inline text-yellow-400 fill-yellow-400" />
                    <Star className="h-3 w-3 inline text-yellow-400 fill-yellow-400" />
                    <p>"La mejor inversión que he hecho para un regalo"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {/* Feature rows */}
          {planFeatures.map((feature, index) => (
            <React.Fragment key={index}>
              <div className={cn(
                "flex items-center p-3",
                index % 2 === 0 ? "bg-green-50" : "bg-white"
              )}>
                <div className="flex items-center">
                  {feature.name}
                  {feature.tooltip && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{feature.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              
              {/* Feature values for each plan */}
                <div className={cn(
                "p-3 text-center",
                index % 2 === 0 ? "bg-green-50" : "bg-white",
                selectedPlan === "lite" ? "bg-green-50/70" : ""
              )}>
                {renderValue(feature.lite)}
              </div>
              
              <div className={cn(
                "p-3 text-center",
                index % 2 === 0 ? "bg-green-50" : "bg-white",
                selectedPlan === "standard" ? "bg-green-50/70" : "",
                plan === "standard" && typeof feature.standard === "boolean" && feature.standard ? "font-medium" : ""
              )}>
                {renderValue(feature.standard)}
              </div>
              
              <div className={cn(
                "p-3 text-center",
                index % 2 === 0 ? "bg-green-50" : "bg-white",
                selectedPlan === "premium" ? "bg-green-50/70" : "",
                plan === "premium" && typeof feature.premium === "boolean" && feature.premium ? "font-medium" : ""
              )}>
                {renderValue(feature.premium)}
              </div>
            </React.Fragment>
          ))}
        </div>
        
        {/* Mensaje de garantía y seguridad */}
        <div className="mt-6 bg-green-50 p-3 rounded-lg border border-green-200 text-sm text-center">
          <div className="flex items-center justify-center mb-1">
            <ShieldCheck className="h-5 w-5 mr-2 text-green-600" />
            <span className="font-medium text-green-800">100% Garantía de satisfacción</span>
          </div>
          <p className="text-green-700">Si no estás completamente satisfecho con tu canción, te ofrecemos revisiones sin costo adicional.</p>
        </div>
      </div>
    </div>
  )
}