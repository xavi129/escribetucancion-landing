"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import NanoPlayer from "./nano-player"
import { Play, Music, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

const demoSongs = [
  {
    id: 1,
    title: "Aniversario (Romántica)",
    artist: "EscribeTuCancion",
    genre: "Balada",
    src: "https://cdn.escribetucancion.com/demos/demosBodas.mp3",
    duration: "1:55"
  },
  {
    id: 2,
    title: "Declaración de Amor",
    artist: "EscribeTuCancion",
    genre: "Pop",
    src: "https://cdn.escribetucancion.com/demos/demoDeclaracion.mp3",
    duration: "1:50"
  },
  {
    id: 3,
    title: "Perdóname (Balada)",
    artist: "EscribeTuCancion",
    genre: "Balada",
    src: "https://cdn.escribetucancion.com/demos/demoPerdoname.mp3",
    duration: "1:40"
  },


  {
    id: 4,
    title: "Para mi Novia (Banda)",
    artist: "EscribeTuCancion",
    genre: "Banda",
    src: "https://cdn.escribetucancion.com/demos/demoRegionalMexicano.mp3",
    duration: "2:20"
  },
  {
    id: 5,
    title: "Reggaeton Romántico",
    artist: "EscribeTuCancion",
    genre: "Reggaeton",
    src: "https://cdn.escribetucancion.com/demos/demourbano.mp3",
    duration: "2:00"
  },
  {
    id: 6,
    title: "Corridos Tumbados",
    artist: "EscribeTuCancion",
    genre: "Tumbado",
    src: "https://cdn.escribetucancion.com/demos/demoTumbado.mp3",
    duration: "1:45"
  },
  {
    id: 7,
    title: "Día de las Madres",
    artist: "EscribeTuCancion",
    genre: "Mariachi",
    src: "https://cdn.escribetucancion.com/demos/demomadre.mp3",
    duration: "1:45"
  },
  {
    id: 8,
    title: "Día del Padre",
    artist: "EscribeTuCancion",
    genre: "Regional Mexicano",
    src: "https://cdn.escribetucancion.com/demos/demopadre.mp3",
    duration: "2:10"
  },
  {
    id: 9,
    title: "San Valentín",
    artist: "EscribeTuCancion",
    genre: "Balada",
    src: "https://cdn.escribetucancion.com/demos/demosanvalentin.mp3",
    duration: "2:05"
  },
  {
    id: 10,
    title: "Agradecimiento Profundo",
    artist: "EscribeTuCancion",
    genre: "Balada",
    src: "https://cdn.escribetucancion.com/demos/demoAgradecimientoProfundo%2Cmp3.mp3",
    duration: "2:15"
  },
  {
    id: 11,
    title: "Cumpleaños",
    artist: "EscribeTuCancion",
    genre: "Pop",
    src: "https://cdn.escribetucancion.com/demos/democuple.mp3",
    duration: "1:30"
  },
  {
    id: 12,
    title: "Despedida de Soltero",
    artist: "EscribeTuCancion",
    genre: "Urbano",
    src: "https://cdn.escribetucancion.com/demos/demoDespedidadeSoltero.mp3",
    duration: "2:00"
  },
  {
    id: 13,
    title: "Rock",
    artist: "EscribeTuCancion",
    genre: "Rock",
    src: "https://cdn.escribetucancion.com/demos/demoRock.mp3",
    duration: "1:55"
  },
  {
    id: 14,
    title: "Pop Contemporáneo",
    artist: "EscribeTuCancion",
    genre: "Pop",
    src: "https://cdn.escribetucancion.com/demos/demoPop.mp3",
    duration: "2:05"
  },
  {
    id: 15,
    title: "Bachata",
    artist: "EscribeTuCancion",
    genre: "Bachata",
    src: "https://cdn.escribetucancion.com/demos/demoBachata.mp3",
    duration: "2:10"
  },
]

interface DemosSectionProps {
  autoplayIndex?: number | null
  autoplayId?: number | null
  onAutoplayStart?: () => void
}

export default function DemosSection({ autoplayIndex, autoplayId, onAutoplayStart }: DemosSectionProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)

  const currentSong = demoSongs[currentSongIndex]

  const handleSongSelect = (index: number) => {
    setCurrentSongIndex(index)
    setAutoPlay(true)
    setIsPlaying(true)
  }

  const handleNext = () => {
    const nextIndex = (currentSongIndex + 1) % demoSongs.length
    setCurrentSongIndex(nextIndex)
    setAutoPlay(true)
  }

  const handlePrev = () => {
    const prevIndex = (currentSongIndex - 1 + demoSongs.length) % demoSongs.length
    setCurrentSongIndex(prevIndex)
    setAutoPlay(true)
  }

  // Accept both autoplayIndex (legacy) and autoplayId (preferred)
  useEffect(() => {
    // If an autoplayId is supplied, map to index first
    if (typeof autoplayId !== 'undefined' && autoplayId !== null) {
      const idxById = demoSongs.findIndex((s) => s.id === autoplayId)
      if (idxById >= 0) {
        setCurrentSongIndex(idxById)
        setAutoPlay(true)
        setIsPlaying(true)
        if (typeof onAutoplayStart === 'function') onAutoplayStart()
        return
      }
    }

    // Otherwise fallback to autoplayIndex (legacy behavior)
    if (typeof autoplayIndex !== 'undefined' && autoplayIndex !== null) {
      const idx = Math.max(0, Math.min(demoSongs.length - 1, autoplayIndex))
      setCurrentSongIndex(idx)
      setAutoPlay(true)
      setIsPlaying(true)
      if (typeof onAutoplayStart === 'function') onAutoplayStart()
    }
  }, [autoplayIndex, autoplayId])

  return (
    <section id="demos" className="py-20 px-4 sm:px-6 lg:px-8 brand-section-deep relative overflow-hidden" style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.svg')] opacity-5 mix-blend-soft-light pointer-events-none transform-gpu"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-forest/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-terracotta/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="brand-kicker text-sm mb-2 block">Escucha Antes de Decidir</span>
          <h2 className="brand-heading text-3xl md:text-5xl mb-4">
            Ejemplos <span className="brand-highlight">Reales</span>
          </h2>
          <p className="mt-4 text-xl brand-muted max-w-2xl mx-auto">
            Canciones de clientes reales. Dale play y escucha la calidad profesional que recibirás.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Player Area */}
          <div className="lg:col-span-7 xl:col-span-8 sticky top-8">
            <NanoPlayer
              src={currentSong.src}
              title={currentSong.title}
              artist={currentSong.artist}
              genre={currentSong.genre}
              autoPlay={autoPlay}
              onNext={handleNext}
              onPrev={handlePrev}
            />

            <div className="mt-8 brand-surface backdrop-blur-md rounded-2xl p-6 hidden lg:block">
              <h4 className="text-brand-ink font-bold mb-2 flex items-center gap-2">
                <Music className="w-5 h-5 text-brand-terracotta" />
                ¿Por qué {currentSong.genre}?
              </h4>
              <p className="brand-muted text-sm leading-relaxed">
                Este estilo es perfecto para que ella sienta cada palabra. Calidad de estudio profesional
                con instrumentos reales. No es una canción generada por IA, es producción 100% humana
                que garantiza que suene increíble en cualquier dispositivo.
              </p>
            </div>
          </div>

          {/* Playlist Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-[600px] brand-surface backdrop-blur-md rounded-3xl overflow-hidden">
            <div className="p-4 border-b border-brand-forest/10 bg-brand-cream/60">
              <h3 className="text-brand-ink font-bold flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-brand-terracotta animate-pulse"></span>
                Lista de Reproducción
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {demoSongs.map((song, index) => {
                const isActive = currentSongIndex === index
                return (
                  <button
                    key={song.id}
                    onClick={() => handleSongSelect(index)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left group",
                      isActive
                        ? "bg-brand-paperDeep border border-brand-forest/20 shadow-lg"
                        : "hover:bg-brand-paperDeep/70 border border-transparent hover:border-brand-forest/10"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                      isActive ? "bg-brand-terracotta text-white" : "bg-brand-paperDeep text-brand-muted group-hover:text-brand-ink"
                    )}>
                      {isActive && isPlaying ? (
                        <div className="flex gap-0.5 h-3 items-end">
                          <div className="w-0.5 bg-white animate-music-bar" style={{ animationDelay: '0s' }}></div>
                          <div className="w-0.5 bg-white animate-music-bar" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-0.5 bg-white animate-music-bar" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={cn(
                        "font-bold text-sm truncate transition-colors",
                        isActive ? "text-brand-ink" : "text-brand-inkSoft group-hover:text-brand-ink"
                      )}>
                        {song.title}
                      </h4>
                      <p className="text-xs text-brand-muted truncate">{song.genre}</p>
                    </div>

                    <div className="text-xs text-brand-muted font-medium tabular-nums">
                      {song.duration}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="brand-muted mb-4">
            Todas nuestras producciones son 100% originales desde la letra hasta la producción musical
          </p>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  )
}


