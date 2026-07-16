"use client"

import { memo, useState, useEffect } from "react"

interface EmojiProps {
  /** The emoji character to render (e.g., "🎵", "🎁") */
  emoji: string
  /** Size in pixels or CSS value (default: "1em") */
  size?: string | number
  /** Additional CSS classes */
  className?: string
  /** Alt text for accessibility (defaults to emoji) */
  alt?: string
}

/**
 * Converts an emoji string to its Twemoji CDN URL
 * Handles multi-codepoint emojis (like flags, skin tones, ZWJ sequences)
 */
function getEmojiUrl(emoji: string): string {
  const codePoints = [...emoji]
    .map((char) => char.codePointAt(0)?.toString(16))
    .filter((cp): cp is string => cp !== undefined)
    // Filter out variation selectors (FE0F) for cleaner URLs
    .filter((cp) => cp !== "fe0f")
    .join("-")

  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/${codePoints}.svg`
}

/**
 * Emoji component that renders consistent Twemoji across all platforms
 * Uses Twitter's emoji set via CDN for cross-platform consistency
 * Falls back to native emoji if Twemoji image fails to load
 */
function EmojiComponent({ emoji, size = "1em", className = "", alt }: EmojiProps) {
  const [imageError, setImageError] = useState(false)
  const url = getEmojiUrl(emoji)
  const sizeValue = typeof size === "number" ? `${size}px` : size

  // Reset imageError when emoji prop changes to retry loading new Twemoji URL
  useEffect(() => {
    setImageError(false)
  }, [emoji])

  // If image failed to load, render native emoji
  if (imageError) {
    return (
      <span
        className={`inline-block align-middle ${className}`}
        style={{
          fontSize: sizeValue,
          lineHeight: 1,
        }}
        role="img"
        aria-label={alt || emoji}
      >
        {emoji}
      </span>
    )
  }

  return (
    <img
      src={url}
      alt={alt || emoji}
      className={`inline-block align-middle ${className}`}
      style={{
        width: sizeValue,
        height: sizeValue,
      }}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setImageError(true)}
    />
  )
}

// Memoize to prevent unnecessary re-renders
export const Emoji = memo(EmojiComponent)
Emoji.displayName = "Emoji"

export default Emoji
