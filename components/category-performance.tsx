"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { getCategoryPerformance } from "@/lib/data-service"

interface Skill {
  name: string
  score: number
}

interface CategoryPerformanceData {
  title: string
  score: number
  change: number
  tests: number
  lastTest: string
  skills: Skill[]
}

interface CategoryPerformanceProps {
  userId?: string
}

export function CategoryPerformance({ userId }: CategoryPerformanceProps) {
  const [categories, setCategories] = useState<CategoryPerformanceData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        const data = await getCategoryPerformance(userId)
        setCategories(data || [])
      } catch (error) {
        console.error("Error fetching category performance:", error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 w-24 rounded-md bg-gray-200"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-12 rounded-md bg-gray-200"></div>
                <div className="h-4 w-24 rounded-md bg-gray-200"></div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-20 rounded-md bg-gray-200"></div>
                      <div className="h-4 w-8 rounded-md bg-gray-200"></div>
                    </div>
                    <div className="h-1.5 w-full rounded-md bg-gray-200"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">
          No hay datos de rendimiento disponibles. Completa algunos tests para ver tu progreso.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {categories.map((category, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>{category.title}</CardTitle>
              <Badge variant={category.score >= 70 ? "default" : category.score >= 50 ? "secondary" : "destructive"}>
                {category.score}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                {category.change > 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : category.change < 0 ? (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                ) : null}
                <span className={category.change > 0 ? "text-green-500" : category.change < 0 ? "text-red-500" : ""}>
                  {category.change > 0 ? "+" : ""}
                  {category.change}%
                </span>
              </div>
              <div className="text-muted-foreground">
                {category.tests} test{category.tests !== 1 ? "s" : ""} • Último:{" "}
                {category.lastTest !== "N/A" ? new Date(category.lastTest).toLocaleDateString() : "N/A"}
              </div>
            </div>
            <div className="space-y-3">
              {category.skills && category.skills.length > 0 ? (
                category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{skill.name}</span>
                      <span
                        className={
                          skill.score >= 70 ? "text-green-500" : skill.score >= 50 ? "text-amber-500" : "text-red-500"
                        }
                      >
                        {skill.score}%
                      </span>
                    </div>
                    <Progress value={skill.score} className="h-1.5" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay habilidades registradas en esta categoría.</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
