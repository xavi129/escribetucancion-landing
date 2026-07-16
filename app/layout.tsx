import type React from "react"
import { Caveat, Fraunces, Inter_Tight } from "next/font/google"
import "./globals.css"
import "react-phone-number-input/style.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "./components/navbar"
import AnalyticsProvider from "./components/analytics/analytics-provider"
import { Suspense } from "react"
import SearchParamsTracker from "./components/analytics/search-params-tracker"
import WhatsappButton from "./components/whatsapp-button"
import StatsigProvider from "./components/statsig-provider"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
})

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f0f7" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1530" },
  ],
}

export const metadata = {
  title: "Convierte en musica los momentos compartidos - EscribeTuCancion.com",
  description: "Su nombre, historia y recuerdos juntos en una canción.",
  keywords: "canción personalizada, regalo para novia, regalo original, canción de amor, regalo aniversario, canción para dedicar, regalo romántico méxico",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Convierte en musica los momentos compartidos",
    description: "Su nombre, historia y recuerdos juntos en una canción.",
    type: "website",
    locale: "es_MX",
    siteName: "EscribeTuCancion",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convierte en musica los momentos compartidos",
    description: "Su nombre, historia y recuerdos juntos en una canción.",
  },
  alternates: {
    canonical: "https://escribetucancion.com",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EscribeTuCancion",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${interTight.variable} ${fraunces.variable} ${caveat.variable}`}>
        <StatsigProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <Suspense fallback={null}>
              <AnalyticsProvider />
              <SearchParamsTracker />
            </Suspense>
            {/* <Navbar /> */}
            {children}
            {/* <WhatsappButton /> */}
          </ThemeProvider>
        </StatsigProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

