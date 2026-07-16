"use client"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { Users, Gift, Check, Award, Shield, MessageCircle, ArrowRight, Music2, Star, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import WhatsappForm from "./whatsapp-form"
import { usePriceExperiment } from "@/app/hooks/use-price-experiment"
import { useCopywritingExperiment } from "@/app/hooks/use-copywriting-experiment"
import HeroPriceDisplay from "./hero-price-display"
// import LeadCaptureBanner from "./lead-capture-banner"
// import PurchaseNotificationManager from "./purchase-notification-manager"
import MediaRecognition from "./media-recognition"
import CountdownTimer, { useCountdown, formatTime } from "./countdown-timer"
import { trackLandingPageView } from "@/app/utils/analytics"
import { logCopywritingCTAClick } from "@/app/utils/statsig"
import { PALETTE, Waveform } from "./shared"

// Lazy load heavy below-the-fold components
const DemosSection = dynamic(() => import("./demos-section"), {
  loading: () => <div className="h-96 bg-brand-paperDeep animate-pulse rounded-xl" />,
})

const VideoPlayer = dynamic(() => import("./video-player"), {
  loading: () => <div className="w-full aspect-video bg-brand-inkSoft animate-pulse rounded-xl" />,
})

const TestimonialsCarousel = dynamic(() => import("./testimonials-carousel"), {
  loading: () => <div className="h-64 bg-brand-paperDeep animate-pulse rounded-xl" />,
})

export default function Home() {
  const prices = usePriceExperiment()
  const timeLeft = useCountdown()
  const copyVariant = useCopywritingExperiment()

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
    <div className="flex flex-col min-h-screen brand-page font-sans selection:bg-brand-terracotta/30">
      {/* Purchase Notification Manager */}
      {/* <PurchaseNotificationManager /> */}
      {/* Hero Section */}
      <section id="hero-section" className="relative overflow-hidden min-h-[84vh] bg-brand-paper text-brand-ink">
        {/* Premium Gradient Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          {/* Base gradient background */}
          <div className="absolute inset-0 bg-brand-paper"></div>
          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_23%,rgba(255,107,107,0.12),transparent_28rem),radial-gradient(circle_at_12%_88%,rgba(244,184,96,0.10),transparent_24rem)]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.045] mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <header className="flex items-center justify-between border-b border-brand-forest/10 py-5">
              <Link href="/" className="font-serif text-xl font-bold tracking-tight text-brand-ink">
                escribetucanción<span className="text-brand-terracotta">.</span>
              </Link>
              <nav className="hidden md:flex items-center gap-9 text-xs font-medium text-brand-inkSoft">
                <a href="#demos" className="hover:text-brand-terracotta transition-colors">Ejemplos</a>
                <a href="#generos" className="hover:text-brand-terracotta transition-colors">Géneros</a>
                <a href="#como-funciona" className="hover:text-brand-terracotta transition-colors">Ocasiones</a>
                <a href="#faq" className="hover:text-brand-terracotta transition-colors">FAQ</a>
              </nav>
              <Button asChild className="brand-cta h-10 px-5 text-xs font-bold shadow-none">
                <Link href="/crear-cancion" onClick={handleHeroCTAClick}>{copyVariant.cta_button_text}</Link>
              </Button>
            </header>

            <div className="grid min-h-[calc(84vh-5rem)] grid-cols-1 items-center gap-10 py-12 md:grid-cols-[1fr_0.9fr] lg:gap-16">
              <div className="max-w-[42rem] text-left">

                {/* Trust Indicators */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-7 animate-fade-in-up w-fit">
                  <div className="flex items-center bg-white/75 backdrop-blur-md px-4 py-2 rounded-full border border-brand-forest/10 shadow-sm">
                    <div className="flex -space-x-2 mr-3">
                      {['Alejandro G.', 'Carlos R.', 'Diego M.'].map((name, i) => (
                        <div
                          key={name}
                          className={`w-6 h-6 rounded-full ring-2 ring-white overflow-hidden bg-gradient-to-br ${i === 0 ? 'from-brand-terracotta to-brand-bordeaux' : i === 1 ? 'from-brand-bordeaux to-brand-gold' : 'from-brand-forest to-brand-terracotta'}`}
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
                      <span className="text-[10px] font-medium text-brand-inkSoft">4.9/5 (500+ clientes satisfechos)</span>
                    </div>
                  </div>
                </div>

                <h1 className="brand-heading text-5xl sm:text-6xl md:text-[4.35rem] mb-6 leading-[0.95] text-balance">
                  {copyVariant.hero_title_line1}
                  <br />
                  <span className="font-serif italic text-brand-terracotta">
                    {copyVariant.hero_title_highlight}
                  </span>
                  {copyVariant.hero_title_line2 && <><br /><span className="text-brand-muted">{copyVariant.hero_title_line2}</span></>}
                </h1>

                <p className="text-base sm:text-lg mb-7 text-brand-inkSoft max-w-xl leading-relaxed text-balance">
                  {copyVariant.hero_subtitle}
                </p>

                {/* Feature List - Glassmorphism */}
                <div className="mb-7 max-w-xl transition-colors duration-300 group">
                  <ul className="grid gap-4 sm:grid-cols-[1fr_1.25fr_1fr] text-xs text-brand-muted">
                    <li className="border-r border-brand-forest/10 pr-4 group/item">
                      <div className="mb-2 inline-flex bg-brand-terracotta/10 p-1.5 rounded-full group-hover/item:bg-brand-terracotta/20 transition-colors">
                        <Check className="w-3.5 h-3.5 text-brand-terracotta" />
                      </div>
                      <span className="block font-semibold leading-snug text-brand-ink">{copyVariant.benefit_1}</span>
                    </li>
                    <li className="border-r border-brand-forest/10 pr-4 group/item">
                      <div className="mb-2 inline-flex bg-brand-terracotta/10 p-1.5 rounded-full group-hover/item:bg-brand-terracotta/20 transition-colors">
                        <Check className="w-3.5 h-3.5 text-brand-terracotta" />
                      </div>
                      <span className="block font-semibold leading-snug text-brand-ink">Desde solo <HeroPriceDisplay showPrefix={false} size="sm" className="inline-flex ml-1 text-brand-ink font-bold whitespace-nowrap" /></span>
                    </li>
                    <li className="group/item">
                      <div className="mb-2 inline-flex bg-brand-terracotta/10 p-1.5 rounded-full group-hover/item:bg-brand-terracotta/20 transition-colors">
                        <Check className="w-3.5 h-3.5 text-brand-terracotta" />
                      </div>
                      <span className="block font-semibold leading-snug text-brand-ink">{copyVariant.benefit_3}</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 max-w-lg w-full">
                  <Button
                    size="lg"
                    className="brand-cta text-white font-bold text-base h-14 px-8 w-full transition-all duration-300 hover:scale-[1.01] group relative overflow-hidden"
                    asChild
                  >
                    <Link href="/crear-cancion" onClick={handleHeroCTAClick} className="flex items-center justify-center gap-3">
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-xl"></div>
                      <span className="relative">{copyVariant.cta_button_text}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleHeroPlayDemo}
                    className="h-14 rounded-[var(--radius-sm)] border-brand-forest/15 bg-white/70 text-brand-ink hover:bg-white hover:text-brand-ink font-semibold backdrop-blur-sm text-base w-full transition-all duration-300"
                    aria-label="Escuchar demo gratis"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    {copyVariant.secondary_button_text || "Escuchar demo real"}
                  </Button>
                </div>

                <p className="mt-6 text-sm text-brand-muted flex items-center gap-2 font-medium">
                  <Shield className="w-4 h-4" /> Garantía de satisfacción del 100% o te devolvemos tu dinero
                </p>
              </div>

              <div className="relative hidden md:block">
                <div className="absolute -right-6 top-7 h-full w-full rounded-[1.4rem] bg-brand-paperDeep shadow-[0_24px_60px_rgba(26,21,48,0.09)]"></div>
                <div className="relative rounded-[1.4rem] border border-brand-forest/10 bg-white/75 p-8 shadow-[0_28px_90px_rgba(26,21,48,0.13)] backdrop-blur-xl">
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                      <p className="brand-kicker text-[10px]">Escucha antes de decidir</p>
                      <h2 className="brand-heading mt-2 text-3xl leading-none">{copyVariant.secondary_button_text || "Escuchar demo real"}</h2>
                      <p className="mt-2 text-sm italic text-brand-muted">{copyVariant.benefit_1}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleHeroPlayDemo}
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-terracotta text-white shadow-[0_14px_30px_rgba(255,107,107,0.34)]"
                      aria-label="Escuchar demo gratis"
                    >
                      <Play className="h-5 w-5 fill-current" />
                    </button>
                  </div>
                  <div className="mb-5 rounded-[var(--radius-sm)] border-l-2 border-brand-terracotta bg-white p-6 text-brand-inkSoft shadow-sm">
                    <p className="font-serif text-lg italic leading-relaxed">
                      {copyVariant.hero_subtitle}
                    </p>
                  </div>
                  <Waveform color={PALETTE.terracotta} height={72} bars={66} playing progress={0.72} />
                  <div className="mt-4 flex justify-center gap-2 text-[11px] text-brand-muted">
                    <span>{copyVariant.benefit_3}</span>
                    <span>·</span>
                    <span>Desde <HeroPriceDisplay showPrefix={false} size="sm" className="inline-flex text-brand-ink font-bold" /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="generos" className="relative z-10 border-t border-brand-forest/10 bg-brand-paperDeep/80 px-4 py-7 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center">
            <p className="max-w-xs font-serif text-xl italic leading-tight text-brand-ink">
              En el género que mejor cuente su historia —
            </p>
            <div className="flex flex-wrap gap-3">
              {["Bolero", "Pop romántico", "Ranchera", "Balada", "Acústico", "Reggae", "Rock", "Mariachi", "Cumbia", "Salsa", "Jazz"].map((genre) => (
                <span key={genre} className="rounded-full border border-brand-forest/10 bg-white/80 px-4 py-2 text-xs font-medium text-brand-inkSoft shadow-sm">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demos Section */}
      <DemosSection autoplayId={autoplayId} onAutoplayStart={() => setAutoplayId(null)} />

      {/* Trust Badges Section */}
      {/* Trust Badges Section */}
      <section className="py-8 sm:py-12 brand-section-deep border-b border-brand-forest/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-soft-light"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
            {[
              { icon: Gift, text: "Demo Gratis", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
              { icon: Shield, text: "100% Seguro", color: "text-brand-forest", bg: "bg-brand-forest/10", border: "border-brand-forest/20" },
              { icon: Award, text: "Calidad Pro", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
              { icon: Check, text: "Garantía", color: "text-brand-terracotta", bg: "bg-brand-terracotta/10", border: "border-brand-terracotta/20" },
              { icon: Users, text: "+500 Clientes", color: "text-brand-bordeaux", bg: "bg-brand-bordeaux/10", border: "border-brand-bordeaux/20" }
            ].map((item, index) => (
              <div key={index} className={`flex flex-col items-center ${item.bg} backdrop-blur-sm px-4 py-5 rounded-2xl border ${item.border} text-center hover:scale-105 transition-transform duration-300 ${index === 4 ? 'col-span-2 md:col-span-1' : ''}`}>
                <item.icon className={`h-8 w-8 ${item.color} mb-2`} />
                <span className="text-xs sm:text-sm font-bold text-brand-ink">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Recognition Section */}
      {/* Media Recognition Section */}
      <section className="py-8 brand-section border-b border-brand-forest/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 opacity-70 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0">
          <MediaRecognition className="transform hover:scale-105 transition-transform duration-300" />
        </div>
      </section>

      {/* Lead Capture Banner
      <section className="py-8 bg-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LeadCaptureBanner
            discountAmount="20%"
            onCapture={(data) => {
              console.log("Lead captured:", data);
              // Aquí puedes implementar lógica adicional como enviar el lead a tu CRM
            }}
          />
        </div>
      </section> */}

      {/* Recent Orders Notification */}
      {/* <div className="fixed bottom-4 left-4 z-50 max-w-xs bg-white rounded-lg shadow-lg p-4 border border-gray-200 animate-in slide-in-from-left-10 duration-500">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-purple-100 rounded-full p-2">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Carlos de Ciudad de México</p>
            <p className="text-xs text-gray-500">Compró una canción personalizada hace 5 minutos</p>
          </div>
        </div>
      </div> */}

      {/* Customer Reactions Video */}
      {/* Customer Reactions Video */}
      <section id="reacciones" className="py-20 px-4 sm:px-6 lg:px-8 brand-section relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-bordeaux/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="brand-heading text-3xl md:text-5xl mb-6">
              Reacciones <span className="brand-highlight">Reales</span>
            </h2>
            <p className="mt-4 text-xl brand-muted max-w-2xl mx-auto">
              Mira la emoción real al recibir nuestras canciones personalizadas
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="brand-surface p-2 rounded-2xl backdrop-blur-sm">
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
                  className="brand-cta text-white font-bold py-6 px-8 transition-all hover:scale-105"
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 brand-section-deep border-y border-brand-forest/10">
        <div className="max-w-7xl mx-auto">
          <TestimonialsCarousel className="mb-12" />

          <div className="text-center">
            <Button
              size="lg"
              className="brand-cta text-white border border-white/20 font-bold py-6 px-8 backdrop-blur-md transition-all hover:scale-105"
            >
              <Link href="/crear-cancion" className="flex items-center">
                CREAR MI CANCIÓN <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Freemium Model Section */}
      {/* Freemium Model Section */}
      <section id="como-funciona" className="py-24 px-4 sm:px-6 lg:px-8 brand-section relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-terracotta/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block bg-brand-terracotta/10 text-brand-terracotta border border-brand-terracotta/20 px-6 py-2 rounded-full text-sm font-bold mb-6 animate-pulse shadow-[0_0_15px_rgba(255,107,107,0.14)]">
              🎁 ESCUCHA ANTES DE PAGAR - SIN RIESGO
            </span>
            <h2 className="brand-heading text-4xl md:text-6xl mb-6">
              ¡Escucha <span className="text-brand-terracotta">ANTES</span> de Pagar!
            </h2>
            <p className="text-xl brand-muted max-w-3xl mx-auto">
              Sin riesgo. Sin compromiso. Escucha tu canción de 50 segundos. Solo pagas si te gusta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
            {/* Step 1 */}
            <div className="group relative brand-surface rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-8xl font-black text-brand-forest/10 leading-none">1</span>
              </div>
              <div className="w-16 h-16 bg-brand-forest/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-brand-forest/20">
                <MessageCircle className="w-8 h-8 text-brand-forest" />
              </div>
              <h3 className="text-2xl font-bold text-brand-ink mb-3">Cuéntanos tu historia</h3>
              <p className="brand-muted leading-relaxed">
                Comparte los detalles, anécdotas y sentimientos que quieres capturar. No necesitas ser poeta, nosotros nos encargamos de la magia.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative brand-surface rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 ring-1 ring-brand-terracotta/20">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand-terracotta text-white px-4 py-1 rounded-full text-xs font-bold shadow-[0_0_15px_rgba(255,107,107,0.34)]">
                PASO FAVORITO
              </div>
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-8xl font-black text-brand-terracotta/20 leading-none">2</span>
              </div>
              <div className="w-16 h-16 bg-brand-terracotta/15 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-brand-terracotta/20">
                <Music2 className="w-8 h-8 text-brand-terracotta" />
              </div>
              <h3 className="text-2xl font-bold text-brand-ink mb-3">Recibe tu Demo Gratis</h3>
              <p className="brand-muted leading-relaxed">
                En 24 horas recibirás una demo de 70 segundos por WhatsApp. <span className="font-bold text-brand-terracotta">Escúchala sin compromiso</span>. Solo pagas si te gusta.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative brand-surface rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-8xl font-black text-brand-bordeaux/10 leading-none">3</span>
              </div>
              <div className="w-16 h-16 bg-brand-bordeaux/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-brand-bordeaux/20">
                <Gift className="w-8 h-8 text-brand-bordeaux" />
              </div>
              <h3 className="text-2xl font-bold text-brand-ink mb-3">Regala Emoción</h3>
              <p className="brand-muted leading-relaxed">
                Si te encanta (¡que seguro lo hará!), realizas el pago y recibes la canción completa lista para dedicar y emocionar.
              </p>
            </div>
          </div>

          <div className="brand-surface rounded-3xl p-8 md:p-12 backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-terracotta/5 mix-blend-overlay"></div>
            <div className="text-center relative z-10">
              <h3 className="brand-heading text-2xl md:text-3xl mb-4">
                ✨ Sin riesgo. Sin compromiso. <span className="text-brand-terracotta">Escucha primero</span>, paga después.
              </h3>
              <p className="text-lg brand-muted mb-8 max-w-2xl mx-auto">
                Miles de clientes ya han probado nuestra demo. ¿Por qué tú no?
              </p>
              <Button
                size="lg"
                className="brand-cta text-white font-black text-lg py-8 px-10 transition-all hover:scale-105"
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
      <section className="py-12 px-4 sm:px-6 lg:px-8 brand-section">
        <div className="max-w-7xl mx-auto">
          <div className="brand-surface rounded-3xl overflow-hidden backdrop-blur-md">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-gradient-to-br from-brand-inkSoft to-brand-ink p-8 text-white border-r border-white/5">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3">🎁</span>
                  <h2 className="text-2xl md:text-3xl font-bold">Escucha Antes de Pagar</h2>
                </div>
                <p className="text-lg mb-6 text-slate-300">
                  Con nuestro modelo freemium, escuchas una demo de 70 segundos de tu canción antes de pagar. Sin riesgo. Sin compromiso.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-6 w-6 text-brand-terracotta mr-2 flex-shrink-0" />
                    <span className="font-bold">Demo de 70 segundos • Solo pagas si te gusta</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-6 w-6 text-brand-terracotta mr-2 flex-shrink-0" />
                    <span>No pagas nada hasta que te guste</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-6 w-6 text-brand-terracotta mr-2 flex-shrink-0" />
                    <span>Sin compromiso. Sin riesgo</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-6 w-6 text-brand-terracotta mr-2 flex-shrink-0" />
                    <span>Revisiones ilimitadas hasta tu aprobación</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 bg-gradient-to-br from-brand-inkSoft to-brand-bordeaux/90 p-8 text-white">
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
                <Button className="w-full brand-cta text-white font-bold py-6" asChild>
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 brand-section-deep">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">¿Por qué regalar una canción?</h2>
            <p className="mt-4 text-xl text-slate-400">Un regalo único que trasciende lo material</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: "🔥", title: "El regalo que NO terminará en el clóset", desc: "Mientras otros dan flores que se marchitan, tú darás algo que ella escuchará para siempre." },
              { icon: "👑", title: "Queda como un rey sin esfuerzo", desc: "Nosotros hacemos el trabajo difícil. Tú solo te llevas el crédito y sus lágrimas de emoción." },
              { icon: "💡", title: "No más pánico de 'se me olvidó'", desc: "¿Aniversario? ¿Cumpleaños? ¿Mesiversario? Una canción funciona para TODO." },
              { icon: "💬", title: "Di lo que no puedes decir", desc: "¿Te cuesta expresarte? Perfecto. Nuestra canción lo hará por ti (y mejor)." }
            ].map((item, i) => (
              <Card key={i} className="brand-surface backdrop-blur-sm transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center text-brand-ink">
                    <span className="text-brand-bordeaux mr-3 text-2xl">{item.icon}</span> {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="brand-muted">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 brand-section relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Historias que <span className="brand-highlight">Emocionan</span>
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
                  "Bro, le encantó. LLORÓ cuando la escuchó. Me dijo que fue el mejor regalo que le han dado en su vida. <span className="font-bold text-white bg-brand-terracotta/20 px-1">Sus amigas le preguntaron dónde lo conseguí</span>. 100% recomendado."
                </p>
              </div>
              <div className="mt-auto flex items-center border-t border-white/10 pt-6">
                <div className="w-10 h-10 bg-brand-terracotta/20 rounded-full flex items-center justify-center text-brand-terracotta font-bold text-lg mr-3">
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
                  "Mi novia siempre decía que 'no soy romántico'. Esta canción la dejó sin palabras. <span className="font-bold text-white bg-brand-terracotta/20 px-1">La subió a Instagram y todas sus amigas le preguntaron cómo conseguí un novio así</span>. Literalmente me salvó."
                </p>
              </div>
              <div className="mt-auto flex items-center border-t border-white/10 pt-6">
                <div className="w-10 h-10 bg-brand-forest/20 rounded-full flex items-center justify-center text-brand-forest font-bold text-lg mr-3">
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
                <div className="w-10 h-10 bg-brand-forest/20 rounded-full flex items-center justify-center text-brand-forest font-bold text-lg mr-3">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 brand-night text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-yellow-400 mr-2 animate-pulse"></span>
            <span className="text-yellow-300 text-sm font-bold tracking-wide uppercase">Oferta por tiempo limitado</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            ¿Listo para hacerla <br />
            <span className="brand-highlight-night">llorar de emoción?</span>
          </h2>

          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
            <span className="font-bold text-green-300">Escucha tu demo antes de pagar.</span> Sin riesgo. Sin compromiso. Solo pagas si te encanta.
          </p>

          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 mb-12 max-w-3xl mx-auto shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <p className="text-lg font-bold text-white mb-1">Tu canción personalizada incluye:</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-white/70 text-sm">
                    <Check className="w-4 h-4 text-green-400 mr-2" /> Letra 100% original basada en tu historia
                  </li>
                  <li className="flex items-center text-white/70 text-sm">
                    <Check className="w-4 h-4 text-green-400 mr-2" /> Calidad de estudio profesional
                  </li>
                  <li className="flex items-center text-white/70 text-sm">
                    <Check className="w-4 h-4 text-green-400 mr-2" /> Entrega rápida en formato digital
                  </li>
                </ul>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60 mb-1">Precio regular: <span className="line-through">$1,999</span></div>
                <div className="text-4xl font-black text-white flex items-center justify-end gap-2">
                  <HeroPriceDisplay showPrefix={false} size="lg" className="text-white" />
                  <span className="text-sm font-normal text-white/60 self-end mb-1">MXN</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <Button
              size="lg"
              className="brand-cta text-white font-bold border-t border-white/20 text-xl py-8 px-10 w-full transition-all duration-300 hover:scale-105 group"
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
              className="brand-cta-secondary border-2 border-white/20 text-white hover:bg-white/10 text-lg py-8 px-8 w-full font-bold backdrop-blur-sm"
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

          <p className="mt-6 text-sm text-white/55">
            🔒 Pago 100% seguro • Garantía de satisfacción
          </p>
        </div>
      </section>

      {/* Sticky Bottom CTA for Mobile - Only visible on mobile */}
      {/* Sticky Bottom CTA for Mobile - Only visible on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-brand-ink/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pb-safe transition-all duration-300">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">
                Solo 5 cupos hoy
              </span>
            </div>
            <div className="text-[10px] font-medium text-slate-400 bg-white/5 px-2 py-1 rounded-full border border-white/5">
              Termina en <span className="text-white font-mono">{formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}</span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full brand-cta text-white font-black text-base py-6 relative overflow-hidden group border-t border-white/20"
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
      <footer className="brand-night text-white/70 py-16 px-4 sm:px-6 lg:px-8 pb-24 md:pb-16 border-t border-white/10">
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
