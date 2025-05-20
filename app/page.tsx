import Link from "next/link"
import { ArrowRight, Code, FileText, LineChart } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">JOBSY</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#como-funciona" className="text-sm font-medium hover:text-primary">
              Cómo funciona
            </Link>
            <Link href="#beneficios" className="text-sm font-medium hover:text-primary">
              Beneficios
            </Link>
            <Link href="#testimonios" className="text-sm font-medium hover:text-primary">
              Testimonios
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary">
              Iniciar sesión
            </Link>
            <Button asChild>
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Impulsa tu carrera en tecnología
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Evalúa tus habilidades, identifica áreas de mejora y recibe recomendaciones personalizadas para
                    destacar en el mundo de la programación.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/login">
                      Comenzar evaluación <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="#como-funciona">Conocer más</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-48 h-48 md:w-64 md:h-64 bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-5xl md:text-7xl font-bold text-white">JOBSY</span>
                    </div>
                  </div>
                  <p className="text-xl font-semibold text-primary">Tu plataforma de desarrollo profesional</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="como-funciona" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Cómo funciona JOBSY</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Un proceso simple para potenciar tus habilidades técnicas y avanzar en tu carrera
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-8 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-8 shadow-sm hover-lift">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">1. Sube tu CV</h3>
                <p className="text-center text-muted-foreground">
                  Analiza tu experiencia y formación para identificar tu perfil técnico actual
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-8 shadow-sm hover-lift">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Code className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">2. Realiza tests técnicos</h3>
                <p className="text-center text-muted-foreground">
                  Evalúa tus conocimientos en diferentes áreas de la programación
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-8 shadow-sm hover-lift">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <LineChart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">3. Obtén tu plan de mejora</h3>
                <p className="text-center text-muted-foreground">
                  Recibe recomendaciones personalizadas para mejorar tus habilidades
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="beneficios" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Beneficios de JOBSY</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Diseñado específicamente para estudiantes del Tecnológico de México, Campus Villahermosa
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Evaluación personalizada",
                  description: "Tests adaptados al nivel y perfil de cada estudiante",
                },
                {
                  title: "Análisis detallado",
                  description: "Identifica fortalezas y áreas de oportunidad específicas",
                },
                {
                  title: "Recomendaciones a medida",
                  description: "Recursos y ejercicios seleccionados según tus necesidades",
                },
                {
                  title: "Seguimiento continuo",
                  description: "Monitorea tu progreso y evolución a lo largo del tiempo",
                },
                {
                  title: "Preparación laboral",
                  description: "Enfocado en las habilidades más demandadas por la industria",
                },
                {
                  title: "Comunidad de aprendizaje",
                  description: "Conecta con otros estudiantes y comparte experiencias",
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex flex-col space-y-3 rounded-lg border bg-background p-8 shadow-sm hover-lift"
                >
                  <h3 className="text-xl font-bold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  ¿Listo para impulsar tu carrera?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Comienza hoy mismo a evaluar y mejorar tus habilidades en programación
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Button size="lg" asChild className="px-8">
                  <Link href="/login">
                    Comenzar evaluación <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">JOBSY</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} JOBSY - Tecnológico de México, Campus Villahermosa
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Términos
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Privacidad
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
