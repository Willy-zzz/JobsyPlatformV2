"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { getUserTestResults, getUserRecommendations, getUserCV } from "@/lib/data-service"
import { BarChart, BookOpen, FileText, GraduationCap, LayoutGrid, Layers, Trophy, Lightbulb } from "lucide-react"
import { CategoryPerformance } from "@/components/category-performance"
import { RecommendationCard } from "@/components/recommendation-card"

export default function DashboardPage() {
  const { user } = useAuth()
  const [testResults, setTestResults] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [userCV, setUserCV] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filteredRecommendations, setFilteredRecommendations] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        // Fetch test results
        const results = await getUserTestResults(user.id)
        setTestResults(results)

        // Fetch recommendations
        const recs = await getUserRecommendations(user.id)
        setRecommendations(Array.isArray(recs) ? recs : [])

        // Fetch CV
        const cv = await getUserCV(user.id)
        setUserCV(cv)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Filter recommendations based on user's career and specialization
  useEffect(() => {
    if (!recommendations.length || !user) return

    // Get recommendations based on user's career and specialization
    let filtered = [...recommendations]

    // Filter by career if available
    if (user.career) {
      const careerKeywords = getCareerKeywords(user.career)
      if (careerKeywords.length > 0) {
        filtered = filtered.filter((rec) => {
          const matchesCategory = careerKeywords.some(
            (keyword) => rec.category && rec.category.toLowerCase().includes(keyword.toLowerCase()),
          )
          const matchesTitle = careerKeywords.some(
            (keyword) => rec.title && rec.title.toLowerCase().includes(keyword.toLowerCase()),
          )
          const matchesDescription = careerKeywords.some(
            (keyword) => rec.description && rec.description.toLowerCase().includes(keyword.toLowerCase()),
          )
          return matchesCategory || matchesTitle || matchesDescription
        })
      }
    }

    // Further filter by specialization if available
    if (user.specialization) {
      const specializationKeywords = getSpecializationKeywords(user.specialization)
      if (specializationKeywords.length > 0) {
        // Prioritize recommendations that match specialization
        const specializationMatches = filtered.filter((rec) => {
          return specializationKeywords.some(
            (keyword) =>
              (rec.category && rec.category.toLowerCase().includes(keyword.toLowerCase())) ||
              (rec.title && rec.title.toLowerCase().includes(keyword.toLowerCase())) ||
              (rec.description && rec.description.toLowerCase().includes(keyword.toLowerCase())),
          )
        })

        // If we have specialization matches, use those, otherwise keep the career filtered list
        if (specializationMatches.length > 0) {
          filtered = specializationMatches
        }
      }
    }

    // If we have test results, prioritize recommendations based on weak areas
    if (testResults.length > 0) {
      // Find categories with lowest scores
      const categoryScores = {}
      testResults.forEach((test) => {
        if (test.category) {
          if (!categoryScores[test.category]) {
            categoryScores[test.category] = { total: 0, count: 0 }
          }
          categoryScores[test.category].total += test.score
          categoryScores[test.category].count += 1
        }
      })

      // Calculate average scores
      const averageScores = Object.entries(categoryScores).map(([category, data]) => ({
        category,
        score: data.total / data.count,
      }))

      // Sort by score (ascending)
      averageScores.sort((a, b) => a.score - b.score)

      // Get the weakest categories
      const weakCategories = averageScores.slice(0, 2).map((item) => item.category.toLowerCase())

      if (weakCategories.length > 0) {
        // Find recommendations that match weak categories
        const weakAreaMatches = filtered.filter((rec) => {
          return weakCategories.some((category) => rec.category && rec.category.toLowerCase().includes(category))
        })

        // If we have matches for weak areas, prioritize those
        if (weakAreaMatches.length > 0) {
          // Combine weak area matches with other filtered recommendations
          const otherRecs = filtered.filter((rec) => !weakAreaMatches.includes(rec))
          filtered = [...weakAreaMatches, ...otherRecs]
        }
      }
    }

    // Ensure we have at least some recommendations
    if (filtered.length === 0) {
      filtered = recommendations.slice(0, 3)
    }

    // Take the top 3 recommendations
    setFilteredRecommendations(filtered.slice(0, 3))
  }, [recommendations, user, testResults])

  // Helper function to get keywords based on career
  const getCareerKeywords = (career) => {
    const careerMap = {
      "Ingeniería en Sistemas Computacionales": [
        "programación",
        "desarrollo",
        "software",
        "sistemas",
        "web",
        "móvil",
        "frontend",
        "backend",
      ],
      "Ingeniería Informática": ["informática", "datos", "análisis", "sistemas", "redes", "seguridad"],
      "Ingeniería en Tecnologías de la Información": ["TI", "infraestructura", "cloud", "redes", "sistemas"],
      "Licenciatura en Informática": ["informática", "gestión", "proyectos", "análisis"],
      "Ingeniería en Desarrollo de Software": [
        "desarrollo",
        "software",
        "programación",
        "web",
        "móvil",
        "frontend",
        "backend",
      ],
      "Ingeniería en Ciencias de la Computación": [
        "algoritmos",
        "computación",
        "teoría",
        "matemáticas",
        "inteligencia artificial",
      ],
    }

    return careerMap[career] || ["programación", "desarrollo", "tecnología"]
  }

  // Helper function to get keywords based on specialization
  const getSpecializationKeywords = (specialization) => {
    const specializationMap = {
      "Gestión de datos": ["datos", "SQL", "NoSQL", "bases de datos", "análisis", "big data", "data science"],
      "Programación Multiplataforma": ["web", "móvil", "frontend", "backend", "fullstack", "react", "angular", "vue"],
      "Seguridad y redes": ["seguridad", "redes", "ciberseguridad", "ethical hacking", "pentesting", "firewall"],
      "Gestión de datos en aplicaciones móviles": [
        "móvil",
        "android",
        "ios",
        "react native",
        "flutter",
        "datos móviles",
      ],
      "Inteligencia Artificial": ["IA", "machine learning", "deep learning", "redes neuronales", "NLP"],
      "Cloud Computing": ["cloud", "AWS", "Azure", "Google Cloud", "DevOps", "contenedores", "kubernetes"],
      "Desarrollo Web": ["web", "frontend", "backend", "fullstack", "javascript", "react", "node"],
    }

    return specializationMap[specialization] || []
  }

  // Calculate progress based on test results
  const calculateProgress = () => {
    if (!testResults || testResults.length === 0) return 0
    const totalScore = testResults.reduce((sum, test) => sum + test.score, 0)
    return Math.round(totalScore / testResults.length)
  }

  // Get the latest test result
  const getLatestTest = () => {
    if (!testResults || testResults.length === 0) return null
    return testResults[0] // Assuming results are sorted by date
  }

  const latestTest = getLatestTest()
  const progress = calculateProgress()

  // Get personalized learning path message
  const getLearningPathMessage = () => {
    if (!user) return "Recomendaciones personalizadas para mejorar tus habilidades"

    if (user.specialization) {
      return `Recomendaciones para tu especialidad en ${user.specialization}`
    } else if (user.career) {
      return `Recomendaciones para estudiantes de ${user.career}`
    } else {
      return "Recomendaciones personalizadas para mejorar tus habilidades"
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Inicio</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/tests">
                <GraduationCap className="mr-2 h-4 w-4" />
                Tests
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/statistics">
                <BarChart className="mr-2 h-4 w-4" />
                Estadísticas
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Progreso general</CardTitle>
              <CardDescription>Basado en tus evaluaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-3xl font-bold text-primary">{progress}%</span>
                </div>
                <div className="mb-2 w-full">
                  <div className="mb-1 flex justify-between text-xs">
                    <span>Principiante</span>
                    <span>Intermedio</span>
                    <span>Avanzado</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {progress < 30
                    ? "Estás comenzando tu camino. ¡Sigue adelante!"
                    : progress < 70
                      ? "Vas por buen camino. ¡Continúa mejorando!"
                      : "¡Excelente progreso! Estás dominando las habilidades."}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/statistics">Ver estadísticas detalladas</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Currículum</CardTitle>
              <CardDescription>Estado de tu CV</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                {userCV && userCV.fileName ? (
                  <div className="text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <FileText className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="mb-1 text-base font-medium">{userCV.fileName}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Subido el {new Date(userCV.uploadDate).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {userCV.skills &&
                        userCV.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                          >
                            {skill}
                          </span>
                        ))}
                      {userCV.skills && userCV.skills.length > 3 && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          +{userCV.skills.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                      <FileText className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="mb-2 text-base font-medium">No has subido tu CV</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Sube tu CV para recibir recomendaciones personalizadas
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/resume">{userCV && userCV.fileName ? "Actualizar CV" : "Subir CV"}</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Último test</CardTitle>
              <CardDescription>Resultado de tu evaluación más reciente</CardDescription>
            </CardHeader>
            <CardContent>
              {latestTest ? (
                <div className="flex flex-col items-center">
                  <div
                    className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                      latestTest.score >= 70 ? "bg-green-100" : latestTest.score >= 50 ? "bg-amber-100" : "bg-red-100"
                    }`}
                  >
                    <Trophy
                      className={`h-8 w-8 ${
                        latestTest.score >= 70
                          ? "text-green-600"
                          : latestTest.score >= 50
                            ? "text-amber-600"
                            : "text-red-600"
                      }`}
                    />
                  </div>
                  <h3 className="mb-1 text-base font-medium">{latestTest.name}</h3>
                  <p className="mb-2 text-sm text-muted-foreground">{new Date(latestTest.date).toLocaleDateString()}</p>
                  <div className="mb-2 w-full">
                    <div className="mb-1 flex justify-between text-xs">
                      <span>Puntuación</span>
                      <span
                        className={`font-medium ${
                          latestTest.score >= 70
                            ? "text-green-600"
                            : latestTest.score >= 50
                              ? "text-amber-600"
                              : "text-red-600"
                        }`}
                      >
                        {latestTest.score}%
                      </span>
                    </div>
                    <Progress
                      value={latestTest.score}
                      className="h-2"
                      indicatorClassName={
                        latestTest.score >= 70 ? "bg-green-500" : latestTest.score >= 50 ? "bg-amber-500" : "bg-red-500"
                      }
                    />
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    {latestTest.score >= 70
                      ? "¡Excelente trabajo! Dominas este tema."
                      : latestTest.score >= 50
                        ? "Buen intento. Hay espacio para mejorar."
                        : "Necesitas practicar más este tema."}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <GraduationCap className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="mb-2 text-base font-medium">No has realizado ningún test</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Realiza tu primer test para evaluar tus habilidades
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/tests">{latestTest ? "Ver todos los tests" : "Realizar mi primer test"}</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-1 md:col-span-1">
            <CardHeader>
              <CardTitle>Rendimiento por categoría</CardTitle>
              <CardDescription>Tu desempeño en diferentes áreas técnicas</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryPerformance userId={user?.id} />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/statistics">Ver estadísticas detalladas</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="col-span-1 md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ruta de aprendizaje</CardTitle>
                <CardDescription>{getLearningPathMessage()}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/recommendations">
                  <span className="sr-only">Ver todas</span>
                  <LayoutGrid className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRecommendations && filteredRecommendations.length > 0 ? (
                    <>
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="mt-0.5 h-5 w-5 text-amber-600" />
                          <div>
                            <h4 className="mb-1 font-medium">Recomendaciones personalizadas</h4>
                            <p className="text-sm">
                              {user?.specialization
                                ? `Estas recomendaciones están adaptadas a tu especialidad en ${user.specialization} y a tu rendimiento en los tests.`
                                : user?.career
                                  ? `Estas recomendaciones están adaptadas a tu carrera de ${user.career} y a tu rendimiento en los tests.`
                                  : "Estas recomendaciones están basadas en tu rendimiento en los tests y en las tendencias actuales del mercado."}
                            </p>
                          </div>
                        </div>
                      </div>
                      {filteredRecommendations.map((recommendation, index) => (
                        <RecommendationCard key={index} recommendation={recommendation} />
                      ))}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <BookOpen className="mb-2 h-8 w-8 text-muted-foreground" />
                      <h3 className="mb-1 text-base font-medium">No hay recomendaciones disponibles</h3>
                      <p className="text-sm text-muted-foreground">
                        Completa algunos tests para recibir recomendaciones personalizadas
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/recommendations">Ver todas las recomendaciones</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recursos destacados</CardTitle>
            <CardDescription>Herramientas y recursos para mejorar tus habilidades</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="frontend">
              <TabsList className="mb-4">
                <TabsTrigger value="frontend">Frontend</TabsTrigger>
                <TabsTrigger value="backend">Backend</TabsTrigger>
                <TabsTrigger value="databases">Bases de datos</TabsTrigger>
                <TabsTrigger value="algorithms">Algoritmos</TabsTrigger>
              </TabsList>
              <TabsContent value="frontend" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="rounded-full bg-blue-100 p-1.5">
                        <Layers className="h-4 w-4 text-blue-600" />
                      </div>
                      <h3 className="font-medium">React.js</h3>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Biblioteca JavaScript para construir interfaces de usuario
                    </p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
                        Explorar
                      </a>
                    </Button>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="rounded-full bg-purple-100 p-1.5">
                        <Layers className="h-4 w-4 text-purple-600" />
                      </div>
                      <h3 className="font-medium">CSS Moderno</h3>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Técnicas avanzadas de CSS y frameworks como Tailwind
                    </p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer">
                        Explorar
                      </a>
                    </Button>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="rounded-full bg-yellow-100 p-1.5">
                        <Layers className="h-4 w-4 text-yellow-600" />
                      </div>
                      <h3 className="font-medium">JavaScript ES6+</h3>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Características modernas de JavaScript y buenas prácticas
                    </p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a
                        href="https://developer.mozilla.org/es/docs/Web/JavaScript"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Explorar
                      </a>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="backend" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="rounded-full bg-green-100 p-1.5">
                        <Layers className="h-4 w-4 text-green-600" />
                      </div>
                      <h3 className="font-medium">Node.js</h3>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Entorno de ejecución para JavaScript en el servidor
                    </p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">
                        Explorar
                      </a>
                    </Button>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="rounded-full bg-red-100 p-1.5">
                        <Layers className="h-4 w-4 text-red-600" />
                      </div>
                      <h3 className="font-medium">APIs RESTful</h3>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">Diseño e implementación de APIs REST</p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="https://restfulapi.net/" target="_blank" rel="noopener noreferrer">
                        Explorar
                      </a>
                    </Button>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="rounded-full bg-indigo-100 p-1.5">
                        <Layers className="h-4 w-4 text-indigo-600" />
                      </div>
                      <h3 className="font-medium">Autenticación</h3>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Implementación de sistemas de autenticación seguros
                    </p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="https://jwt.io/" target="_blank" rel="noopener noreferrer">
                        Explorar
                      </a>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="databases" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="rounded-full bg-blue-100 p-1.5">
                        <Layers className="h-4 w-4 text-blue-600" />
                      </div>
                      <h3 className="font-medium">SQL</h3>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Fundamentos de SQL y bases de datos relacionales
                    </p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="https://www.w3schools.com/sql/" target="_blank" rel="noopener noreferrer">
                        Explorar
                      </a>
                    </Button>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="rounded-full bg-green-100 p-1.5">
                        <Layers className="h-4 w-4 text-green-600" />
                      </div>
                      <h3 className="font-medium">MongoDB</h3>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">Base de datos NoSQL orientada a documentos</p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="https://www.mongodb.com/" target="_blank" rel="noopener noreferrer">
                        Explorar
                      </a>
                    </Button>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="rounded-full bg-orange-100 p-1.5">
                        <Layers className="h-4 w-4 text-orange-600" />
                      </div>
                      <h3 className="font-medium">ORM</h3>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Mapeo objeto-relacional con Prisma, Sequelize o TypeORM
                    </p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="https://www.prisma.io/" target="_blank" rel="noopener noreferrer">
                        Explorar
                      </a>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="algorithms" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="rounded-full bg-purple-100 p-1.5">
                        <Layers className="h-4 w-4 text-purple-600" />
                      </div>
                      <h3 className="font-medium">Estructuras de datos</h3>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">Arrays, listas enlazadas, árboles y grafos</p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="https://visualgo.net/" target="_blank" rel="noopener noreferrer">
                        Explorar
                      </a>
                    </Button>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="rounded-full bg-blue-100 p-1.5">
                        <Layers className="h-4 w-4 text-blue-600" />
                      </div>
                      <h3 className="font-medium">Algoritmos de ordenamiento</h3>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">QuickSort, MergeSort, BubbleSort y más</p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a
                        href="https://www.toptal.com/developers/sorting-algorithms"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Explorar
                      </a>
                    </Button>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="rounded-full bg-red-100 p-1.5">
                        <Layers className="h-4 w-4 text-red-600" />
                      </div>
                      <h3 className="font-medium">Complejidad algorítmica</h3>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">Análisis de tiempo y espacio, notación Big O</p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="https://www.bigocheatsheet.com/" target="_blank" rel="noopener noreferrer">
                        Explorar
                      </a>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
