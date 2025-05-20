"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Code } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    career: "Ingeniería en Sistemas Computacionales",
    semester: "1",
    specialization: "",
    bio: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Si el semestre cambia a un valor menor a 7, resetear la especialidad
    if (name === "semester" && Number.parseInt(value) < 7) {
      setFormData((prev) => ({ ...prev, specialization: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        studentId: formData.studentId,
        career: formData.career,
        semester: formData.semester,
        specialization: formData.specialization,
        bio: formData.bio,
        level: "Principiante",
      })

      if (success) {
        router.push("/dashboard")
      } else {
        setError("El correo electrónico ya está registrado")
      }
    } catch (err) {
      setError("Ocurrió un error al registrarse. Por favor, intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">JOBSY</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Crear una cuenta</CardTitle>
            <CardDescription>Completa el formulario para registrarte en JOBSY</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">Matrícula</Label>
                  <Input id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="career">Carrera</Label>
                  <Select value={formData.career} onValueChange={(value) => handleSelectChange("career", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu carrera" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ingeniería en Sistemas Computacionales">
                        Ingeniería en Sistemas Computacionales
                      </SelectItem>
                      <SelectItem value="Ingeniería Informática">Ingeniería Informática</SelectItem>
                      <SelectItem value="Ingeniería en Tecnologías de la Información">
                        Ingeniería en Tecnologías de la Información
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semestre</Label>
                  <Select value={formData.semester} onValueChange={(value) => handleSelectChange("semester", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu semestre" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((semester) => (
                        <SelectItem key={semester} value={semester.toString()}>
                          {semester}º Semestre
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Especialidad</Label>
                  <Select
                    value={formData.specialization}
                    onValueChange={(value) => handleSelectChange("specialization", value)}
                    disabled={Number.parseInt(formData.semester) < 7}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          Number.parseInt(formData.semester) < 7
                            ? "Disponible a partir de 7º semestre"
                            : "Selecciona tu especialidad"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gestión de datos">Gestión de datos</SelectItem>
                      <SelectItem value="Programación Multiplataforma">Programación Multiplataforma</SelectItem>
                      <SelectItem value="Seguridad y redes">Seguridad y redes</SelectItem>
                      <SelectItem value="Gestión de datos en aplicaciones móviles">
                        Gestión de datos en aplicaciones móviles
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {Number.parseInt(formData.semester) < 7 && (
                    <p className="text-xs text-muted-foreground">
                      La selección de especialidad está disponible a partir del 7º semestre
                    </p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Cuéntanos un poco sobre ti (opcional)"
                    rows={3}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrarse"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4">
            <div className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Iniciar sesión
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
