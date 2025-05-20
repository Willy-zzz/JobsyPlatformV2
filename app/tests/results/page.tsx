"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { getUserTestResults } from "@/lib/data-service"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart, CheckCircle, Clock, FileText, GraduationCap, XCircle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function TestResultsPage() {
  const { user } = useAuth()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return

      try {
        const testResults = await getUserTestResults(user.id)
        setResults(testResults)
      } catch (error) {
        console.error("Error fetching test results:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [user])

  // Filter results based on selected filter
  const filteredResults = results.filter((result) => {
    if (filter === "all") return true
    return result.category === filter
  })

  // Sort results by date (newest first)
  const sortedResults = [...filteredResults].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Calculate average score
  const averageScore =
    sortedResults.length > 0
      ? Math.round(sortedResults.reduce((sum, result) => sum + result.score, 0) / sortedResults.length)
      : 0

  // Get unique categories
  const categories = [...new Set(results.map((result) => result.category))]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Resultados de Tests</h1>
          <Button asChild>
            <Link href="/tests">
              <GraduationCap className="mr-2 h-4 w-4" />
              Realizar nuevo test
            </Link>
          </Button>
        </div>

        {results.length === 0 && !loading ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              No has completado ningún test todavía. Realiza tu primer test para ver tus resultados aquí.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tests completados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">{results.length}</div>
                      <p className="text-sm text-muted-foreground">
                        {results.length === 1 ? "Test completado" : "Tests completados"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Puntuación media</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div
                      className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                        averageScore >= 70 ? "bg-green-100" : averageScore >= 50 ? "bg-amber-100" : "bg-red-100"
                      }`}
                    >
                      <BarChart
                        className={`h-8 w-8 ${
                          averageScore >= 70 ? "text-green-600" : averageScore >= 50 ? "text-amber-600" : "text-red-600"
                        }`}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">{averageScore}%</div>
                      <p className="text-sm text-muted-foreground">Puntuación promedio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Último test</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    {results.length > 0 ? (
                      <>
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                          <Clock className="h-8 w-8 text-primary" />
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-medium">{results[0].name}</div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(results[0].date).toLocaleDateString()}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                          <Clock className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-medium">Sin tests</div>
                          <p className="text-sm text-muted-foreground">Realiza tu primer test</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Historial de resultados</CardTitle>
                <CardDescription>Todos tus tests completados</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" onValueChange={setFilter}>
                  <div className="flex items-center justify-between">
                    <TabsList>
                      <TabsTrigger value="all">Todos</TabsTrigger>
                      {categories.map((category) => (
                        <TabsTrigger key={category} value={category}>
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  <TabsContent value="all" className="mt-4">
                    <div className="rounded-md border">
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_150px] gap-4 p-4 font-medium">
                        <div>Nombre del test</div>
                        <div className="hidden md:block">Fecha</div>
                        <div className="hidden md:block">Categoría</div>
                        <div>Puntuación</div>
                      </div>
                      <div className="divide-y">
                        {sortedResults.map((result) => (
                          <div
                            key={result.id}
                            className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_150px] gap-4 p-4 items-center"
                          >
                            <div className="font-medium">{result.name}</div>
                            <div className="text-sm text-muted-foreground hidden md:block">
                              {new Date(result.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-muted-foreground hidden md:block">{result.category}</div>
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2 w-full max-w-24 rounded-full ${
                                  result.score >= 70
                                    ? "bg-green-500"
                                    : result.score >= 50
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                }`}
                              ></div>
                              <span
                                className={`font-medium ${
                                  result.score >= 70
                                    ? "text-green-600"
                                    : result.score >= 50
                                      ? "text-amber-600"
                                      : "text-red-600"
                                }`}
                              >
                                {result.score}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {categories.map((category) => (
                    <TabsContent key={category} value={category} className="mt-4">
                      <div className="rounded-md border">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px] gap-4 p-4 font-medium">
                          <div>Nombre del test</div>
                          <div className="hidden md:block">Fecha</div>
                          <div>Puntuación</div>
                        </div>
                        <div className="divide-y">
                          {sortedResults.map((result) => (
                            <div
                              key={result.id}
                              className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px] gap-4 p-4 items-center"
                            >
                              <div className="font-medium">{result.name}</div>
                              <div className="text-sm text-muted-foreground hidden md:block">
                                {new Date(result.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-2 w-full max-w-24 rounded-full ${
                                    result.score >= 70
                                      ? "bg-green-500"
                                      : result.score >= 50
                                        ? "bg-amber-500"
                                        : "bg-red-500"
                                  }`}
                                ></div>
                                <span
                                  className={`font-medium ${
                                    result.score >= 70
                                      ? "text-green-600"
                                      : result.score >= 50
                                        ? "text-amber-600"
                                        : "text-red-600"
                                  }`}
                                >
                                  {result.score}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análisis de rendimiento</CardTitle>
                <CardDescription>Desglose de tus resultados por categoría</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categories.map((category) => {
                    const categoryResults = results.filter((result) => result.category === category)
                    const categoryAvg =
                      categoryResults.length > 0
                        ? Math.round(
                            categoryResults.reduce((sum, result) => sum + result.score, 0) / categoryResults.length,
                          )
                        : 0

                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between">
                          <div>
                            <span className="font-medium">{category}</span>
                            <span className="ml-2 text-sm text-muted-foreground">
                              ({categoryResults.length} {categoryResults.length === 1 ? "test" : "tests"})
                            </span>
                          </div>
                          <span
                            className={`font-medium ${
                              categoryAvg >= 70
                                ? "text-green-600"
                                : categoryAvg >= 50
                                  ? "text-amber-600"
                                  : "text-red-600"
                            }`}
                          >
                            {categoryAvg}%
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-full">
                            <Progress
                              value={categoryAvg}
                              className="h-2"
                              indicatorClassName={
                                categoryAvg >= 70 ? "bg-green-500" : categoryAvg >= 50 ? "bg-amber-500" : "bg-red-500"
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2 min-w-[100px]">
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-xs">
                                {categoryResults.filter((result) => result.score >= 70).length}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <XCircle className="h-4 w-4 text-red-500" />
                              <span className="text-xs">
                                {categoryResults.filter((result) => result.score < 50).length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
