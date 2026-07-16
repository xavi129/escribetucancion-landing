"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface VideoPlayerProps {
  src: string
  title?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  className?: string
  overlayText?: string
  overlaySubtext?: string
  controls?: boolean
}

export default function VideoPlayer({
  src,
  title,
  autoPlay = false,
  muted = false,
  loop = false,
  className = "",
  overlayText,
  overlaySubtext,
  controls = true,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(muted)
  const [volume, setVolume] = useState(0.7)
  const [showControls, setShowControls] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const setVideoData = () => {
      setDuration(video.duration)
    }

    const setVideoTime = () => {
      setCurrentTime(video.currentTime)
    }

    // Events
    video.addEventListener("loadeddata", setVideoData)
    video.addEventListener("timeupdate", setVideoTime)
    video.addEventListener("ended", handleEnd)

    video.muted = muted
    setIsMuted(muted)

    // Intersection Observer for Autoplay
    let observer: IntersectionObserver | null = null

    if (autoPlay) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.play().catch(() => {
                setIsPlaying(false)
              })
              setIsPlaying(true)
            } else {
              video.pause()
              setIsPlaying(false)
            }
          })
        },
        { threshold: 0.5 } // Play when 50% visible
      )
      observer.observe(video)
    }

    // Cleanup
    return () => {
      video.removeEventListener("loadeddata", setVideoData)
      video.removeEventListener("timeupdate", setVideoTime)
      video.removeEventListener("ended", handleEnd)
      cancelAnimationFrame(animationRef.current)
      if (observer) observer.disconnect()
    }
  }, [autoPlay, muted])

  const handlePlayPause = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      cancelAnimationFrame(animationRef.current)
    } else {
      videoRef.current.play().catch(() => {
        // Play was prevented
        setIsPlaying(false)
      })
      animationRef.current = requestAnimationFrame(whilePlaying)
    }
    setIsPlaying(!isPlaying)
  }

  const whilePlaying = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      animationRef.current = requestAnimationFrame(whilePlaying)
    }
  }

  const handleEnd = () => {
    if (loop) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(() => {
          setIsPlaying(false)
        })
      }
    } else {
      setIsPlaying(false)
      setCurrentTime(0)
      cancelAnimationFrame(animationRef.current)
    }
  }

  const handleTimeChange = (value: number[]) => {
    if (!videoRef.current) return

    videoRef.current.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return

    const newVolume = value[0]
    setVolume(newVolume)
    videoRef.current.volume = newVolume

    if (newVolume === 0) {
      setIsMuted(true)
      videoRef.current.muted = true
    } else if (isMuted) {
      setIsMuted(false)
      videoRef.current.muted = false
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return

    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    videoRef.current.muted = newMutedState
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div
      className={`relative rounded-lg overflow-hidden ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        playsInline
        loop={loop}
        muted={isMuted}
      />

      {/* Overlay text */}
      {(overlayText || overlaySubtext) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30 text-white p-4 text-center">
          {overlayText && <h3 className="text-2xl md:text-3xl font-bold mb-2">{overlayText}</h3>}
          {overlaySubtext && <p className="text-lg md:text-xl">{overlaySubtext}</p>}
        </div>
      )}

      {/* Video controls */}
      {controls && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="flex flex-col space-y-2">
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.01}
              onValueChange={handleTimeChange}
              className="cursor-pointer"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={handlePlayPause}
                  aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <span className="text-xs text-white">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Activar sonido' : 'Silenciar video'}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>

                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-20 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}