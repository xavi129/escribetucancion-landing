"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Repeat, Shuffle, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { trackEvent } from "@/app/utils/analytics"
import { cn } from "@/lib/utils"

interface NanoPlayerProps {
    src: string
    title: string
    artist?: string
    genre?: string
    autoPlay?: boolean
    onNext?: () => void
    onPrev?: () => void
}

export default function NanoPlayer({
    src,
    title,
    artist = "EscribeTuCancion Artist",
    genre = "Personalizada",
    autoPlay = false,
    onNext,
    onPrev
}: NanoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [isMuted, setIsMuted] = useState(false)
    const [volume, setVolume] = useState(0.8)
    const [isLiked, setIsLiked] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const animationRef = useRef<number>(0)
    const [hasTrackedPlay, setHasTrackedPlay] = useState(false)
    const [hasTrackedComplete, setHasTrackedComplete] = useState(false)

    // Reset state when src changes
    useEffect(() => {
        setIsPlaying(false)
        setCurrentTime(0)
        setHasTrackedPlay(false)
        setHasTrackedComplete(false)

        if (autoPlay && audioRef.current) {
            // Small timeout to ensure DOM is ready and avoid race conditions
            const timer = setTimeout(() => {
                audioRef.current?.play().then(() => {
                    setIsPlaying(true)
                    animationRef.current = requestAnimationFrame(whilePlaying)
                }).catch(e => console.log("Autoplay prevented:", e))
            }, 100)
            return () => clearTimeout(timer)
        }
    }, [src, autoPlay])

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const setAudioData = () => {
            setDuration(audio.duration)
        }

        const setAudioTime = () => {
            setCurrentTime(audio.currentTime)

            // Rastrear cuando se completa la reproducción (más del 90%)
            if (!hasTrackedComplete && audio.currentTime > audio.duration * 0.9) {
                trackEvent("song_demo_complete", {
                    song_title: title,
                    song_genre: genre,
                })
                setHasTrackedComplete(true)
            }
        }

        const handleEnded = () => {
            setIsPlaying(false)
            cancelAnimationFrame(animationRef.current)
            if (onNext) onNext()
        }

        // Events
        audio.addEventListener("loadeddata", setAudioData)
        audio.addEventListener("timeupdate", setAudioTime)
        audio.addEventListener("ended", handleEnded)

        // Cleanup
        return () => {
            audio.removeEventListener("loadeddata", setAudioData)
            audio.removeEventListener("timeupdate", setAudioTime)
            audio.removeEventListener("ended", handleEnded)
            cancelAnimationFrame(animationRef.current)
        }
    }, [title, genre, hasTrackedComplete, onNext])

    const handlePlayPause = () => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
            cancelAnimationFrame(animationRef.current)
        } else {
            audioRef.current.play()
            animationRef.current = requestAnimationFrame(whilePlaying)

            // Rastrear la primera reproducción
            if (!hasTrackedPlay) {
                trackEvent("song_demo_play", {
                    song_title: title,
                    song_genre: genre,
                })
                setHasTrackedPlay(true)
            }
        }
        setIsPlaying(!isPlaying)
    }

    const whilePlaying = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
            animationRef.current = requestAnimationFrame(whilePlaying)
        }
    }

    const handleTimeChange = (value: number[]) => {
        if (!audioRef.current) return

        audioRef.current.currentTime = value[0]
        setCurrentTime(value[0])
    }

    const handleVolumeChange = (value: number[]) => {
        if (!audioRef.current) return

        const newVolume = value[0]
        setVolume(newVolume)
        audioRef.current.volume = newVolume

        if (newVolume === 0) {
            setIsMuted(true)
        } else {
            setIsMuted(false)
        }
    }

    const toggleMute = () => {
        if (!audioRef.current) return

        if (isMuted) {
            audioRef.current.volume = volume
            setIsMuted(false)
        } else {
            audioRef.current.volume = 0
            setIsMuted(true)
        }
    }

    // Format time in minutes and seconds
    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00"

        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`
    }

    return (
        <div className="w-full mx-auto">
            <audio ref={audioRef} src={src} preload="metadata" />

            {/* Main Player Card */}
            <div className="relative overflow-hidden rounded-3xl brand-night shadow-2xl border border-white/10">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-inkSoft/80 via-brand-ink to-brand-ink z-0"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-forest/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-terracotta/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                {/* Content */}
                <div className="relative z-10 p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center">

                        {/* Album Art / Visualizer */}
                        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0 group">
                            <div className={cn(
                                "absolute inset-0 rounded-full bg-gradient-to-tr from-brand-terracotta to-brand-forest blur-xl opacity-40 transition-all duration-1000",
                                isPlaying ? "scale-110 opacity-60 animate-pulse-slow" : "scale-100"
                            )}></div>
                            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-brand-inkSoft flex items-center justify-center">
                                {/* Simulated Visualizer Bars */}
                                <div className="flex items-end justify-center gap-1 h-24 w-full px-8">
                                    {[...Array(12)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "w-2 bg-gradient-to-t from-brand-forest to-brand-terracotta rounded-t-sm transition-all duration-150 ease-out",
                                                isPlaying ? "animate-music-bar" : "h-2"
                                            )}
                                            style={{
                                                animationDelay: `${i * 0.1}s`,
                                                animationDuration: `${0.5 + (i % 3) * 0.2}s`,
                                                height: isPlaying ? 'auto' : '10%'
                                            }}
                                        ></div>
                                    ))}
                                </div>

                                {/* Genre Badge Overlay */}
                                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                    <span className="text-xs font-bold text-white tracking-wider uppercase">{genre}</span>
                                </div>
                            </div>
                        </div>

                        {/* Controls & Info */}
                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">{title}</h3>
                                    <p className="text-lg text-slate-400 font-medium">{artist}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className={cn("text-white/60 hover:text-brand-bordeaux hover:bg-brand-bordeaux/10 transition-colors", isLiked && "text-brand-bordeaux")}
                                        onClick={() => setIsLiked(!isLiked)}
                                        aria-label={isLiked ? 'Quitar favorito' : 'Marcar favorito'}
                                    >
                                        <Heart className={cn("w-6 h-6", isLiked && "fill-current")} />
                                    </Button>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-6 mt-6 group">
                                <Slider
                                    value={[currentTime]}
                                    max={duration || 100}
                                    step={0.01}
                                    onValueChange={handleTimeChange}
                                    className="cursor-pointer"
                                />
                                <div className="flex justify-between text-xs font-medium text-white/50 mt-2 group-hover:text-white/70 transition-colors">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Main Controls */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-white/60 hover:text-white hover:bg-white/10"
                                        onClick={onPrev}
                                        disabled={!onPrev}
                                        aria-label="Anterior demo"
                                    >
                                        <SkipBack className="w-6 h-6" />
                                    </Button>

                                    <Button
                                        onClick={handlePlayPause}
                                        className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-brand-terracotta text-white hover:bg-brand-terracottaDeep hover:text-white hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center"
                                        aria-label={isPlaying ? 'Pausar demo' : 'Reproducir demo'}
                                    >
                                        {isPlaying ? (
                                            <Pause className="h-6 w-6 sm:h-8 sm:w-8 fill-current" />
                                        ) : (
                                            <Play className="h-6 w-6 sm:h-8 sm:w-8 fill-current ml-1" />
                                        )}
                                    </Button>

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-white/60 hover:text-white hover:bg-white/10"
                                        onClick={onNext}
                                        disabled={!onNext}
                                        aria-label="Siguiente demo"
                                    >
                                        <SkipForward className="w-6 h-6" />
                                    </Button>
                                </div>

                                {/* Volume Control */}
                                <div className="hidden sm:flex items-center gap-3 bg-black/20 p-2 rounded-full border border-white/5">
                                    <Button onClick={toggleMute} variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white" aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}>
                                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                    </Button>
                                    <Slider
                                        value={[isMuted ? 0 : volume]}
                                        max={1}
                                        step={0.01}
                                        onValueChange={handleVolumeChange}
                                        className="w-24"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @keyframes music-bar {
          0% { height: 10%; }
          50% { height: 100%; }
          100% { height: 10%; }
        }
        .animate-music-bar {
          animation: music-bar 1s infinite ease-in-out alternate;
        }
        .animate-pulse-slow {
            animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
        </div>
    )
}
