// Update the statistics page to show more detailed data

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, ArrowUp, ArrowDown, Minus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getUserTestResults, getCategoryPerformance, getUserSkills } from "@/lib/data-service"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PerformanceChart } from "@/components/performance-chart"
import { ComparisonChart } from "@/components/comparison-chart"
import { SkillsChart } from "@/components/skills-chart"
import { SkillsRadarChart } from "@/components/skills-radar-chart"
import { Progress } from "@/components/ui/progress"
import type { TestResult, CategoryPerformanceData, Skill } from "@/lib/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function StatisticsPage() {
  const { user } = useAuth()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [categoryData, setCategoryData] = useState<CategoryPerformanceData[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"all" | "month" | "week">("all")
  const [statsData, setStatsData] = useState({
    totalTests: 0,
    avgScore: 0,
    bestCategory: { name: "", score: 0 },
    worstCategory: { name: "", score: 0 },
    improvement: 0,
    skillsDistribution: [] as { category: string; count: number }[],
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const results = await getUserTestResults(user.id)
        setTestResults(results)

        const categories = await getCategoryPerformance(user.id)
        setCategoryData(categories)

        const userSkills = await getUserSkills(user.id)
        setSkills(userSkills)

        // Calculate statistics
        calculateStats(results, categories, userSkills)
      } catch (error) {
        console.error("Error fetching statistics data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Calculate statistics from the data
  const calculateStats = (results: TestResult[], categories: CategoryPerformanceData[], userSkills: Skill[]) => {
    // Total tests
    const totalTests = results.length

    // Average score
    const avgScore = totalTests > 0 ? Math.round(results.reduce((sum, test) => sum + test.score, 0) / totalTests) : 0

    // Best and worst categories
    let bestCategory = { name: "N/A", score: 0 }
    let worstCategory = { name: "N/A", score: 100 }

    categories.forEach((category) => {
      if (category.score > bestCategory.score) {
        bestCategory = { name: category.title, score: category.score }
      }
      if (category.score < worstCategory.score && category.score > 0) {
        worstCategory = { name: category.title, score: category.score }
      }
    })

    // If no worst category was found (all scores are 0), set it to N/A
    if (worstCategory.score === 100) {
      worstCategory = { name: "N/A", score: 0 }
    }

    // Calculate improvement over time
    let improvement = 0
    if (results.length >= 2) {
      // Sort by date
      const sortedResults = [...results].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      // Get first and last test scores
      const firstScore = sortedResults[0].score
      const lastScore = sortedResults[sortedResults.length - 1].score

      improvement = lastScore - firstScore
    }

    // Skills distribution by category
    const skillsByCategory = userSkills.reduce(
      (acc, skill) => {
        const category = skill.category
        const existing = acc.find((item) => item.category === category)

        if (existing) {
          existing.count++
        } else {
          acc.push({ category, count: 1 })
        }

        return acc
      },
      [] as { category: string; count: number }[],
    )

    setStatsData({
      totalTests,
      avgScore,
      bestCategory,
      worstCategory,
      improvement,
      skillsDistribution: skillsByCategory,
    })
  }

  // Filter test results based on time range
  const filteredResults = testResults.filter((result) => {
    if (timeRange === "all") return true

    const resultDate = new Date(result.date)
    const now = new Date()

    if (timeRange === "month") {
      // Filter for the last month
      const lastMonth = new Date(now)
      lastMonth.setMonth(now.getMonth() - 1)
      return resultDate >= lastMonth
    }

    if (timeRange === "week") {
      // Filter for the last week
      const lastWeek = new Date(now)
      lastWeek.setDate(now.getDate() - 7)
      return resultDate >= lastWeek
    }

    return true
  })

  // Check if there's no data to display
  const hasNoData = testResults.length === 0 && !loading

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Estadísticas y Progreso</h1>
          <Tabs defaultValue="all" onValueChange={(value) => setTimeRange(value as "all" | "month" | "week")}>
            <TabsList>
              <TabsTrigger value="all">Todo</TabsTrigger>
              <TabsTrigger value="month">Último mes</TabsTrigger>
              <TabsTrigger value="week">Última semana</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {hasNoData ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No hay datos disponibles</AlertTitle>
            <AlertDescription>
              Aún no tienes resultados de pruebas. Completa algunas pruebas para ver tus estadísticas y progreso.
              <div className="mt-4">
                <Button asChild>
                  <Link href="/tests">Realizar mi primer test</Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Key metrics cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tests completados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.totalTests}</div>
                  <p className="text-xs text-muted-foreground">
                    {testResults.length > 0
                      ? `Último: ${new Date(testResults[0].date).toLocaleDateString()}`
                      : "Sin tests"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Puntuación media</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.avgScore}%</div>
                  <p className="text-xs text-muted-foreground">
                    {statsData.improvement > 0 ? (
                      <span className="flex items-center text-green-500">
                        <ArrowUp className="h-3 w-3 mr-1" /> +{statsData.improvement}% de mejora
                      </span>
                    ) : statsData.improvement < 0 ? (
                      <span className="flex items-center text-red-500">
                        <ArrowDown className="h-3 w-3 mr-1" /> {statsData.improvement}% de caída
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Minus className="h-3 w-3 mr-1" /> Sin cambios
                      </span>
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Mejor categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.bestCategory.name}</div>
                  <p className="text-xs text-muted-foreground">
                    {statsData.bestCategory.score > 0 ? `${statsData.bestCategory.score}% de efectividad` : "Sin datos"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Área de mejora</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.worstCategory.name}</div>
                  <p className="text-xs text-muted-foreground">
                    {statsData.worstCategory.score > 0
                      ? `${statsData.worstCategory.score}% de efectividad`
                      : "Sin datos"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento por Categoría</CardTitle>
                  <CardDescription>Puntuación promedio en cada categoría</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryData.map((category, index) =>
                      category.score > 0 ? (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{category.title}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{category.score}%</span>
                              {category.change !== 0 && (
                                <span className={`text-xs ${category.change > 0 ? "text-green-500" : "text-red-500"}`}>
                                  {category.change > 0 ? `+${category.change}%` : `${category.change}%`}
                                </span>
                              )}
                            </div>
                          </div>
                          <Progress value={category.score} className="h-2" />
                        </div>
                      ) : null,
                    )}
                    {categoryData.filter((c) => c.score > 0).length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        No hay datos de rendimiento disponibles
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progreso de Habilidades</CardTitle>
                  <CardDescription>Evolución de tus habilidades técnicas</CardDescription>
                </CardHeader>
                <CardContent>
                  <SkillsChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comparativa</CardTitle>
                  <CardDescription>Tu nivel vs. promedio de estudiantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ComparisonChart userId={user?.id || ""} />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Rendimiento en Pruebas</CardTitle>
                  <CardDescription>Resultados de tus últimas pruebas</CardDescription>
                </CardHeader>
                <CardContent>
                  <PerformanceChart results={filteredResults} />
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Mapa de Habilidades</CardTitle>
                  <CardDescription>Distribución de tus habilidades técnicas</CardDescription>
                </CardHeader>
                <CardContent>
                  <SkillsRadarChart userId={user?.id || ""} />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
