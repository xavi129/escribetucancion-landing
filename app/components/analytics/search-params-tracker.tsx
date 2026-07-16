"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

// Este componente se encargará específicamente de rastrear los cambios en los parámetros de búsqueda
export default function SearchParamsTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams && typeof window !== "undefined") {
      // Enviar evento a Google Analytics cuando cambian los parámetros de búsqueda
      if (window.gtag) {
        window.gtag("event", "search_params_change", {
          search_params: searchParams.toString(),
        })
      }

      // También se pueden enviar a otros trackers si es necesario
    }
  }, [searchParams])

  // Este componente no renderiza nada visible
  return null
}

