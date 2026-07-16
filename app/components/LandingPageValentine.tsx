"use client"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { Users, Gift, Check, Award, Shield, MessageCircle, ArrowRight, Music2, Star, Play, Heart, Calendar, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import HeroPriceDisplay from "./hero-price-display"
import MediaRecognition from "./media-recognition"
import { trackLandingPageView } from "@/app/utils/analytics"

// Lazy load heavy below-the-fold components
const DemosSection = dynamic(() => import("./demos-section"), {
  loading: () => <div className="h-96 bg-slate-900/50 animate-pulse rounded-xl" />,
})

const VideoPlayer = dynamic(() => import("./video-player"), {
  loading: () => <div className="w-full aspect-video bg-slate-800 animate-pulse rounded-xl" />,
})

const TestimonialsCarousel = dynamic(() => import("./testimonials-carousel"), {
  loading: () => <div className="h-64 bg-slate-900/50 animate-pulse rounded-xl" />,
})

export default function LandingPageValentine() {
  const [autoplayId, setAutoplayId] = useState<number | null>(null)

  // Track landing page view
  useEffect(() => {
    trackLandingPageView({
      referrer: typeof window !== "undefined" ? (document.referrer || "direct") : "direct",
      path: "/",
    })
  }, [])

  const handleHeroPlayDemo = () => {
    // Target San Valentín demo (ID 9)
    setAutoplayId(9)
    // Scroll to demos section to show the player
    const elem = document.getElementById("demos")
    if (elem) elem.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  // Hardcoded Valentine's Copy
  const valentineCopy = {
    hero_title_line1: "Este San Valentín",
    hero_title_highlight: "Regala su canción",
    hero_title_line2: "con su historia",
    hero_subtitle: "Convierte sus momentos, nombres y recuerdos en una canción profesional. El regalo más romántico y original para este 14 de febrero.",
    benefit_1: "Escucha tu demo • Solo pagas si te enamoras",
    benefit_3: "Recíbela antes de San Valentín",
    cta_button_text: "CREAR CANCIÓN DE AMOR",
    cta_mobile_text: "CREAR CANCIÓN DE AMOR",
    secondary_button_text: "Escuchar demo de amor"
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-400 font-sans selection:bg-rose-500/30">
      {/* Hero Section */}
      <section id="hero-section" className="relative overflow-hidden min-h-[85vh] flex items-center justify-center">
        {/* Valentine Gradient Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          {/* Base gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900"></div>
          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-rose-900/90 to-slate-900/80 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        </div>

        <div className="relative z-10 w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-3/5 flex flex-col justify-center text-left">

                {/* Trust Indicators */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 animate-fade-in-up w-fit">
                  <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-inner">
                    <div className="flex -space-x-2 mr-3">
                      {['Ana', 'Luis', 'Sofía'].map((name, i) => (
                        <div
                          key={name}
                          className={`w-6 h-6 rounded-full ring-2 ring-white/10 overflow-hidden bg-gradient-to-br ${i === 0 ? 'from-rose-600 to-red-600' : i === 1 ? 'from-pink-500 to-rose-400' : 'from-red-500 to-orange-400'}`}
                          title={name}
                          aria-hidden
                        >
                          <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">{name.charAt(0)}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-3 h-3 fill-rose-400 text-rose-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-medium text-white/90">4.9/5 (500+ parejas felices)</span>
                    </div>
                  </div>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight drop-shadow-2xl text-balance">
                  {valentineCopy.hero_title_line1}
                  <br />
                  <span className="text-white sm:text-transparent sm:bg-clip-text sm:bg-gradient-to-r sm:from-rose-300 sm:via-red-300 sm:to-pink-300 sm:webkit-text-gradient filter drop-shadow-lg">
                    {valentineCopy.hero_title_highlight}
                  </span>
                  {valentineCopy.hero_title_line2 && <><br /><span className="text-white">{valentineCopy.hero_title_line2}</span></>}
                </h1>

                <p className="text-xl sm:text-2xl md:text-3xl mb-8 text-white/90 font-medium max-w-2xl leading-relaxed text-balance">
                  {valentineCopy.hero_subtitle}
                </p>

                {/* Feature List - Glassmorphism */}
                <div className="bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-3xl mb-10 border border-white/10 shadow-2xl max-w-xl hover:bg-white/10 transition-colors duration-300 group">
                  <ul className="space-y-4">
                    <li className="flex items-center text-base sm:text-lg group/item">
                      <div className="bg-green-500/20 p-2 rounded-full mr-4 group-hover/item:bg-green-500/30 transition-colors">
                        <Check className="w-5 h-5 text-green-400" />
                      </div>
                      <span className="font-medium text-white/90">{valentineCopy.benefit_1}</span>
                    </li>
                    <li className="flex items-center text-base sm:text-lg group/item">
                      <div className="bg-green-500/20 p-2 rounded-full mr-4 group-hover/item:bg-green-500/30 transition-colors">
                        <Check className="w-5 h-5 text-green-400" />
                      </div>
                      <span className="font-medium text-white/90">Desde solo <HeroPriceDisplay showPrefix={false} size="sm" className="inline-flex ml-1 text-white font-bold" /></span>
                    </li>
                    <li className="flex items-center text-base sm:text-lg group/item">
                      <div className="bg-green-500/20 p-2 rounded-full mr-4 group-hover/item:bg-green-500/30 transition-colors">
                        <Check className="w-5 h-5 text-green-400" />
                      </div>
                      <span className="font-medium text-white/90">{valentineCopy.benefit_3}</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 max-w-lg w-full">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500 font-bold shadow-[0_0_30px_rgba(225,29,72,0.5)] border-t border-white/20 text-lg py-8 px-8 w-full rounded-2xl transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
                    asChild
                  >
                    <Link href="/crear-cancion" className="flex items-center justify-center gap-3">
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-xl"></div>
                      <Heart className="h-6 w-6 fill-white text-white" />
                      <span className="relative">{valentineCopy.cta_button_text}</span>
                      <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleHeroPlayDemo}
                    className="bg-white/5 hover:bg-white/10 text-white border-white/20 hover:border-white/40 font-semibold backdrop-blur-sm text-lg py-8 w-full rounded-2xl transition-all duration-300"
                    aria-label="Escuchar demo gratis"
                  >
                    <div className="bg-white/10 p-1.5 rounded-full">
                      <Play className="h-5 w-5 fill-white" />
                    </div>
                    {valentineCopy.secondary_button_text}
                  </Button>
                </div>

                <p className="mt-6 text-sm text-white/50 flex items-center gap-2 font-medium">
                  <Shield className="w-4 h-4" /> Garantía de satisfacción del 100% o te devolvemos tu dinero
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demos Section */}
      <DemosSection autoplayId={autoplayId} onAutoplayStart={() => setAutoplayId(null)} />

      {/* Trust Badges Section */}
      <section className="py-8 sm:py-12 bg-slate-950 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-soft-light"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
            {[
              { icon: Gift, text: "Demo Gratis", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
              { icon: Shield, text: "100% Seguro", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
              { icon: Award, text: "Calidad Pro", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
              { icon: Check, text: "Garantía", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
              { icon: Users, text: "+500 Parejas", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" }
            ].map((item, index) => (
              <div key={index} className={`flex flex-col items-center ${item.bg} backdrop-blur-sm px-4 py-5 rounded-2xl border ${item.border} text-center hover:scale-105 transition-transform duration-300 ${index === 4 ? 'col-span-2 md:col-span-1' : ''}`}>
                <item.icon className={`h-8 w-8 ${item.color} mb-2`} />
                <span className="text-xs sm:text-sm font-bold text-white/90">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Recognition Section */}
      <section className="py-8 bg-slate-950 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 opacity-70 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0">
          <MediaRecognition className="transform hover:scale-105 transition-transform duration-300" />
        </div>
      </section>

      {/* Customer Reactions Video */}
      <section id="reacciones" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Reacciones de <span className="text-white sm:text-transparent sm:bg-clip-text sm:bg-gradient-to-r sm:from-rose-400 sm:to-red-400 sm:webkit-text-gradient">Amor</span>
            </h2>
            <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto">
              Mira la emoción real al recibir una canción creada especialmente para ellos.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 p-2 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-sm">
              <div className="rounded-xl overflow-hidden relative group">
                <VideoPlayer
                  src="https://res.cloudinary.com/dl4qe1k9b/video/upload/q_auto,f_auto/v1742852071/k0suimbuuysdtyvlzblh.mp4"
                  autoPlay={true}
                  muted={true}
                  loop={true}
                  className="w-full shadow-inner"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
              </div>

              <div className="mt-8 text-center pb-4">
                <Button
                  size="lg"
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-6 px-8 rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all hover:scale-105"
                  asChild
                >
                  <Link href="/crear-cancion" className="flex items-center">
                    CREAR MI CANCIÓN <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <TestimonialsCarousel className="mb-12" />

          <div className="text-center">
            <Button
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-6 px-8 rounded-xl backdrop-blur-md transition-all hover:scale-105"
              asChild
            >
              <Link href="/crear-cancion" className="flex items-center">
                CREAR MI CANCIÓN <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Freemium Model Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-500/10 text-green-400 border border-green-500/20 px-6 py-2 rounded-full text-sm font-bold mb-6 animate-pulse shadow-[0_0_15px_rgba(74,222,128,0.1)]">
              🎁 ESCUCHA ANTES DE PAGAR - SIN RIESGO
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              ¡Escucha <span className="text-green-400">ANTES</span> de Pagar!
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Sin riesgo. Sin compromiso. Escucha tu canción de 70 segundos. Solo pagas si te enamoras del resultado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
            {/* Step 1 */}
            <div className="group relative bg-white/5 rounded-3xl p-8 shadow-2xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border border-white/10">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-8xl font-black text-white leading-none">1</span>
              </div>
              <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-rose-500/20">
                <MessageCircle className="w-8 h-8 text-rose-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Cuéntanos tu historia</h3>
              <p className="text-slate-400 leading-relaxed">
                Comparte los detalles, anécdotas y sentimientos que quieres capturar. No necesitas ser poeta, nosotros nos encargamos de la magia.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative bg-white/5 rounded-3xl p-8 shadow-2xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border border-green-500/30 ring-1 ring-green-500/20">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                PASO FAVORITO
              </div>
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-8xl font-black text-green-400 leading-none">2</span>
              </div>
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-green-500/20">
                <Music2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Recibe tu Demo Gratis</h3>
              <p className="text-slate-400 leading-relaxed">
                En 24 horas recibirás una demo de 70 segundos por WhatsApp. <span className="font-bold text-green-400">Escúchala sin compromiso</span>. Solo pagas si te gusta.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative bg-white/5 rounded-3xl p-8 shadow-2xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border border-white/10">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-8xl font-black text-white leading-none">3</span>
              </div>
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-red-500/20">
                <Gift className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Regala Amor</h3>
              <p className="text-slate-400 leading-relaxed">
                Si te encanta (¡que seguro lo hará!), realizas el pago y recibes la canción completa lista para dedicar y emocionar.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-3xl p-8 md:p-12 border border-green-500/20 backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 bg-green-500/5 mix-blend-overlay"></div>
            <div className="text-center relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                ✨ Sin riesgo. Sin compromiso. <span className="text-green-400">Escucha primero</span>, paga después.
              </h3>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                Miles de parejas ya han probado nuestra demo. ¿Por qué tú no?
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-lg py-8 px-10 rounded-2xl shadow-[0_0_30px_rgba(225,29,72,0.5)] transition-all hover:scale-105"
                asChild
              >
                <Link href="/crear-cancion" className="flex items-center justify-center">
                  <Music2 className="mr-3 h-6 w-6" />
                  CREAR MI CANCIÓN <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Satisfaction Guarantee */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/5 rounded-3xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-md">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-gradient-to-br from-green-900/40 to-emerald-900/40 p-8 text-white border-r border-white/5">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3">🎁</span>
                  <h2 className="text-2xl md:text-3xl font-bold">Escucha Antes de Pagar</h2>
                </div>
                <p className="text-lg mb-6 text-slate-300">
                  Con nuestro modelo freemium, escuchas una demo de 70 segundos de tu canción antes de pagar. Sin riesgo. Sin compromiso.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-6 w-6 text-green-400 mr-2 flex-shrink-0" />
                    <span className="font-bold">Demo de 70 segundos • Solo pagas si te gusta</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-6 w-6 text-green-400 mr-2 flex-shrink-0" />
                    <span>No pagas nada hasta que te guste</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-6 w-6 text-green-400 mr-2 flex-shrink-0" />
                    <span>Sin compromiso. Sin riesgo</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-6 w-6 text-green-400 mr-2 flex-shrink-0" />
                    <span>Revisiones ilimitadas hasta tu aprobación</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 bg-gradient-to-br from-rose-900/40 to-red-900/40 p-8 text-white">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4">
                    <Shield className="h-8 w-8 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Garantía de Satisfacción 100%</h3>
                    <p className="text-slate-300">Tu felicidad es nuestra prioridad número uno</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">
                  Entendemos que una canción personalizada es un regalo especial y emocional. Por eso, te damos la oportunidad de escucharla primero.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Revisiones hasta tu aprobación</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Atención personalizada durante todo el proceso</span>
                  </li>
                </ul>
                <Button className="w-full bg-rose-600 text-white hover:bg-rose-500 font-bold rounded-xl py-6" asChild>
                  <Link href="/crear-cancion" className="flex items-center justify-center w-full">
                    CREAR MI CANCIÓN <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Gift a Song - Valentine Edition */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">¿Por qué regalar una canción?</h2>
            <p className="mt-4 text-xl text-slate-400">El regalo más original para este San Valentín</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Heart, title: "Flores que nunca se marchitan", desc: "Mientras las rosas duran días, esta canción durará para siempre en su playlist y en su corazón.", color: "text-rose-400" },
              { icon: Crown, title: "El detalle más romántico", desc: "Demuestra que te tomaste el tiempo de crear algo único. Un regalo que dice 'Te Amo' en cada verso.", color: "text-yellow-400" },
              { icon: Calendar, title: "Perfecto para San Valentín", desc: "Olvídate de los chocolates genéricos. Regala una experiencia que podrán compartir y revivir juntos.", color: "text-red-400" },
              { icon: MessageCircle, title: "Expresa todo tu amor", desc: "¿Te cuesta encontrar las palabras? Nosotros escribimos la letra perfecta basada en tu historia de amor.", color: "text-pink-400" }
            ].map((item, i) => (
              <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <item.icon className={`mr-3 h-6 w-6 ${item.color}`} /> {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Historias de <span className="text-rose-400">Amor</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Más de 500 parejas han celebrado su amor con EscribeTuCancion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white/5 p-8 rounded-3xl shadow-xl border border-white/10 relative flex flex-col h-full backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg transform rotate-3">
                ⭐ HISTORIA REAL
              </div>
              <div className="mb-6">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 text-lg italic leading-relaxed mb-6">
                  "Bro, le encantó. LLORÓ cuando la escuchó. Me dijo que fue el mejor regalo que le han dado en su vida. <span className="font-bold text-white bg-rose-500/20 px-1">Sus amigas le preguntaron dónde lo conseguí</span>. 100% recomendado."
                </p>
              </div>
              <div className="mt-auto flex items-center border-t border-white/10 pt-6">
                <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-400 font-bold text-lg mr-3">
                  A
                </div>
                <div>
                  <h4 className="font-bold text-white">Alejandro G.</h4>
                  <div className="flex items-center text-xs text-green-400 font-bold mt-0.5">
                    <Check className="w-3 h-3 mr-1" /> Compra Verificada
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white/5 p-8 rounded-3xl shadow-lg border border-white/10 flex flex-col h-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
              <div className="mb-6">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 text-lg italic leading-relaxed mb-6">
                  "Mi novia siempre decía que 'no soy romántico'. Esta canción la dejó sin palabras. <span className="font-bold text-white bg-rose-500/20 px-1">La subió a Instagram y todas sus amigas le preguntaron cómo conseguí un novio así</span>. Literalmente me salvó."
                </p>
              </div>
              <div className="mt-auto flex items-center border-t border-white/10 pt-6">
                <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-400 font-bold text-lg mr-3">
                  D
                </div>
                <div>
                  <h4 className="font-bold text-white">Daniel S.</h4>
                  <div className="flex items-center text-xs text-green-400 font-bold mt-0.5">
                    <Check className="w-3 h-3 mr-1" /> Compra Verificada
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white/5 p-8 rounded-3xl shadow-lg border border-white/10 flex flex-col h-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
              <div className="mb-6">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 text-lg italic leading-relaxed mb-6">
                  "Pensé que sería una canción generada por IA chafa, pero la calidad es increíble. La voz, la letra, todo. <span className="font-bold text-white bg-green-500/20 px-1">Ella la escucha todos los días</span> camino al trabajo."
                </p>
              </div>
              <div className="mt-auto flex items-center border-t border-white/10 pt-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-lg mr-3">
                  C
                </div>
                <div>
                  <h4 className="font-bold text-white">Carlos R.</h4>
                  <div className="flex items-center text-xs text-green-400 font-bold mt-0.5">
                    <Check className="w-3 h-3 mr-1" /> Compra Verificada
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-900 via-red-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-yellow-400 mr-2 animate-pulse"></span>
            <span className="text-yellow-300 text-sm font-bold tracking-wide uppercase">Oferta de San Valentín</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            ¿Listo para <br />
            <span className="text-white sm:text-transparent sm:bg-clip-text sm:bg-gradient-to-r sm:from-rose-400 sm:to-red-400 sm:webkit-text-gradient">sorprenderla como nunca?</span>
          </h2>

          <p className="text-xl md:text-2xl text-rose-100 mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
            <span className="font-bold text-rose-300">Escucha tu demo antes de pagar.</span> Sin riesgo. Sin compromiso. Solo pagas si te encanta.
          </p>

          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 mb-12 max-w-3xl mx-auto shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <p className="text-lg font-bold text-white mb-1">Tu canción de amor incluye:</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-rose-200 text-sm">
                    <Check className="w-4 h-4 text-green-400 mr-2" /> Letra 100% original basada en tu historia
                  </li>
                  <li className="flex items-center text-rose-200 text-sm">
                    <Check className="w-4 h-4 text-green-400 mr-2" /> Calidad de estudio profesional
                  </li>
                  <li className="flex items-center text-rose-200 text-sm">
                    <Check className="w-4 h-4 text-green-400 mr-2" /> Entrega rápida antes de San Valentín
                  </li>
                </ul>
              </div>
              <div className="text-right">
                <div className="text-sm text-rose-300 mb-1">Precio regular: <span className="line-through">$1,999</span></div>
                <div className="text-4xl font-black text-white flex items-center justify-end gap-2">
                  <HeroPriceDisplay showPrefix={false} size="lg" className="text-white" />
                  <span className="text-sm font-normal text-rose-300 self-end mb-1">MXN</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <Button
              size="lg"
              className="bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500 font-bold shadow-[0_0_40px_rgba(225,29,72,0.5)] border-t border-white/20 text-xl py-8 px-10 w-full rounded-2xl transition-all duration-300 hover:scale-[1.02] group"
              asChild
            >
              <Link href="/crear-cancion" className="flex items-center justify-center">
                <Music2 className="mr-3 h-6 w-6" />
                CREAR CANCIÓN DE AMOR
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white/20 text-white hover:bg-white/10 text-lg py-8 px-8 w-full rounded-2xl font-bold backdrop-blur-sm"
              asChild
            >
              <Link
                href="https://wa.me/000000000000?text=Hola,%20quiero%20crear%20una%20canción%20de%20San%20Valentín"
                target="_blank"
                className="flex items-center justify-center"
              >
                <MessageCircle className="mr-3 h-6 w-6" />
                Hablar por WhatsApp
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-rose-300/70">
            🔒 Pago 100% seguro • Garantía de satisfacción
          </p>
        </div>
      </section>

      {/* Sticky Bottom CTA for Mobile - Only visible on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900/80 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pb-safe transition-all duration-300">
        <div className="px-4 py-3">
          <div className="flex justify-center items-center mb-3">
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
               <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
               <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wide">
                 Edición Especial San Valentín
               </span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black shadow-[0_0_25px_rgba(225,29,72,0.4)] text-base py-6 rounded-xl relative overflow-hidden group border-t border-white/20"
            asChild
          >
            <Link href="/crear-cancion" className="flex items-center justify-center gap-2">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-xl"></div>
              <Music2 className="h-5 w-5" />
              <span className="tracking-wide">{valentineCopy.cta_mobile_text}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <p className="text-center text-slate-500 text-[10px] mt-2.5 flex justify-center items-center gap-1.5 font-medium">
            <Shield className="w-3 h-3 text-green-500" /> Demo de 70s • Sin tarjeta requerida
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 pb-24 md:pb-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">EscribeTuCancion</h3>
              <p className="text-sm leading-relaxed mb-6">
                Creamos canciones personalizadas que capturan tus historias y emociones. El regalo perfecto para momentos inolvidables.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-wider">Navegación</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
                <li><Link href="#como-funciona" className="hover:text-white transition-colors">¿Cómo funciona?</Link></li>
                <li><Link href="/crear-cancion" className="hover:text-white transition-colors">Crear Canción</Link></li>
                <li><Link href="#demos" className="hover:text-white transition-colors">Ejemplos</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-wider">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/terminos-y-condiciones" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
                <li><Link href="/politica-de-privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
                <li><Link href="/politica-de-reembolso" className="hover:text-white transition-colors">Política de Reembolso</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-wider">Contacto</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> support@example.com</li>
                <li>000000000000</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs">
              &copy; {new Date().getFullYear()} EscribeTuCancion. Todos los derechos reservados.
            </p>
            <p className="text-xs flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Sistemas Operativos
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
