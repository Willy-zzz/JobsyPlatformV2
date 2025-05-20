"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { getUserCV, saveUserCV } from "@/lib/data-service"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Upload, FileText, Download, RefreshCw, Trash2 } from "lucide-react"
import type { UserCV } from "@/lib/types"

export default function ResumePage() {
  const { user } = useAuth()
  const [cv, setCV] = useState<UserCV | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchCV = async () => {
      if (!user) return

      try {
        const userCV = await getUserCV(user.id)
        setCV(userCV)
      } catch (error) {
        console.error("Error fetching CV:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCV()
  }, [user])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    setUploadError("")

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!validTypes.includes(file.type)) {
      setUploadError("Formato de archivo no válido. Por favor, sube un archivo PDF o Word.")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("El archivo es demasiado grande. El tamaño máximo es 5MB.")
      return
    }

    try {
      // Read file as base64
      const reader = new FileReader()
      reader.onload = async (event) => {
        if (!event.target || typeof event.target.result !== "string") return

        const fileContent = event.target.result
        const newCV: UserCV = {
          userId: user.id,
          fileName: file.name,
          fileSize: `${(file.size / 1024).toFixed(2)} KB`,
          fileType: file.type,
          fileContent: fileContent,
          uploadDate: new Date().toISOString(),
          skills: cv?.skills || [],
          experience: cv?.experience || [],
          education: cv?.education || [],
          lastAnalysisDate: "",
        }

        await saveUserCV(newCV)
        setCV(newCV)

        // Analyze the CV
        analyzeCV(newCV)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading CV:", error)
      setUploadError("Error al subir el archivo. Por favor, inténtalo de nuevo.")
    }
  }

  const analyzeCV = async (cvData: UserCV) => {
    if (!user) return

    setAnalyzing(true)
    try {
      // Simulate CV analysis
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Extract skills based on specialization
      const skillsBySpecialization: Record<string, string[]> = {
        "Programación Multiplataforma": ["React", "React Native", "Flutter", "JavaScript", "TypeScript", "CSS"],
        "Gestión de datos": ["SQL", "MongoDB", "PostgreSQL", "Data Modeling", "ETL", "Data Analysis"],
        "Seguridad y redes": ["Network Security", "Firewalls", "Encryption", "VPN", "Security Protocols"],
        "Gestión de datos en aplicaciones móviles": ["SQLite", "Realm", "Firebase", "Offline Storage", "Data Sync"],
      }

      // Get skills based on user specialization
      const userSkills = skillsBySpecialization[user.specialization] || []

      // Randomly select 3-5 skills
      const numSkills = Math.floor(Math.random() * 3) + 3
      const selectedSkills = [...userSkills].sort(() => 0.5 - Math.random()).slice(0, numSkills)

      // Generate random experience entries
      const experience = [
        {
          title: "Desarrollador de Software",
          company: "TechSolutions",
          period: "2022 - Presente",
          description: "Desarrollo de aplicaciones web y móviles utilizando tecnologías modernas.",
        },
        {
          title: "Pasante de Desarrollo",
          company: "InnovaTech",
          period: "2021 - 2022",
          description: "Colaboración en proyectos de desarrollo web y aprendizaje de metodologías ágiles.",
        },
      ]

      // Generate random education entries
      const education = [
        {
          degree: "Ingeniería en Sistemas Computacionales",
          institution: "Tecnológico de México, Campus Villahermosa",
          period: "2019 - 2023",
        },
        {
          degree: "Curso de Desarrollo Web Full Stack",
          institution: "Platzi",
          period: "2021",
        },
      ]

      // Update CV with analysis results
      const updatedCV: UserCV = {
        ...cvData,
        skills: selectedSkills,
        experience,
        education,
        lastAnalysisDate: new Date().toISOString(),
      }

      await saveUserCV(updatedCV)
      setCV(updatedCV)
    } catch (error) {
      console.error("Error analyzing CV:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleDeleteCV = async () => {
    if (!user || !cv) return

    try {
      // Create empty CV
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

      await saveUserCV(emptyCV)
      setCV(emptyCV)
    } catch (error) {
      console.error("Error deleting CV:", error)
    }
  }

  const handleDownloadCV = () => {
    if (!cv || !cv.fileContent) return

    // Create a link element
    const link = document.createElement("a")
    link.href = cv.fileContent
    link.download = cv.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const hasCV = cv && cv.fileName && cv.fileContent

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Mi Currículum</h1>

        <Tabs defaultValue={hasCV ? "view" : "upload"}>
          <TabsList>
            <TabsTrigger value="upload">Subir CV</TabsTrigger>
            <TabsTrigger value="view" disabled={!hasCV}>
              Ver CV
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Subir Currículum</CardTitle>
                <CardDescription>Sube tu CV para que podamos analizar tus habilidades y experiencia</CardDescription>
              </CardHeader>
              <CardContent>
                {uploadError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Arrastra y suelta tu CV aquí</h3>
                  <p className="text-sm text-gray-500 mb-4">O haz clic para seleccionar un archivo</p>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button onClick={() => fileInputRef.current?.click()}>Seleccionar archivo</Button>
                  <p className="text-xs text-gray-500 mt-4">Formatos aceptados: PDF, DOC, DOCX. Tamaño máximo: 5MB</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {hasCV && (
                  <Button variant="outline" onClick={handleDeleteCV}>
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar CV actual
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="view" className="mt-4">
            {hasCV ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Información del CV</CardTitle>
                    <CardDescription>Detalles de tu currículum subido</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Nombre del archivo</Label>
                        <div className="flex items-center mt-1">
                          <FileText className="mr-2 h-4 w-4 text-gray-500" />
                          <span>{cv.fileName}</span>
                        </div>
                      </div>
                      <div>
                        <Label>Tamaño</Label>
                        <div className="mt-1">{cv.fileSize}</div>
                      </div>
                      <div>
                        <Label>Fecha de subida</Label>
                        <div className="mt-1">
                          {new Date(cv.uploadDate).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                      <div>
                        <Label>Último análisis</Label>
                        <div className="mt-1">
                          {cv.lastAnalysisDate
                            ? new Date(cv.lastAnalysisDate).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "No analizado"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleDownloadCV}>
                      <Download className="mr-2 h-4 w-4" /> Descargar CV
                    </Button>
                    <Button onClick={() => analyzeCV(cv)} disabled={analyzing}>
                      {analyzing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Analizando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" /> Analizar de nuevo
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vista previa del CV</CardTitle>
                    <CardDescription>Visualización del documento subido</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center">
                    {cv.fileType.includes("pdf") ? (
                      <div className="w-full h-96 border rounded-md overflow-hidden">
                        <iframe src={cv.fileContent} className="w-full h-full" title="Vista previa del CV" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-8">
                        <FileText className="h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-500">
                          Vista previa no disponible para este tipo de archivo.
                          <br />
                          Puedes descargar el documento para visualizarlo.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No hay CV</AlertTitle>
                <AlertDescription>
                  Aún no has subido tu currículum. Ve a la pestaña "Subir CV" para comenzar.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
