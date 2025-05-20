"use client"

import { useEffect } from "react"
import { initializeLocalStorage } from "@/lib/data-service"

export function AppInitializer() {
  useEffect(() => {
    try {
      // Initialize localStorage with default data
      initializeLocalStorage()
    } catch (error) {
      console.error("Error initializing app:", error)
    }
  }, [])

  return null
}
