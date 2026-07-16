"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { trackSongPlay } from "@/app/utils/analytics"

interface AudioPlayerProps {
  src: string
  title: string
  artist?: string
  genre?: string
}

export default function AudioPlayer({ src, title, artist, genre }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number>(0)
  const [hasTrackedPlay, setHasTrackedPlay] = useState(false)
  const [hasTrackedComplete, setHasTrackedComplete] = useState(false)

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
          song_genre: genre || "unknown",
        })
        setHasTrackedComplete(true)
      }
    }

    // Events
    audio.addEventListener("loadeddata", setAudioData)
    audio.addEventListener("timeupdate", setAudioTime)
    audio.addEventListener("ended", handleEnd)

    // Cleanup
    return () => {
      audio.removeEventListener("loadeddata", setAudioData)
      audio.removeEventListener("timeupdate", setAudioTime)
      audio.removeEventListener("ended", handleEnd)
      cancelAnimationFrame(animationRef.current)
    }
  }, [title, genre, hasTrackedComplete])

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
        trackSongPlay(title, genre)
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

  const handleEnd = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    cancelAnimationFrame(animationRef.current)
    setHasTrackedComplete(false) // Reiniciar para la próxima reproducción
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
    <div className="bg-white rounded-lg shadow-md p-4 w-full">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-800">{title}</h3>
            <div className="flex items-center text-sm text-gray-500">
              {artist && <span className="mr-2">{artist}</span>}
              {genre && <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">{genre}</span>}
            </div>
          </div>

          <Button
            onClick={handlePlayPause}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-purple-100 hover:bg-purple-200 border-purple-200"
            aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
          >
            {isPlaying ? <Pause className="h-5 w-5 text-purple-800" /> : <Play className="h-5 w-5 text-purple-800" />}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 w-10 text-right">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.01}
            onValueChange={handleTimeChange}
            className="flex-1"
          />
          <span className="text-xs text-gray-500 w-10">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={toggleMute} variant="ghost" size="icon" className="h-8 w-8" aria-label={isMuted ? 'Activar sonido' : 'Silenciar audio'}>
            {isMuted ? <VolumeX className="h-4 w-4 text-gray-500" /> : <Volume2 className="h-4 w-4 text-gray-500" />}
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
  )
}

// Importar trackEvent para el evento de finalización
import { trackEvent } from "@/app/utils/analytics"

