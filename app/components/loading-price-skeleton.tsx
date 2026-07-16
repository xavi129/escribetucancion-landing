"use client"

import { cn } from "@/lib/utils"

interface LoadingPriceSkeletonProps {
  className?: string
  width?: string
  height?: string
  animate?: boolean
  rounded?: "none" | "sm" | "md" | "lg" | "full"
  variant?: "price" | "text" | "button"
}

export default function LoadingPriceSkeleton({
  className,
  width = "w-24",
  height = "h-6",
  animate = true,
  rounded = "md",
  variant = "price",
}: LoadingPriceSkeletonProps) {
  // Mapeo de variantes de bordes redondeados
  const roundedClasses = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }

  // Variantes de esqueletos
  const variantClasses = {
    price: `${width} ${height} bg-gray-200`,
    text: `${width} ${height} bg-gray-100`,
    button: `${width} ${height} bg-green-100`,
  }

  return (
    <div
      className={cn(
        variantClasses[variant],
        roundedClasses[rounded],
        animate ? "animate-pulse" : "",
        className
      )}
      aria-hidden="true"
    >
      <span className="sr-only">Cargando...</span>
    </div>
  )
}