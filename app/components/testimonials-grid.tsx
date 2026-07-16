"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote, Check, Award, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface Testimonial {
  id: number
  name: string
  location: string
  text: string
  rating: number
  image?: string
  songType?: string
  occasion?: string
  result?: string
  verifiedPurchase?: boolean
  featured?: boolean
}

interface TestimonialsGridProps {
  className?: string
  testimonials?: Testimonial[]
  columns?: 2 | 3 | 4
  limit?: number
}

// Testimonios predeterminados
const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Miguel Rodríguez",
    location: "Ciudad de México",
    text: "La canción que crearon para mi aniversario hizo llorar a mi esposa. Fue el regalo más emotivo que he podido darle en nuestros 10 años juntos.",
    rating: 5,
    songType: "premium",
    occasion: "Aniversario de matrimonio",
    result: "Mi esposa lloró de emoción",
    verifiedPurchase: true,
    featured: true
  },
  {
    id: 2,
    name: "Laura Sánchez",
    location: "Guadalajara",
    text: "Nunca pensé que una canción pudiera expresar tanto. Se la dediqué a mi madre en su cumpleaños y toda la familia quedó impresionada.",
    rating: 5,
    songType: "standard",
    occasion: "Cumpleaños de mamá",
    result: "Toda la familia quedó impresionada",
    verifiedPurchase: true
  },
  {
    id: 3,
    name: "Carlos Mendoza",
    location: "Monterrey",
    text: "Contraté la canción para mi negocio y ha sido la mejor inversión en marketing. Nuestros clientes la recuerdan y nos ha dado una identidad única.",
    rating: 5,
    songType: "premium",
    occasion: "Jingle para negocio",
    result: "Aumentó el reconocimiento de marca",
    verifiedPurchase: true,
    featured: true
  },
  {
    id: 4,
    name: "Ana Gutiérrez",
    location: "Puebla",
    text: "Mi novio no podía creer que le había regalado una canción personalizada. La escuchamos juntos y fue un momento mágico.",
    rating: 5,
    songType: "lite",
    occasion: "Regalo para mi pareja",
    result: "Un momento mágico e inolvidable",
    verifiedPurchase: true
  },
  {
    id: 5,
    name: "Roberto Díaz",
    location: "Mérida",
    text: "Pedí una canción para la boda de mi hermana y fue el momento más emotivo de la celebración. Todos preguntaban cómo habíamos conseguido algo tan especial.",
    rating: 5,
    songType: "standard",
    occasion: "Boda de mi hermana",
    result: "El momento más emotivo de la celebración",
    verifiedPurchase: true
  },
  {
    id: 6,
    name: "Sofía Martínez",
    location: "Querétaro",
    text: "Regalé esta canción a mis padres por su 30 aniversario y no podían creer que la letra hablara tan específicamente de su historia.",
    rating: 5,
    songType: "premium",
    occasion: "Aniversario de padres",
    result: "Un regalo que guardarán para siempre",
    verifiedPurchase: true,
    featured: true
  }
]

export default function TestimonialsGrid({
  className,
  testimonials = defaultTestimonials,
  columns = 3,
  limit = 6
}: TestimonialsGridProps) {
  // Limitar el número de testimonios a mostrar
  const displayTestimonials = testimonials.slice(0, limit)
  
  // Determinar las clases de columnas según el parámetro
  const columnClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }
  
  return (
    <div className={cn("w-full", className)}>
      <div className={cn("grid gap-4", columnClasses[columns])}>
        {displayTestimonials.map((testimonial) => (
          <Card 
            key={testimonial.id} 
            className={cn(
              "overflow-hidden border-green-100",
              testimonial.featured ? "shadow-md ring-1 ring-green-200" : "shadow-sm"
            )}
          >
            <CardContent className="p-4">
              {/* Cabecera con información del cliente */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-2">
                    {testimonial.image ? (
                      <Image 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        width={40} 
                        height={40} 
                        className="rounded-full object-cover"
                      />
                    ) : (
                      testimonial.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-900 text-sm">{testimonial.name}</h4>
                      {testimonial.verifiedPurchase && (
                        <Badge variant="outline" className="ml-1 text-[10px] py-0 px-1 border-green-500 text-green-700">
                          <Check className="h-2 w-2 mr-0.5" /> Verificado
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
                
                {/* Calificación */}
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "h-3 w-3", 
                        i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      )} 
                    />
                  ))}
                </div>
              </div>
              
              {/* Tipo de plan */}
              <div className="flex justify-between items-center mb-2">
                {testimonial.songType && (
                  <Badge 
                    className={cn(
                      "text-xs",
                      testimonial.songType === "premium" ? "bg-green-600 text-white" :
                      testimonial.songType === "standard" ? "bg-green-100 text-green-800" :
                      "bg-gray-100 text-gray-800"
                    )}
                  >
                    Plan {testimonial.songType.charAt(0).toUpperCase() + testimonial.songType.slice(1)}
                  </Badge>
                )}
                
                {/* Ocasión */}
                {testimonial.occasion && (
                  <div className="flex items-center text-xs text-emerald-700">
                    <Heart className="h-3 w-3 mr-1 text-emerald-500" />
                    {testimonial.occasion}
                  </div>
                )}
              </div>
              
              {/* Texto del testimonio */}
              <div className="relative mb-3">
                <Quote className="h-4 w-4 text-emerald-300 absolute top-0 left-0 opacity-50" />
                <p className="text-gray-700 text-sm italic pl-5 pr-2">{testimonial.text}</p>
              </div>
              
              {/* Resultado */}
              {testimonial.result && (
                <div className="mt-2 flex items-center bg-green-50 p-2 rounded-md border border-green-100">
                  <Award className="h-3 w-3 mr-1 text-green-600" />
                  <span className="text-xs font-medium text-green-800">{testimonial.result}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}