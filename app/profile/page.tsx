"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, Check, AlertCircle, Download, X, File } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getUserTestResults, getUserSkills, getUserCV, saveUserCV } from "@/lib/data-service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import type { UserCV } from "@/lib/types"
import Link from "next/link"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    career: "",
    semester: "",
    specialization: "",
    bio: "",
  })
  const [testResults, setTestResults] = useState([])
  const [skills, setSkills] = useState([])
  const [userCV, setUserCV] = useState<UserCV | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showUploadSuccess, setShowUploadSuccess] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      // Initialize form with user data
      setFormData({
        name: user.name || "",
        email: user.email || "",
        studentId: user.studentId || "",
        career: user.career || "",
        semester: user.semester || "",
        specialization: user.specialization || "",
        bio: user.bio || "",
      })

      // Load test results, skills and CV
      const results = getUserTestResults(user.id)
      const userSkills = getUserSkills(user.id)
      const cv = getUserCV(user.id)

      setTestResults(results)
      setSkills(userSkills)
      setUserCV(cv)
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsUpdating(true)

    // Update user data
    updateUser({
      name: formData.name,
      email: formData.email,
      studentId: formData.studentId,
      career: formData.career,
      semester: formData.semester,
      specialization: formData.specialization,
      bio: formData.bio,
    })

    // Show success message
    setTimeout(() => {
      setIsUpdating(false)
      setUpdateSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false)
      }, 3000)
    }, 1000)
  }

  const handleFileChange = (e) => {
    setUploadError("")
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      validateAndSetFile(file)
    }
  }

  const validateAndSetFile = (file: File) => {
    // Check file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!validTypes.includes(file.type)) {
      setUploadError("Formato de archivo no válido. Por favor, sube un archivo PDF, DOC o DOCX.")
      return
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("El archivo es demasiado grande. El tamaño máximo permitido es 5MB.")
      return
    }

    setSelectedFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    setUploadError("")

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      validateAndSetFile(file)
    }
  }

  const handleUploadCV = () => {
    if (!selectedFile || !user) return

    // Simulate CV upload and analysis
    setIsUpdating(true)
    setUploadError("")

    // Create a FileReader to read the file content
    const reader = new FileReader()

    reader.onload = (event) => {
      // Store the file content in localStorage
      const fileContent = event.target?.result as string

      // Create a new CV object
      const newCV: UserCV = {
        userId: user.id,
        fileName: selectedFile.name,
        fileSize: formatFileSize(selectedFile.size),
        fileType: selectedFile.type,
        fileContent: fileContent,
        uploadDate: new Date().toISOString(),
        skills: generateRandomSkills(),
        experience: generateRandomExperience(),
        education: [
          {
            degree: formData.career || "Ingeniería en Sistemas Computacionales",
            institution: "Tecnológico de México, Campus Villahermosa",
            startDate: "2020-01-01",
            endDate: "Presente",
            specialization: formData.specialization || "",
          },
        ],
        lastAnalysisDate: new Date().toISOString(),
      }

      // Save CV to localStorage
      saveUserCV(newCV)
      setUserCV(newCV)
      setSelectedFile(null)
      setIsUpdating(false)
      setShowUploadSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowUploadSuccess(false)
      }, 3000)
    }

    reader.onerror = () => {
      setUploadError("Error al leer el archivo. Por favor, intenta de nuevo.")
      setIsUpdating(false)
    }

    // Read the file as a data URL
    reader.readAsDataURL(selectedFile)
  }

  const handleDeleteCV = () => {
    if (!user) return

    // Create an empty CV
    const emptyCV: UserCV = {
      userId: user.id,
      fileName: "",
      fileSize: "",
      fileType: "",
      fileContent: "",
      uploadDate: "",
      skills: [],
      experience: [],
      education: [],
      lastAnalysisDate: "",
    }

    // Save empty CV to localStorage
    saveUserCV(emptyCV)
    setUserCV(emptyCV)
    setShowDeleteConfirm(false)
  }

  const handleDownloadCV = () => {
    if (!userCV || !userCV.fileContent) return

    // Create a link element
    const link = document.createElement("a")
    link.href = userCV.fileContent
    link.download = userCV.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Helper functions
  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Generate random skills for demo purposes
  const generateRandomSkills = (): string[] => {
    const allSkills = [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Angular",
      "Vue",
      "Node.js",
      "Express",
      "MongoDB",
      "SQL",
      "Git",
      "Docker",
      "AWS",
      "Python",
      "Java",
      "C#",
      "PHP",
      "Ruby",
      "Swift",
      "Kotlin",
    ]

    // Filter skills based on specialization
    let specializedSkills: string[] = []

    if (formData.specialization === "Gestión de datos") {
      specializedSkills = ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Data Analysis", "ETL", "Data Modeling"]
    } else if (formData.specialization === "Programación Multiplataforma") {
      specializedSkills = ["React Native", "Flutter", "Xamarin", "Ionic", "Progressive Web Apps", "Responsive Design"]
    } else if (formData.specialization === "Seguridad y redes") {
      specializedSkills = ["Network Security", "Cryptography", "Firewalls", "VPN", "Penetration Testing", "OWASP"]
    } else if (formData.specialization === "Gestión de datos en aplicaciones móviles") {
      specializedSkills = ["SQLite", "Realm", "Core Data", "Firebase", "Offline Storage", "Data Synchronization"]
    }

    // Combine specialized skills with general skills
    const combinedSkills = [...specializedSkills, ...allSkills]

    // Randomly select 5-10 skills
    const numSkills = Math.floor(Math.random() * 6) + 5
    const selectedSkills = []

    for (let i = 0; i < numSkills; i++) {
      const randomIndex = Math.floor(Math.random() * combinedSkills.length)
      const skill = combinedSkills[randomIndex]

      if (!selectedSkills.includes(skill)) {
        selectedSkills.push(skill)
      }
    }

    return selectedSkills
  }

  // Generate random experience for demo purposes
  const generateRandomExperience = () => {
    const experiences = [
      {
        title: "Desarrollador Web (Prácticas)",
        company: "Empresa XYZ",
        startDate: "2024-01-01",
        endDate: "2024-03-31",
        description: "Desarrollo de interfaces de usuario con React y consumo de APIs.",
      },
      {
        title: "Proyecto Académico: Sistema de Gestión",
        company: "TecNM Campus Villahermosa",
        startDate: "2023-08-01",
        endDate: "2024-01-31",
        description: "Desarrollo de un sistema de gestión académica con Node.js y MySQL.",
      },
    ]

    // Add specialized experience based on specialization
    if (formData.specialization === "Gestión de datos") {
      experiences.push({
        title: "Analista de Datos (Proyecto)",
        company: "DataTech Solutions",
        startDate: "2023-05-01",
        endDate: "2023-07-31",
        description: "Análisis y modelado de datos para sistemas de business intelligence.",
      })
    } else if (formData.specialization === "Programación Multiplataforma") {
      experiences.push({
        title: "Desarrollador Móvil (Freelance)",
        company: "AppDev Studio",
        startDate: "2023-06-01",
        endDate: "2023-09-30",
        description: "Desarrollo de aplicaciones móviles con React Native para iOS y Android.",
      })
    } else if (formData.specialization === "Seguridad y redes") {
      experiences.push({
        title: "Asistente de Seguridad IT (Prácticas)",
        company: "SecureNet",
        startDate: "2023-04-01",
        endDate: "2023-08-31",
        description: "Implementación de políticas de seguridad y análisis de vulnerabilidades.",
      })
    } else if (formData.specialization === "Gestión de datos en aplicaciones móviles") {
      experiences.push({
        title: "Desarrollador Backend para Apps (Proyecto)",
        company: "MobileData Systems",
        startDate: "2023-07-01",
        endDate: "2023-10-31",
        description: "Diseño e implementación de APIs y sistemas de sincronización para aplicaciones móviles.",
      })
    }

    return experiences
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información personal y currículum</p>
        </div>

        {updateSuccess && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription>Tu información ha sido actualizada correctamente.</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList>
              <TabsTrigger value="personal">Información Personal</TabsTrigger>
              <TabsTrigger value="curriculum">Currículum</TabsTrigger>
              <TabsTrigger value="evaluaciones">Historial de Evaluaciones</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>Actualiza tu información de perfil</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} alt="Avatar" />
                          <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                        </Avatar>
                        <input
                          type="file"
                          id="avatar-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0]
                              const reader = new FileReader()
                              reader.onload = (event) => {
                                if (event.target && typeof event.target.result === "string") {
                                  updateUser({
                                    avatarUrl: event.target.result,
                                  })
                                }
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => document.getElementById("avatar-upload")?.click()}
                        >
                          Cambiar foto
                        </Button>
                      </div>
                      <div className="space-y-4 flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nombre completo</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="studentId">Matrícula</Label>
                            <Input
                              id="studentId"
                              name="studentId"
                              value={formData.studentId}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="career">Carrera</Label>
                            <Select
                              value={formData.career}
                              onValueChange={(value) => handleSelectChange("career", value)}
                            >
                              <SelectTrigger id="career">
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
                            <Select
                              value={formData.semester}
                              onValueChange={(value) => handleSelectChange("semester", value)}
                            >
                              <SelectTrigger id="semester">
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
                            >
                              <SelectTrigger id="specialization">
                                <SelectValue placeholder="Selecciona tu especialidad" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Gestión de datos">Gestión de datos</SelectItem>
                                <SelectItem value="Programación Multiplataforma">
                                  Programación Multiplataforma
                                </SelectItem>
                                <SelectItem value="Seguridad y redes">Seguridad y redes</SelectItem>
                                <SelectItem value="Gestión de datos en aplicaciones móviles">
                                  Gestión de datos en aplicaciones móviles
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Biografía</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Cuéntanos un poco sobre ti (opcional)"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? "Guardando..." : "Guardar cambios"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="curriculum" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Currículum</CardTitle>
                  <CardDescription>Sube y gestiona tu CV para análisis de habilidades</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!userCV || !userCV.fileName ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">
                        Aún no has subido tu CV. Sube tu CV para recibir análisis y recomendaciones personalizadas.
                      </p>
                      <Button asChild>
                        <Link href="/resume">Ir a subir CV</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                          <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">{userCV.fileName}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{userCV.fileSize}</span>
                          <span>•</span>
                          <span>Subido el {formatDate(userCV.uploadDate)}</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                          {userCV.skills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 mt-6">
                        <Button variant="outline" size="sm" onClick={handleDownloadCV}>
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4 mr-2" />
                              Actualizar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Actualizar currículum</DialogTitle>
                              <DialogDescription>
                                Sube una nueva versión de tu CV para actualizar tu perfil
                              </DialogDescription>
                            </DialogHeader>
                            <div
                              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center ${
                                isDragging ? "border-primary bg-primary/5" : ""
                              }`}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                            >
                              <input
                                type="file"
                                className="hidden"
                                id="cv-upload"
                                ref={fileInputRef}
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                              />
                              <Label
                                htmlFor="cv-upload"
                                className="flex flex-col items-center justify-center cursor-pointer"
                              >
                                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                <span className="text-sm font-medium">Haz clic para seleccionar un archivo</span>
                                <span className="text-xs text-muted-foreground mt-1">o arrastra y suelta aquí</span>
                                <span className="text-xs text-muted-foreground mt-4">
                                  Formatos soportados: PDF, DOC, DOCX (Max. 5MB)
                                </span>
                              </Label>
                              {selectedFile && (
                                <div className="mt-4 flex items-center gap-2">
                                  <File className="h-4 w-4 text-primary" />
                                  <span className="text-sm font-medium">{selectedFile.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ({formatFileSize(selectedFile.size)})
                                  </span>
                                </div>
                              )}
                              {uploadError && <div className="mt-2 text-sm text-red-500">{uploadError}</div>}
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setSelectedFile(null)}>
                                Cancelar
                              </Button>
                              <Button onClick={handleUploadCV} disabled={!selectedFile || isUpdating}>
                                {isUpdating ? "Subiendo..." : "Subir CV"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                          <X className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  )}

                  {userCV && userCV.fileName && (
                    <>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Análisis de CV</h3>
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Habilidades detectadas</h4>
                            <div className="flex flex-wrap gap-2">
                              {userCV.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Experiencia laboral</h4>
                            <div className="space-y-3">
                              {userCV.experience.map((exp, index) => (
                                <div key={index} className="border rounded-lg p-3">
                                  <h5 className="font-medium">{exp.title}</h5>
                                  <p className="text-sm text-muted-foreground">
                                    {exp.company} - {formatDate(exp.startDate)} a {formatDate(exp.endDate)}
                                  </p>
                                  <p className="text-sm mt-1">{exp.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Formación académica</h4>
                            <div className="space-y-3">
                              {userCV.education.map((edu, index) => (
                                <div key={index} className="border rounded-lg p-3">
                                  <h5 className="font-medium">{edu.degree}</h5>
                                  <p className="text-sm text-muted-foreground">
                                    {edu.institution} - {formatDate(edu.startDate)} a {formatDate(edu.endDate)}
                                  </p>
                                  \
                                  {edu.specialization && (
                                    <p className="text-sm mt-1">Especialización: {edu.specialization}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Recomendaciones</h3>
                        <div className="space-y-3">
                          <div className="border rounded-lg p-3">
                            <p className="text-sm">
                              Añade más detalles sobre proyectos personales para destacar tus habilidades prácticas.
                            </p>
                          </div>
                          <div className="border rounded-lg p-3">
                            <p className="text-sm">Incluye certificaciones obtenidas para validar tus conocimientos.</p>
                          </div>
                          <div className="border rounded-lg p-3">
                            <p className="text-sm">Destaca tus habilidades específicas en {formData.specialization}.</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {showUploadSuccess && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertTitle>CV actualizado correctamente</AlertTitle>
                  <AlertDescription>Tu currículum ha sido actualizado y está siendo analizado.</AlertDescription>
                </Alert>
              )}

              {showDeleteConfirm && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>¿Estás seguro de que deseas eliminar tu CV?</AlertTitle>
                  <AlertDescription>Esta acción no se puede deshacer y perderás el análisis asociado.</AlertDescription>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                      Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteCV}>
                      Eliminar
                    </Button>
                  </div>
                </Alert>
              )}
            </TabsContent>
            <TabsContent value="evaluaciones" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Evaluaciones</CardTitle>
                  <CardDescription>Registro completo de tus evaluaciones técnicas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Evaluaciones recientes</h3>
                      {testResults.length > 0 ? (
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
                            {testResults.map((test, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] gap-4 p-4 items-center"
                              >
                                <div className="font-medium">{test.name}</div>
                                <div className="text-sm text-muted-foreground hidden md:block">
                                  {new Date(test.date).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-muted-foreground hidden md:block">{test.category}</div>
                                <div
                                  className={`font-medium ${
                                    test.score >= 70
                                      ? "text-green-500"
                                      : test.score >= 50
                                        ? "text-amber-500"
                                        : "text-red-500"
                                  }`}
                                >
                                  {test.score}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 border rounded-md">
                          <p className="text-muted-foreground">No has completado ninguna evaluación todavía.</p>
                          <Button className="mt-4" asChild>
                            <a href="/tests">Realizar mi primer test</a>
                          </Button>
                        </div>
                      )}
                    </div>

                    {testResults.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Evolución de habilidades</h3>
                        <div className="space-y-4">
                          {skills.slice(0, 5).map((skill, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{skill.name}</span>
                                <span className="text-sm font-medium">{skill.score}%</span>
                              </div>
                              <Progress value={skill.score} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/tests">Ver todos los tests disponibles</a>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nivel actual</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {user?.level === "Principiante" ? "Pri." : user?.level === "Intermedio" ? "Int." : "Avz."}
                  </span>
                </div>
                <h3 className="text-xl font-bold">{user?.level || "Principiante"}</h3>
                <p className="text-sm text-muted-foreground mt-1">Basado en tus evaluaciones</p>
                <div className="w-full mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso hacia {user?.level === "Principiante" ? "Intermedio" : "Avanzado"}</span>
                    <span>{user?.level === "Principiante" ? "45" : user?.level === "Intermedio" ? "65" : "100"}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${user?.level === "Principiante" ? "45" : user?.level === "Intermedio" ? "65" : "100"}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Especialidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <Badge className="px-3 py-1 text-base">{formData.specialization || "No especificada"}</Badge>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  {formData.specialization === "Gestión de datos" &&
                    "Especializado en el manejo y análisis de grandes volúmenes de datos."}
                  {formData.specialization === "Programación Multiplataforma" &&
                    "Especializado en el desarrollo de aplicaciones para múltiples plataformas."}
                  {formData.specialization === "Seguridad y redes" &&
                    "Especializado en la implementación de soluciones de seguridad y redes."}
                  {formData.specialization === "Gestión de datos en aplicaciones móviles" &&
                    "Especializado en el manejo de datos en entornos móviles."}
                  {!formData.specialization &&
                    "Selecciona una especialidad en tu perfil para recibir recomendaciones personalizadas."}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Habilidades destacadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {skills.length > 0 ? (
                  skills.slice(0, 5).map((skill, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-sm font-medium">{skill.score}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            skill.score >= 70 ? "bg-green-500" : skill.score >= 50 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${skill.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center">
                    Completa tests para ver tus habilidades destacadas.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
