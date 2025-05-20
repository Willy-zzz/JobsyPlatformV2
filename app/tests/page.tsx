import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Code, Database, FileCode, Layers, LayoutGrid } from "lucide-react"

export default function TestsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tests Técnicos</h1>
          <p className="text-muted-foreground">Evalúa tus habilidades en diferentes áreas de la programación</p>
        </div>

        <Tabs defaultValue="disponibles" className="space-y-4">
          <TabsList>
            <TabsTrigger value="disponibles">Disponibles</TabsTrigger>
            <TabsTrigger value="completados">Completados</TabsTrigger>
            <TabsTrigger value="recomendados">Recomendados</TabsTrigger>
          </TabsList>
          <TabsContent value="disponibles" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Frontend Básico",
                  description: "HTML, CSS y JavaScript fundamentales",
                  duration: "30 minutos",
                  questions: 20,
                  category: "Frontend",
                  icon: <LayoutGrid className="h-5 w-5" />,
                },
                {
                  title: "Algoritmos y Estructuras",
                  description: "Ordenamiento, búsqueda y estructuras de datos",
                  duration: "45 minutos",
                  questions: 15,
                  category: "Algoritmos",
                  icon: <Layers className="h-5 w-5" />,
                },
                {
                  title: "SQL Intermedio",
                  description: "Consultas complejas, joins y subconsultas",
                  duration: "40 minutos",
                  questions: 25,
                  category: "Bases de datos",
                  icon: <Database className="h-5 w-5" />,
                },
                {
                  title: "Backend con Node.js",
                  description: "Express, APIs REST y autenticación",
                  duration: "50 minutos",
                  questions: 30,
                  category: "Backend",
                  icon: <FileCode className="h-5 w-5" />,
                },
                {
                  title: "React Avanzado",
                  description: "Hooks, Context API y optimización",
                  duration: "60 minutos",
                  questions: 25,
                  category: "Frontend",
                  icon: <Code className="h-5 w-5" />,
                },
                {
                  title: "DevOps Básico",
                  description: "Docker, CI/CD y despliegue",
                  duration: "45 minutos",
                  questions: 20,
                  category: "DevOps",
                  icon: <Layers className="h-5 w-5" />,
                },
              ].map((test, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{test.category}</Badge>
                      {test.icon}
                    </div>
                    <CardTitle className="mt-2">{test.title}</CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{test.duration}</span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">{test.questions} preguntas</div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <a href={`/tests/${index + 1}`}>Iniciar test</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="completados">
            <div className="rounded-md border">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] gap-4 font-medium">
                  <div>Nombre del test</div>
                  <div className="hidden md:block">Fecha</div>
                  <div className="hidden md:block">Categoría</div>
                  <div>Puntuación</div>
                </div>
              </div>
              <div className="divide-y">
                {[
                  {
                    name: "Evaluación de Frontend",
                    date: "15 de marzo, 2024",
                    score: "42%",
                    category: "Frontend",
                  },
                  {
                    name: "Test de SQL avanzado",
                    date: "2 de marzo, 2024",
                    score: "85%",
                    category: "Bases de datos",
                  },
                  {
                    name: "Algoritmos y estructuras de datos",
                    date: "25 de febrero, 2024",
                    score: "56%",
                    category: "Algoritmos",
                  },
                  {
                    name: "Desarrollo backend con Node.js",
                    date: "10 de febrero, 2024",
                    score: "68%",
                    category: "Backend",
                  },
                  {
                    name: "Introducción a DevOps",
                    date: "1 de febrero, 2024",
                    score: "32%",
                    category: "DevOps",
                  },
                ].map((test, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] gap-4 p-4 items-center"
                  >
                    <div className="font-medium">{test.name}</div>
                    <div className="text-sm text-muted-foreground hidden md:block">{test.date}</div>
                    <div className="text-sm text-muted-foreground hidden md:block">{test.category}</div>
                    <div
                      className={`font-medium ${
                        Number.parseInt(test.score) >= 70
                          ? "text-green-500"
                          : Number.parseInt(test.score) >= 50
                            ? "text-amber-500"
                            : "text-red-500"
                      }`}
                    >
                      {test.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="recomendados">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "React Avanzado",
                  description: "Recomendado para mejorar tus habilidades de Frontend",
                  duration: "60 minutos",
                  questions: 25,
                  category: "Frontend",
                  icon: <Code className="h-5 w-5" />,
                },
                {
                  title: "Optimización de Bases de Datos",
                  description: "Lleva tus conocimientos de SQL al siguiente nivel",
                  duration: "45 minutos",
                  questions: 20,
                  category: "Bases de datos",
                  icon: <Database className="h-5 w-5" />,
                },
                {
                  title: "Patrones de Diseño",
                  description: "Mejora la estructura y mantenibilidad de tu código",
                  duration: "50 minutos",
                  questions: 15,
                  category: "Arquitectura",
                  icon: <Layers className="h-5 w-5" />,
                },
              ].map((test, index) => (
                <Card key={index} className="flex flex-col border-primary/20 bg-primary/5">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge>{test.category}</Badge>
                      {test.icon}
                    </div>
                    <CardTitle className="mt-2">{test.title}</CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{test.duration}</span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">{test.questions} preguntas</div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <a href={`/tests/${index + 10}`}>Iniciar test</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
