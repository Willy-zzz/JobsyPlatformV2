import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { AppInitializer } from "@/components/app-initializer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "JOBSY - Plataforma de Evaluación de Habilidades Técnicas",
  description:
    "Evalúa tus habilidades, identifica áreas de mejora y recibe recomendaciones personalizadas para destacar en el mundo de la programación.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <AppInitializer />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
