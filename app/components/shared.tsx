"use client"

import type { CSSProperties, ReactNode } from "react"
import { Pause, Play, Star } from "lucide-react"
import { cn } from "@/lib/utils"

export const PALETTE = {
  paper: "#f3f0f7",
  paperDeep: "#e6e0ed",
  ink: "#1a1530",
  inkSoft: "#2d2547",
  muted: "#6b6485",
  cream: "#ffffff",
  terracotta: "#ff6b6b",
  terracottaDeep: "#e04a4a",
  bordeaux: "#a83264",
  forest: "#5b4ce0",
  gold: "#f4b860",
} as const

const placeholderTones = {
  warm: { bg: "#e6e0ed", stripe: "#d8d0e2", text: "#6b6485" },
  deep: { bg: "#2d2547", stripe: "#3a3155", text: "#c9c2d9" },
  forest: { bg: "#5b4ce0", stripe: "#6b5ce8", text: "#e6e0ff" },
} as const

type PlaceholderTone = keyof typeof placeholderTones

export function Placeholder({
  label,
  ratio = "4/3",
  tone = "warm",
  className,
}: {
  label: string
  ratio?: string
  tone?: PlaceholderTone
  className?: string
}) {
  const colors = placeholderTones[tone]

  return (
    <div
      className={cn("brand-placeholder", className)}
      style={
        {
          "--placeholder-bg": colors.bg,
          "--placeholder-stripe": colors.stripe,
          "--placeholder-text": colors.text,
          aspectRatio: ratio,
        } as CSSProperties
      }
    >
      <span>{label}</span>
    </div>
  )
}

function seededHeight(index: number, seed: number) {
  const x = Math.sin((index + 1) * 12.9898 + seed * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export function Waveform({
  color = PALETTE.terracotta,
  height = 96,
  bars = 64,
  playing = false,
  progress = 0.5,
  seed = 3,
  className,
}: {
  color?: string
  height?: number
  bars?: number
  playing?: boolean
  progress?: number
  seed?: number
  className?: string
}) {
  const barWidth = 3
  const gap = 4
  const width = bars * barWidth + (bars - 1) * gap
  const safeProgress = Math.max(0, Math.min(1, progress))

  return (
    <svg
      className={className}
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {Array.from({ length: bars }).map((_, index) => {
        const envelope = 0.36 + 0.64 * Math.sin((Math.PI * index) / Math.max(1, bars - 1))
        const variance = 0.35 + seededHeight(index, seed) * 0.65
        const activePulse = playing ? 1 + Math.sin(index * 0.7) * 0.08 : 1
        const barHeight = Math.max(8, height * envelope * variance * activePulse)
        const y = (height - barHeight) / 2
        const isPast = index / bars <= safeProgress

        return (
          <rect
            key={index}
            x={index * (barWidth + gap)}
            y={Number(y.toFixed(4))}
            width={barWidth}
            height={Number(barHeight.toFixed(4))}
            rx="1.5"
            fill={isPast ? color : `${color}54`}
            style={{ transition: "height 0.6s ease, y 0.6s ease" }}
          />
        )
      })}
    </svg>
  )
}

export function PlayPill({
  playing,
  onClick,
  label,
  color = PALETTE.terracotta,
  textColor = "#ffffff",
  size = "md",
  className,
}: {
  playing?: boolean
  onClick?: () => void
  label: string
  color?: string
  textColor?: string
  size?: "sm" | "md"
  className?: string
}) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-[18px] w-[18px]"

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("brand-play-pill", size === "sm" ? "text-xs" : "text-sm", className)}
      style={{ backgroundColor: color, color: textColor }}
    >
      <span className="brand-play-pill-icon">
        {playing ? <Pause className={iconSize} /> : <Play className={cn(iconSize, "fill-current")} />}
      </span>
      {label}
    </button>
  )
}

export function Stamp({
  children,
  color = PALETTE.bordeaux,
  rotate = -8,
  size = 92,
  className,
}: {
  children: ReactNode
  color?: string
  rotate?: number
  size?: number
  className?: string
}) {
  return (
    <div
      className={cn("brand-stamp", className)}
      style={
        {
          color,
          width: size,
          height: size,
          transform: `rotate(${rotate}deg)`,
          fontSize: size * 0.18,
        } as CSSProperties
      }
    >
      {children}
    </div>
  )
}

export function Stars({
  n = 5,
  color = PALETTE.gold,
  size = 14,
  className,
}: {
  n?: number
  color?: string
  size?: number
  className?: string
}) {
  return (
    <div className={cn("flex", className)}>
      {Array.from({ length: n }).map((_, index) => (
        <Star key={index} width={size} height={size} color={color} fill={color} />
      ))}
    </div>
  )
}
