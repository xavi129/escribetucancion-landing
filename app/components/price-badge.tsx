import { cn } from "@/lib/utils"

interface PriceBadgeProps {
  price: number
  originalPrice?: number
  showDiscount?: boolean
  variant?: "default" | "discount" | "highlight"
  size?: "sm" | "md" | "lg"
  experimentId?: string
  className?: string
  prefixText?: string
}

export default function PriceBadge({
  price,
  originalPrice,
  showDiscount = true,
  variant = "default",
  size = "md",
  experimentId,
  className,
  prefixText,
}: PriceBadgeProps) {
  // Formatear el precio con separador de miles
  const formattedPrice = price.toLocaleString("es-MX")
  const formattedOriginalPrice = originalPrice?.toLocaleString("es-MX")

  // Calcular el porcentaje de descuento
  const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  // Determinar las clases según la variante y tamaño
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  return (
    <div className={cn("flex items-center gap-2", className)} data-experiment-id={experimentId}>
      {prefixText && <span className="text-white">{prefixText}</span>}

      {originalPrice && originalPrice > price && (
        <span className={cn("text-white/80 line-through whitespace-nowrap", sizeClasses[size] === "text-lg" ? "text-base" : "text-sm")}>
          ${formattedOriginalPrice} MXN
        </span>
      )}

      <span className={cn("bg-white text-black font-bold px-2 py-1 rounded-full whitespace-nowrap", sizeClasses[size])}>
        ${formattedPrice} MXN
      </span>

      {showDiscount && discountPercentage > 0 && (
        <span className="bg-red-500 text-white font-bold px-2 py-1 rounded-full text-sm animate-pulse">
          -{discountPercentage}%
        </span>
      )}
    </div>
  )
}

