"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import type React from "react"

interface FormHeaderProps {
  title: string
  description: string
  action?: React.ReactNode
}

export default function FormHeader({ title, description, action }: FormHeaderProps) {
  const isMobile = useIsMobile()

  // Nunca mostrar en mobile
  if (isMobile) {
    return null
  }

  return (
    <div className="text-center mb-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="brand-heading-night text-3xl flex-1">{title}</h1>
        {action && <div className="ml-4">{action}</div>}
      </div>
      <p className="mt-2 text-slate-400">{description}</p>
    </div>
  )
}

