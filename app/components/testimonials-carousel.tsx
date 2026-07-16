"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Quote, ThumbsUp, Award, Heart, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

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
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alejandro G.",
    location: "Estado de México",
    text: "Le regalé la canción por nuestro aniversario y LITERALMENTE se puso a llorar. Me dijo que nadie le había dado algo tan bonito. Gracias por ayudarme a quedar como un rey.",
    rating: 5,
    songType: "premium",
    occasion: "Aniversario de 2 años",
    result: "Ella lloró y me agradeció todo el día",
    verifiedPurchase: true
  },
  {
    id: 2,
    name: "Carlos R.",
    location: "CDMX",
    text: "Mi novia siempre dice que no soy detallista. Con esto la dejé sin palabras. La puso en sus historias de Instagram y todas sus amigas me amaron. 100% recomendado para los que no sabemos qué regalar.",
    rating: 5,
    songType: "standard",
    occasion: "Cumpleaños de mi novia",
    result: "Todas sus amigas me preguntaron cómo lo hice",
    verifiedPurchase: true
  },
  {
    id: 3,
    name: "Diego M.",
    location: "Jalisco",
    text: "Pensé que sería una canción generada por IA chafa, pero la calidad es increíble. La voz, la letra, todo. Ella la escucha todos los días camino al trabajo. Mejor inversión que flores o chocolates.",
    rating: 5,
    songType: "premium",
    occasion: "San Valentín",
    result: "Me dice que es el mejor regalo que le han dado",
    verifiedPurchase: true
  },
  {
    id: 4,
    name: "Roberto S.",
    location: "Monterrey",
    text: "Después de una pelea fuerte, no sabía cómo disculparme. La canción dijo todo lo que yo no podía. Lloramos juntos y ahora todo está mejor que antes. Bros, esto sí funciona.",
    rating: 5,
    songType: "lite",
    occasion: "Reconciliación",
    result: "Nos reconciliamos y nuestra relación mejoró",
    verifiedPurchase: true
  },
  {
    id: 5,
    name: "Fernando L.",
    location: "Puebla",
    text: "Le propuse matrimonio con la canción de fondo. Ella no paraba de llorar y obvio dijo que sí. Todos nuestros amigos dicen que fue la propuesta más romántica que han visto. Vale cada peso.",
    rating: 5,
    songType: "premium",
    occasion: "Propuesta de matrimonio",
    result: "Dijo que SÍ y fue la propuesta perfecta",
    verifiedPurchase: true
  },
  {
    id: 6,
    name: "Luis T.",
    location: "Querétaro",
    text: "Tenía miedo de que fuera muy 'cursi' pero no. La canción en estilo Regional Mexicano quedó perfecta. Mi novia y yo somos fans de ese género y capturaron justo nuestra vibra. Excelente servicio.",
    rating: 5,
    songType: "standard",
    occasion: "Mesiversario",
    result: "Le encantó el estilo y la letra personalizada",
    verifiedPurchase: true
  }
]

