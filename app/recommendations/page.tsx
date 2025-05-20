"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getUserRecommendations } from "@/lib/data-service"
import { RecommendationCard } from "@/components/recommendation-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Recommendation } from "@/lib/types"
import {
  Loader2,
  Code,
  Server,
  Layers,
  Smartphone,
  Database,
  Shield,
  Cloud,
  Brain,
  Palette,
  GitBranch,
} from "lucide-react"

export default function RecommendationsPage() {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (user) {
        try {
          const data = await getUserRecommendations(user.id)
          if (Array.isArray(data)) {
            setRecommendations(data)
          } else {
            console.error("Recommendations data is not an array:", data)
            setRecommendations([])
          }
        } catch (error) {
          console.error("Error fetching recommendations:", error)
          setRecommendations([])
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [user])

  const handleStartCourse = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  // Obtener categorías únicas para las pestañas
  const categories = recommendations ? Array.from(new Set(recommendations.map((rec) => rec.category))) : []

  // Filtrar recomendaciones por categoría
  const filteredRecommendations =
    activeTab === "all" ? recommendations : recommendations.filter((rec) => rec.category === activeTab)

  // Obtener icono según la categoría
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      Frontend: <Code size={16} />,
      Backend: <Server size={16} />,
      Fullstack: <Layers size={16} />,
      Mobile: <Smartphone size={16} />,
      Database: <Database size={16} />,
      Security: <Shield size={16} />,
      Cloud: <Cloud size={16} />,
      IA: <Brain size={16} />,
      Design: <Palette size={16} />,
      Algorithms: <GitBranch size={16} />,
      DevOps: <GitBranch size={16} />,
    }

    return icons[category] || <Code size={16} />
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-primary">Recomendaciones de Cursos</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Cursos recomendados basados en tus resultados y perfil profesional
        </p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4 flex flex-wrap gap-2">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Layers size={16} /> Todos
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="flex items-center gap-1">
              {getCategoryIcon(category)} {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {filteredRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRecommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  title={recommendation.title}
                  description={recommendation.description}
                  category={recommendation.category}
                  difficulty={recommendation.difficulty}
                  url={recommendation.url}
                  platform={recommendation.platform}
                  onClick={() => handleStartCourse(recommendation.url)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                No hay recomendaciones disponibles para esta categoría.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
