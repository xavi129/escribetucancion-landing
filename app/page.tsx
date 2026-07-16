import dynamic from "next/dynamic"
import LandingPageOriginal from "./components/LandingPageOriginal"

// Set this to false to revert to the original design
const IS_VALENTINE_SEASON = false
const IS_NEW_YEAR_SEASON = false
const IS_CHRISTMAS_SEASON = false // Kept for reference or quick fallback

// Lazy load seasonal components only when needed (reduces main bundle)
const LandingPageValentine = dynamic(() => import("./components/LandingPageValentine"))
const LandingPageNewYear = dynamic(() => import("./components/LandingPageNewYear"))
const LandingPageChristmas = dynamic(() => import("./components/LandingPageChristmas"))

export default function Home() {
  if (IS_VALENTINE_SEASON) {
    return <LandingPageValentine />
  }

  if (IS_NEW_YEAR_SEASON) {
    return <LandingPageNewYear />
  }

  if (IS_CHRISTMAS_SEASON) {
    return <LandingPageChristmas />
  }

  return <LandingPageOriginal />
}
