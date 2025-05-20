"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { getTest, saveTestResult } from "@/lib/data-service"
import type { Test, TestResult } from "@/lib/types"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function TestPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [test, setTest] = useState<Test | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [testResult, setTestResult] = useState<{
    score: number
    correctAnswers: number
    totalQuestions: number
  } | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const testData = await getTest(id)
        if (testData) {
          setTest(testData)
        }
      } catch (error) {
        console.error("Error fetching test:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTest()
  }, [id])

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < (test?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    if (!test) return 0

    let correctAnswers = 0
    test.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++
      }
    })

    return (correctAnswers / test.questions.length) * 100
  }

  const calculateCorrectAnswers = () => {
    if (!test) return 0

    let correctAnswers = 0
    test.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++
      }
    })

    return correctAnswers
  }

  const handleSubmit = async () => {
    if (!test) return

    setSubmitting(true)

    try {
      const score = calculateScore()
      const correctAnswers = calculateCorrectAnswers()

      const result: TestResult = {
        id: `result_${Date.now()}`,
        testId: test.id,
        userId: user?.id || "guest",
        score: Math.round(score),
        answers,
        date: new Date().toISOString(),
        category: test.category,
        name: test.title,
      }

      // Solo guardar resultados si el usuario está autenticado
      if (user) {
        await saveTestResult(result)

        // Establecer el resultado del test para mostrarlo
        setTestResult({
          score: Math.round(score),
          correctAnswers,
          totalQuestions: test.questions.length,
        })

        // Marcar el test como completado
        setTestCompleted(true)
      } else {
        // Redirigir a login si no está autenticado
        router.push("/login?message=Para guardar tus resultados, inicia sesión")
      }
    } catch (error) {
      console.error("Error submitting test:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleViewResults = () => {
    router.push("/tests/results")
  }

  const handleTakeAnotherTest = () => {
    router.push("/tests")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!test) {
    return (
      <div className="container mx-auto p-4">
        <Card className="border-2 border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">Test no encontrado</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Si el test está completado, mostrar los resultados
  if (testCompleted && testResult) {
    return (
      <div className="container mx-auto p-4">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5 dark:from-gray-900 dark:to-primary/10">
          <CardHeader className="bg-primary/10 pb-2">
            <CardTitle className="text-xl font-bold text-primary">Resultados del Test: {test.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <span className="text-3xl font-bold text-primary">{testResult.score}%</span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">
                {testResult.score >= 70
                  ? "¡Excelente trabajo!"
                  : testResult.score >= 50
                    ? "¡Buen intento!"
                    : "Sigue practicando"}
              </h3>
              <p className="text-muted-foreground">
                Has respondido correctamente {testResult.correctAnswers} de {testResult.totalQuestions} preguntas
              </p>
            </div>

            <div className="w-full max-w-md mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Puntuación</span>
                <span className="text-sm font-medium">{testResult.score}%</span>
              </div>
              <Progress
                value={testResult.score}
                className="h-3"
                indicatorClassName={
                  testResult.score >= 70 ? "bg-green-500" : testResult.score >= 50 ? "bg-amber-500" : "bg-red-500"
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
              <div className="border rounded-lg p-4 flex items-center">
                <div className="mr-3 p-2 rounded-full bg-primary/10">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Respuestas correctas</p>
                  <p className="text-2xl font-bold">{testResult.correctAnswers}</p>
                </div>
              </div>

              <div className="border rounded-lg p-4 flex items-center">
                <div className="mr-3 p-2 rounded-full bg-primary/10">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Respuestas incorrectas</p>
                  <p className="text-2xl font-bold">{testResult.totalQuestions - testResult.correctAnswers}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4 pt-4">
            <Button variant="outline" onClick={handleTakeAnotherTest}>
              Realizar otro test
            </Button>
            <Button onClick={handleViewResults}>Ver historial de resultados</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const currentQuestionData = test.questions[currentQuestion]

  return (
    <div className="container mx-auto p-4">
      {!user && (
        <Card className="mb-4 border-2 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-4">
            <p className="text-amber-600">
              Estás realizando este test como invitado. Para guardar tus resultados,
              <a href="/login" className="ml-1 font-medium text-amber-700 underline">
                inicia sesión
              </a>
              .
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="mb-4 border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5 dark:from-gray-900 dark:to-primary/10">
        <CardHeader className="bg-primary/10 pb-2">
          <CardTitle className="text-xl font-bold text-primary">{test.title}</CardTitle>
          <p className="text-sm text-gray-500">Categoría: {test.category}</p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4 flex justify-between">
            <span className="text-sm font-medium text-gray-500">
              Pregunta {currentQuestion + 1} de {test.questions.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round((currentQuestion / test.questions.length) * 100)}% completado
            </span>
          </div>

          <div className="mb-6 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(currentQuestion / test.questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="mb-6">
            <h3 className="mb-4 text-lg font-medium">{currentQuestionData.question}</h3>
            <RadioGroup value={answers[currentQuestion]} onValueChange={handleAnswerChange}>
              {currentQuestionData.options.map((option, index) => (
                <div
                  key={index}
                  className="mb-3 flex items-start space-x-2 rounded-lg border p-3 transition-all hover:border-primary/50 hover:bg-primary/5"
                >
                  <RadioGroupItem value={option.id} id={`option-${index}`} className="mt-1" />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-normal">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="border-primary/30 hover:bg-primary/10 hover:text-primary"
            >
              Anterior
            </Button>

            {currentQuestion < test.questions.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
                className="bg-primary hover:bg-primary/90"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!answers[currentQuestion] || submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Finalizar Test"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
