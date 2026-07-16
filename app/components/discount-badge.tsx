import { cn } from "@/lib/utils"

interface DiscountBadgeProps {
  originalPrice: number
  discountedPrice: number
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function DiscountBadge({ originalPrice, discountedPrice, size = "md", className }: DiscountBadgeProps) {
  // Calcular el porcentaje de descuento
  const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)

  // Determinar las clases según el tamaño
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
  }

  return (
    <div className={cn("rounded-full bg-red-500 text-white font-bold animate-pulse", sizeClasses[size], className)}>
      -{discountPercentage}%
    </div>
  )
}

