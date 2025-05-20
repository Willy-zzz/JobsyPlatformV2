"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

interface RecommendationCardProps {
  title: string
  description: string
  category: string
  difficulty: string
  url: string
  platform: string
  onClick: () => void
}

// Función para determinar el color de fondo según la categoría
const getCategoryColor = (category: string) => {
  const categories: Record<string, string> = {
    Frontend: "from-blue-500 to-indigo-600",
    Backend: "from-green-500 to-emerald-600",
    Fullstack: "from-purple-500 to-violet-600",
    Mobile: "from-orange-500 to-amber-600",
    DevOps: "from-red-500 to-rose-600",
    Database: "from-cyan-500 to-sky-600",
    Security: "from-slate-500 to-gray-600",
    Cloud: "from-blue-400 to-sky-500",
    IA: "from-fuchsia-500 to-pink-600",
    Design: "from-emerald-400 to-teal-500",
    Algorithms: "from-yellow-500 to-amber-600",
  }

  return categories[category] || "from-gray-500 to-slate-600"
}

// Función para determinar la variante del badge según la dificultad
const getDifficultyVariant = (difficulty: string) => {
  const variants: Record<string, string> = {
    Principiante: "principiante",
    Intermedio: "intermedio",
    Avanzado: "avanzado",
  }

  return variants[difficulty] || "default"
}

// Función para determinar la variante del badge según la categoría
const getCategoryVariant = (category: string) => {
  // Verificar que category no sea undefined antes de llamar a toLowerCase()
  if (!category) return "default"

  const categoryLower = category.toLowerCase()
  const variants: Record<string, string> = {
    frontend: "frontend",
    backend: "backend",
    fullstack: "fullstack",
    mobile: "mobile",
    devops: "devops",
    database: "database",
    security: "security",
    cloud: "cloud",
    ia: "ia",
    design: "design",
    algorithms: "algorithms",
  }

  return variants[categoryLower] || "default"
}

// Función para determinar el logo según la plataforma
const getPlatformLogo = (platform: string) => {
  // Verificar que platform no sea undefined
  if (!platform) return "🔗"

  const logos: Record<string, string> = {
    Coursera: "🎓",
    Udemy: "🧠",
    Netacad: "🌐",
    freeCodeCamp: "🔥",
    "MongoDB University": "🍃",
    "Microsoft Learn": "🪟",
    "Google Developers": "🔍",
    "AWS Training": "☁️",
    "Documentación oficial": "📚",
  }

  return logos[platform] || "🔗"
}

export function RecommendationCard({
  title = "Curso recomendado",
  description = "Descripción del curso",
  category = "General",
  difficulty = "Intermedio",
  url = "#",
  platform = "Plataforma",
  onClick,
}: RecommendationCardProps) {
  const categoryColor = getCategoryColor(category)
  const difficultyVariant = getDifficultyVariant(difficulty)
  const categoryVariant = getCategoryVariant(category)
  const platformLogo = getPlatformLogo(platform)

  // Función para manejar el clic en el botón
  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick()
    } else if (url) {
      // Si no se proporciona onClick pero hay una URL, abrimos la URL en una nueva pestaña
      window.open(url, "_blank")
    }
  }

  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:ring-1 hover:ring-primary/20">
      <CardHeader className={`bg-gradient-to-r ${categoryColor} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <Badge variant={difficultyVariant}>{difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{description}</p>
        <div className="flex items-center justify-between">
          <Badge variant={categoryVariant} className="bg-primary/5 text-primary">
            {category}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>{platformLogo}</span>
            <span>{platform}</span>
          </div>
        </div>
        <button
          onClick={handleClick}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary p-2 text-white transition-colors hover:bg-primary/90"
        >
          Iniciar curso <ExternalLink size={16} />
        </button>
      </CardContent>
    </Card>
  )
}
