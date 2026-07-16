"use client"

import { useEffect, useState } from "react"
import { initializeStatsig, logEvent } from "@/app/utils/statsig"
import { v4 as uuidv4 } from "uuid"

export default function StatsigProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Guard against SSR and ensure localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    const initStatsig = async () => {
      // Get or create a user ID from localStorage
      let userID = localStorage.getItem("statsig_user_id")
      if (!userID) {
        userID = uuidv4()
        localStorage.setItem("statsig_user_id", userID)
      }

      try {
        await initializeStatsig(userID)
        setIsInitialized(true)

        // Log page view event
        await logEvent("page_view", undefined, {
          path: window.location.pathname,
          referrer: document.referrer || "direct",
        })
      } catch (error) {
        console.error("Failed to initialize Statsig:", error)
      }
    }

    initStatsig()
  }, [])

  // You could show a loading state here if needed
  return <>{children}</>
}

