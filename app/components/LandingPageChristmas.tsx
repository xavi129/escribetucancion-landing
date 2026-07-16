"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Users, Gift, Check, Award, Shield, Clock, MessageCircle, ArrowRight, Music2, Star, Play, Snowflake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DemosSection from "./demos-section"
// import WhatsappForm from "./whatsapp-form"
import VideoPlayer from "./video-player"
import { usePriceExperiment } from "@/app/hooks/use-price-experiment"
import HeroPriceDisplay from "./hero-price-display"
// import LeadCaptureBanner from "./lead-capture-banner"
import TestimonialsCarousel from "./testimonials-carousel"
// import PurchaseNotificationManager from "./purchase-notification-manager"
import MediaRecognition from "./media-recognition"
import CountdownTimer, { useCountdown, formatTime } from "./countdown-timer"
import { trackLandingPageView } from "@/app/utils/analytics"
import { logCopywritingCTAClick } from "@/app/utils/statsig"

export default function Home() {
  const prices = usePriceExperiment()
  const timeLeft = useCountdown()

  // Christmas Theme Override - bypassing experiment for the season
  const copyVariant = {
    variant: "Christmas_Special",
    hero_title_line1: "Una navidad 🎄 para recordar ",
    hero_title_highlight: "con una cancion",
    hero_title_line2: "",
    hero_subtitle: "Sorprende a quien más amas con un regalo único que jamás olvidará. La magia de la Navidad hecha canción.",
    benefit_1: "🎄 El regalo más original de la Navidad",
    benefit_3: "⚡ Entrega Express antes de Nochebuena",
    cta_button_text: "CREAR MI CANCIÓN",
    cta_mobile_text: "CREAR CANCIÓN",
    secondary_button_text: "Escuchar demo navideña",
  }

  const [autoplayId, setAutoplayId] = useState<number | null>(null)

  // Track landing page view
  useEffect(() => {
    trackLandingPageView({
      referrer: typeof window !== "undefined" ? (document.referrer || "direct") : "direct",
      path: "/",
    })
  }, [])

  const handleHeroPlayDemo = () => {
    // Target demo id tailored to 25-34 male audience (Reggaeton romántico)
    const targetId = 1 // Reggaeton Romántico
    setAutoplayId(targetId)
    // Scroll to demos section to show the player
    const elem = document.getElementById("demos")
    if (elem) elem.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  // Track CTA clicks para el experimento de copywriting
  const handleHeroCTAClick = () => {
    logCopywritingCTAClick("hero", copyVariant.variant, {
      cta_text: copyVariant.cta_button_text,
    })
  }

  const handleMobileCTAClick = () => {
    logCopywritingCTAClick("mobile_sticky", copyVariant.variant, {
      cta_text: copyVariant.cta_mobile_text,
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-400 font-sans selection:bg-red-500/30">
      <style jsx global>{`
        @keyframes snow {
          0% { transform: translateY(-10vh); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0.2; }
        }
        .snowflake {
          position: absolute;
          color: white;
          font-size: 1.2em;
          font-family: Arial, sans-serif;
          text-shadow: 0 0 5px #000;
          animation: snow 10s linear infinite;
          top: -10%;
          z-index: 1;
          pointer-events: none;
          opacity: 0;
          will-change: transform;
        }
        .snowflake:nth-child(1) { left: 10%; animation-delay: 0s; font-size: 1.5em; }
        .snowflake:nth-child(2) { left: 20%; animation-delay: 2s; animation-duration: 7s; font-size: 1em; }
        .snowflake:nth-child(3) { left: 30%; animation-delay: 4s; font-size: 2em; }
        .snowflake:nth-child(4) { left: 40%; animation-delay: 0s; animation-duration: 8s; font-size: 1.2em; }
        .snowflake:nth-child(5) { left: 50%; animation-delay: 2s; font-size: 1.8em; }
        .snowflake:nth-child(6) { left: 60%; animation-delay: 4s; animation-duration: 6s; font-size: 1em; }
        .snowflake:nth-child(7) { left: 70%; animation-delay: 1s; font-size: 1.5em; }
        .snowflake:nth-child(8) { left: 80%; animation-delay: 3s; animation-duration: 9s; font-size: 1.2em; }
        .snowflake:nth-child(9) { left: 90%; animation-delay: 5s; font-size: 1.8em; }
      `}</style>

      {/* Purchase Notification Manager */}
      {/* <PurchaseNotificationManager /> */}
      {/* Hero Section */}
      <section id="hero-section" className="relative overflow-hidden min-h-[90vh] flex items-center justify-center">
        {/* Christmas Gradient Background */}
        <div className="absolute inset-0 w-full h-full z-0 transform-gpu">
          {/* Base gradient background - Deep Red for Christmas Night */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-red-950 to-slate-950"></div>
          {/* Christmas Glow Overlay - Removed global backdrop-blur for performance */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-red-900/20 to-slate-900/90"></div>
          {/* Noise texture with hardware acceleration hint */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light will-change-transform"></div>

          {/* Falling Snow */}
          <div className="snowflake">❄</div>
          <div className="snowflake">❅</div>
          <div className="snowflake">❆</div>
          <div className="snowflake">❄</div>
          <div className="snowflake">❅</div>
          <div className="snowflake">❆</div>
          <div className="snowflake">❄</div>
          <div className="snowflake">❅</div>
          <div className="snowflake">❆</div>
        </div>

        <div className="relative z-10 w-full py-12 sm:py-20 px-4 sm:px-6 lg:px-8 text-white">
          {/* Countdown Timer - Fixed position */}
          <div className="fixed top-0 left-0 right-0 z-50 flex justify-center py-2 md:hidden">
            <CountdownTimer className="shadow-lg border-red-500/20" />
          </div>
          <div className="hidden md:block fixed top-6 right-6 z-50">
            <CountdownTimer className="shadow-2xl border-red-500/20" />
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-3/5 flex flex-col justify-center text-left pt-8 md:pt-0">

                {/* Trust Indicators */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 animate-fade-in-up w-fit">
                  <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-yellow-500/30 shadow-inner">
                    <div className="flex -space-x-2 mr-3">
                      {['Alejandro G.', 'Carlos R.', 'Diego M.'].map((name, i) => (
                        <div
                          key={name}
                          className={`w-6 h-6 rounded-full ring-2 ring-white/10 overflow-hidden bg-gradient-to-br ${i === 0 ? 'from-red-600 to-red-600' : i === 1 ? 'from-green-600 to-green-500' : 'from-yellow-500 to-yellow-600'}`}
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
                          <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-medium text-white/90">4.9/5 (500+ clientes satisfechos)</span>
                    </div>
                  </div>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight drop-shadow-2xl text-balance">
                  {copyVariant.hero_title_line1}
                  <br />
                  <span className="text-white sm:text-transparent sm:bg-clip-text sm:bg-gradient-to-r sm:from-yellow-300 sm:via-amber-300 sm:to-yellow-500 sm:webkit-text-gradient filter drop-shadow-lg">
                    {copyVariant.hero_title_highlight}
                  </span>
                  {copyVariant.hero_title_line2 && <><br /><span className="text-white">{copyVariant.hero_title_line2}</span></>}
                </h1>

                <p className="text-xl sm:text-2xl md:text-3xl mb-8 text-white/90 font-medium max-w-2xl leading-relaxed text-balance">
                  {copyVariant.hero_subtitle}
                </p>

                {/* Feature List - Glassmorphism */}
                <div className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl mb-10 border border-white/10 shadow-2xl max-w-xl hover:bg-white/10 transition-colors duration-300 group">
                  <ul className="space-y-4">
                    <li className="flex items-center text-base sm:text-lg group/item">
                      <div className="bg-green-500/20 p-2 rounded-full mr-4 group-hover/item:bg-green-500/30 transition-colors">
                        <Gift className="w-5 h-5 text-green-400" />
                      </div>
                      <span className="font-medium text-white/90">{copyVariant.benefit_1}</span>
                    </li>
                    <li className="flex items-center text-base sm:text-lg group/item">
                      <div className="bg-green-500/20 p-2 rounded-full mr-4 group-hover/item:bg-green-500/30 transition-colors">
                        <Check className="w-5 h-5 text-green-400" />
                      </div>
                      <span className="font-medium text-white/90">Desde solo <HeroPriceDisplay showPrefix={false} size="sm" className="inline-flex ml-1 text-white font-bold" /></span>
                    </li>
                    <li className="flex items-center text-base sm:text-lg group/item">
                      <div className="bg-green-500/20 p-2 rounded-full mr-4 group-hover/item:bg-green-500/30 transition-colors">
                        <Clock className="w-5 h-5 text-green-400" />
                      </div>
                      <span className="font-medium text-white/90">{copyVariant.benefit_3}</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 max-w-lg w-full">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-500 hover:to-red-700 font-bold shadow-[0_0_30px_rgba(220,38,38,0.4)] border-t border-white/20 text-lg py-8 px-8 w-full rounded-2xl transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
                    asChild
                  >
                    <Link href="/crear-cancion" onClick={handleHeroCTAClick} className="flex items-center justify-center gap-3">
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-xl"></div>
                      <Gift className="h-6 w-6" />
                      <span className="relative">{copyVariant.cta_button_text}</span>
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
                    {copyVariant.secondary_button_text}
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
              { icon: Gift, text: "Regalo Ideal", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
              { icon: Shield, text: "100% Seguro", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
              { icon: Award, text: "Calidad Pro", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
              { icon: Check, text: "Garantía", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
              { icon: Users, text: "+500 Clientes", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" }
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
      <section id="reacciones" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 relative" style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Reacciones <span className="text-white sm:text-transparent sm:bg-clip-text sm:bg-gradient-to-r sm:from-red-400 sm:to-yellow-400 sm:webkit-text-gradient">Navideñas</span>
            </h2>
            <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto">
              Mira la emoción real al recibir el regalo más especial.
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
                  className="bg-red-600 hover:bg-red-500 text-white font-bold py-6 px-8 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:scale-105"
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50 border-y border-white/5" style={{ contentVisibility: 'auto', containIntrinsicSize: '600px' }}>
        <div className="max-w-7xl mx-auto">
          <TestimonialsCarousel className="mb-12" />

          <div className="text-center">
            <Button
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-6 px-8 rounded-xl backdrop-blur-md transition-all hover:scale-105"
            >
              <Link href="/crear-cancion" className="flex items-center">
                CREAR MI CANCIÓN <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Freemium Model Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden" style={{ contentVisibility: 'auto', containIntrinsicSize: '1000px' }}>
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-500/10 text-green-400 border border-green-500/20 px-6 py-2 rounded-full text-sm font-bold mb-6 animate-pulse shadow-[0_0_15px_rgba(74,222,128,0.1)]">
              🎁 ESCUCHA ANTES DE REGALAR - SIN RIESGO
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              ¡Escucha <span className="text-green-400">ANTES</span> de Pagar!
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Esta Navidad, no corras riesgos. Escucha la demo de 70 segundos. Solo pagas si te encanta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
            {/* Step 1 */}
            <div className="group relative bg-white/5 rounded-3xl p-8 shadow-2xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border border-white/10">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-8xl font-black text-white leading-none">1</span>
              </div>
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-red-500/20">
                <MessageCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Cuéntanos tu historia</h3>
              <p className="text-slate-400 leading-relaxed">
                Comparte los detalles, anécdotas y sentimientos que quieres capturar. La Navidad es el momento perfecto para decir lo que sientes.
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
                En 24 horas recibirás una demo de 70 segundos por WhatsApp. <span className="font-bold text-green-400">Escúchala sin compromiso</span>.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative bg-white/5 rounded-3xl p-8 shadow-2xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border border-white/10">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-8xl font-black text-white leading-none">3</span>
              </div>
              <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-yellow-500/20">
                <Gift className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Regala Emoción</h3>
              <p className="text-slate-400 leading-relaxed">
                Si te encanta, realizas el pago y recibes la canción completa lista para poner bajo el árbol 🎄.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-3xl p-8 md:p-12 border border-green-500/20 backdrop-blur-md relative overflow-hidden transform-gpu">
            <div className="absolute inset-0 bg-green-500/5 mix-blend-overlay"></div>
            <div className="text-center relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                ✨ Sin riesgo. Sin compromiso. <span className="text-green-400">Escucha primero</span>, paga después.
              </h3>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                Miles de clientes ya han probado nuestra demo. ¿Por qué tú no?
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black text-lg py-8 px-10 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all hover:scale-105"
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
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-950" style={{ contentVisibility: 'auto', containIntrinsicSize: '500px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/5 rounded-3xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-md transform-gpu">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-gradient-to-br from-green-900/40 to-emerald-900/40 p-8 text-white border-r border-white/5">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3">🎁</span>
                  <h2 className="text-2xl md:text-3xl font-bold">Escucha Antes de Pagar</h2>
                </div>
                <p className="text-lg mb-6 text-slate-300">
                  Con nuestro modelo freemium, escuchas una demo de 70 segundos de tu canción antes de pagar. Sin riesgo.
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
              <div className="md:w-1/2 bg-gradient-to-br from-red-900/40 to-red-900/40 p-8 text-white">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4">
                    <Shield className="h-8 w-8 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Garantía de Satisfacción 100%</h3>
                    <p className="text-slate-300">Tu satisfacción es nuestra prioridad número uno</p>
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
                <Button className="w-full bg-red-600 text-white hover:bg-red-500 font-bold rounded-xl py-6" asChild>
                  <Link href="/crear-cancion" className="flex items-center justify-center w-full">
                    CREAR MI CANCIÓN <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Why Gift a Song */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">¿Por qué regalar una canción esta Navidad? 🎄</h2>
            <p className="mt-4 text-xl text-slate-400">Un regalo único que trasciende lo material</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: "🔥", title: "Mejor que un suéter o calcetines", desc: "Mientras otros dan ropa que no les queda, tú darás algo que escucharán para siempre." },
              { icon: "👑", title: "Queda como un rey sin esfuerzo", desc: "Nosotros hacemos el trabajo difícil. Tú solo te llevas el crédito en la cena de Navidad." },
              { icon: "💡", title: "No más pánico de '¿Qué le regalo?'", desc: "¿Amigo secreto? ¿Pareja? ¿Papás? Una canción funciona para TODOS." },
              { icon: "💬", title: "Di lo que no puedes decir", desc: "¿Te cuesta expresarte? Perfecto. Nuestra canción lo hará por ti (y mejor)." }
            ].map((item, i) => (
              <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <span className="text-red-400 mr-3 text-2xl">{item.icon}</span> {item.title}
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative" style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Historias de <span className="text-red-400">Navidad</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Más de 500 personas han regalado lágrimas de felicidad con EscribeTuCancion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white/5 p-8 rounded-3xl shadow-xl border border-white/10 relative flex flex-col h-full backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg transform rotate-3">
                ⭐ HISTORIA DESTACADA
              </div>
              <div className="mb-6">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 text-lg italic leading-relaxed mb-6">
                  "Se la puse en la cena de Navidad frente a toda la familia. <span className="font-bold text-white bg-red-500/20 px-1">Todos terminaron llorando de emoción</span>. Fue el mejor momento de la noche."
                </p>
              </div>
              <div className="mt-auto flex items-center border-t border-white/10 pt-6">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 font-bold text-lg mr-3">
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
                  "No sabía qué regalarle a mi novia este año. Esta canción la dejó sin palabras. <span className="font-bold text-white bg-red-500/20 px-1">La subió a Instagram y todas sus amigas me amaron</span>. 100% recomendado."
                </p>
              </div>
              <div className="mt-auto flex items-center border-t border-white/10 pt-6">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold text-lg mr-3">
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
                  "La calidad es increíble. La voz, la letra, todo. <span className="font-bold text-white bg-green-500/20 px-1">Es el regalo más original que he dado</span>. Definitivamente repetiré."
                </p>
              </div>
              <div className="mt-auto flex items-center border-t border-white/10 pt-6">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-400 font-bold text-lg mr-3">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-950 via-red-900 to-slate-900 text-white relative overflow-hidden" style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-yellow-400 mr-2 animate-pulse"></span>
            <span className="text-yellow-300 text-sm font-bold tracking-wide uppercase">Oferta de Navidad</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            ¿Listo para hacerla <br />
            <span className="text-white sm:text-transparent sm:bg-clip-text sm:bg-gradient-to-r sm:from-green-400 sm:to-emerald-400 sm:webkit-text-gradient">llorar de emoción?</span>
          </h2>

          <p className="text-xl md:text-2xl text-red-100 mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
            <span className="font-bold text-green-300">Escucha tu demo antes de pagar.</span> Sin riesgo. Solo pagas si te encanta.
          </p>

          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 mb-12 max-w-3xl mx-auto shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <p className="text-lg font-bold text-white mb-1">Tu canción personalizada incluye:</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-red-100 text-sm">
                    <Check className="w-4 h-4 text-green-400 mr-2" /> Letra 100% original basada en tu historia
                  </li>
                  <li className="flex items-center text-red-100 text-sm">
                    <Check className="w-4 h-4 text-green-400 mr-2" /> Calidad de estudio profesional
                  </li>
                  <li className="flex items-center text-red-100 text-sm">
                    <Check className="w-4 h-4 text-green-400 mr-2" /> Entrega rápida para Navidad
                  </li>
                </ul>
              </div>
              <div className="text-right">
                <div className="text-sm text-red-200 mb-1">Precio regular: <span className="line-through">$1,999</span></div>
                <div className="text-4xl font-black text-white flex items-center justify-end gap-2">
                  <HeroPriceDisplay showPrefix={false} size="lg" className="text-white" />
                  <span className="text-sm font-normal text-red-200 self-end mb-1">MXN</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-500 hover:to-red-700 font-bold shadow-[0_0_40px_rgba(220,38,38,0.5)] border-t border-white/20 text-xl py-8 px-10 w-full rounded-2xl transition-all duration-300 hover:scale-105 group"
              asChild
            >
              <Link href="/crear-cancion" className="flex items-center justify-center">
                <Music2 className="mr-3 h-6 w-6" />
                CREAR MI CANCIÓN
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
                href="https://wa.me/000000000000?text=Hola,%20quiero%20crear%20una%20canción%20personalizada"
                target="_blank"
                className="flex items-center justify-center"
              >
                <MessageCircle className="mr-3 h-6 w-6" />
                Hablar por WhatsApp
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-red-300/70">
            🔒 Pago 100% seguro • Garantía de satisfacción
          </p>
        </div>
      </section>

      {/* Sticky Bottom CTA for Mobile - Only visible on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900/90 backdrop-blur-md border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pb-safe transition-all duration-300 transform-gpu">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">
                Pocos cupos Navidad
              </span>
            </div>
            <div className="text-[10px] font-medium text-slate-400 bg-white/5 px-2 py-1 rounded-full border border-white/5">
              Termina en <span className="text-white font-mono">{formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}</span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black shadow-[0_0_25px_rgba(220,38,38,0.4)] text-base py-6 rounded-xl relative overflow-hidden group border-t border-white/20"
            asChild
          >
            <Link href="/crear-cancion" onClick={handleMobileCTAClick} className="flex items-center justify-center gap-2">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-xl"></div>
              <Music2 className="h-5 w-5" />
              <span className="tracking-wide">{copyVariant.cta_mobile_text}</span>
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
