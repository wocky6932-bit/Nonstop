"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    // Check if splash has already been shown in this session
    if (sessionStorage.getItem("splashShown")) {
      setIsVisible(false)
      return
    }

    // Mark as shown for the rest of the session
    sessionStorage.setItem("splashShown", "true")

    // Phase 1: Affichage du logo et de l'animation
    const timer = setTimeout(() => {
      setIsFading(true)
    }, 2500) // Durée d'affichage (2.5s)

    // Phase 2: Suppression du composant du DOM après le fade out
    const removeTimer = setTimeout(() => {
      setIsVisible(false)
    }, 3200) // 2.5s + 0.7s de transition

    return () => {
      clearTimeout(timer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-700 ease-in-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Logo animé agrandi */}
        <div className="relative h-32 w-32 sm:h-48 sm:w-48 overflow-hidden animate-in zoom-in duration-1000">
          <Image
            src="/ChatGPT Image 11 mai 2026, 22_06_22.png"
            alt="Nonstop"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Indicateur de chargement très subtil sous le logo */}
        <div className="mt-12 w-32 sm:w-48">
          <div className="h-[1px] w-full bg-gray-900 overflow-hidden">
            <div className="h-full bg-white w-1/3 animate-loading-bar" />
          </div>
        </div>
      </div>
    </div>
  )
}