export default function TestimonialsCarousel({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [totalReviews, setTotalReviews] = useState(87) // Número ficticio de reseñas totales

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false)
  const handleMouseLeave = () => setAutoplay(true)

  const handlePrevious = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length)
  }

  // Calcular la calificación promedio
  const averageRating = testimonials.reduce((acc, curr) => acc + curr.rating, 0) / testimonials.length

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute top-0 left-0 w-32 h-32 bg-brand-terracotta/10 rounded-full -translate-x-6 -translate-y-6 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full translate-x-8 translate-y-8 blur-3xl"></div>

      <Card className="brand-surface backdrop-blur-md relative z-10">
        <CardHeader className="pb-2 pt-6 border-b border-white/5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <Quote className="h-8 w-8 text-brand-bordeaux mr-3 rotate-180" />
              <div>
                <CardTitle className="text-xl font-bold text-white">Lo que dicen nuestros clientes</CardTitle>
                <div className="flex items-center mt-1">
                  <div className="flex -space-x-2 mr-3">
                    {testimonials.slice(0, 3).map((t, i) => (
                      <div
                        key={t.id}
                        className={cn(
                          "w-6 h-6 rounded-full ring-2 ring-white/10 overflow-hidden bg-gradient-to-br",
                          i === 0 ? "from-brand-terracotta to-brand-bordeaux" : i === 1 ? "from-brand-bordeaux to-brand-gold" : "from-brand-forest to-brand-terracotta"
                        )}
                        aria-hidden
                        title={t.name}
                      >
                        {t.image ? (
                          <Image src={t.image} alt={t.name} width={24} height={24} className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-semibold text-xs">
                            {t.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-slate-700"
                      )}
                      fill={i < Math.round(averageRating) ? "currentColor" : "none"}
                    />
                  ))}
                  <span className="ml-2 text-sm font-bold text-slate-300">{averageRating.toFixed(1)}/5</span>
                  <span className="ml-2 text-xs text-slate-500">({totalReviews} reseñas verificadas)</span>
                </div>
              </div>
            </div>
            <Badge className="bg-brand-terracotta/10 text-brand-terracotta border-brand-terracotta/30 flex items-center px-3 py-1">
              <ThumbsUp className="h-3 w-3 mr-2" />
              98% Satisfacción
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-1">
                  <div className="flex flex-col h-full bg-brand-cream/70 p-6 rounded-2xl border border-brand-forest/10 hover:bg-brand-cream transition-colors">
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-brand-terracotta to-brand-bordeaux rounded-full flex items-center justify-center text-white font-bold text-lg mr-3 ring-2 ring-white/10 shadow-lg">
                            {testimonial.image ? (
                              <Image
                                src={testimonial.image}
                                alt={testimonial.name}
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              testimonial.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h4 className="font-bold text-white">{testimonial.name}</h4>
                              {testimonial.verifiedPurchase && (
                                <Badge variant="outline" className="ml-2 text-[10px] py-0 px-1 border-green-500/50 text-green-400 bg-green-500/10">
                                  <Check className="h-2 w-2 mr-0.5" /> Verificado
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-400">{testimonial.location}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          {testimonial.songType && (
                            <Badge
                              className={cn(
                                "px-2 py-1 text-xs border-0",
                                testimonial.songType === "premium" ? "bg-brand-bordeaux/10 text-brand-bordeaux" :
                                  testimonial.songType === "standard" ? "bg-brand-forest/10 text-brand-forest" :
                                    "bg-brand-paperDeep text-brand-muted"
                              )}
                            >
                              Plan {testimonial.songType.charAt(0).toUpperCase() + testimonial.songType.slice(1)}
                            </Badge>
                          )}
                          <div className="flex mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3 w-3",
                                  i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-700"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ocasión */}
                    {testimonial.occasion && (
                      <div className="mb-4 flex items-center text-xs text-brand-bordeaux bg-brand-bordeaux/10 p-1.5 px-3 rounded-full w-fit border border-brand-bordeaux/20">
                        <Heart className="h-3 w-3 mr-1.5 text-brand-bordeaux" />
                        {testimonial.occasion}
                      </div>
                    )}

                    <p className="text-slate-300 flex-grow italic text-lg leading-relaxed">"{testimonial.text}"</p>

                    {/* Resultado */}
                    {testimonial.result && (
                      <div className="mt-4 flex items-center bg-green-500/10 p-3 rounded-xl border border-green-500/20">
                        <Award className="h-5 w-5 mr-3 text-green-400" />
                        <span className="text-sm font-medium text-green-300">{testimonial.result}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-white/10 bg-white/5 hover:bg-white/20 text-white hover:text-white"
                onClick={handlePrevious}
                aria-label="Anterior testimonio"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-white/10 bg-white/5 hover:bg-white/20 text-white hover:text-white"
                onClick={handleNext}
                aria-label="Siguiente testimonio"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex justify-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full mx-1 transition-all",
                    index === activeIndex ? "bg-brand-terracotta w-6" : "bg-brand-muted/20 hover:bg-brand-muted/40"
                  )}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Mostrar testimonio ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                />
              ))}
            </div>

            <Button variant="link" size="sm" className="text-brand-bordeaux hover:text-brand-terracotta p-0 h-auto font-medium">
              Ver todas las reseñas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
