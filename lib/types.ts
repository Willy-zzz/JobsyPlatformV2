// Tipos para la aplicación

export interface User {
  id: string
  name: string
  email: string
  password: string
  studentId: string
  career: string
  semester: string
  specialization: string
  bio: string
  level: "Principiante" | "Intermedio" | "Avanzado"
  avatarUrl?: string
  createdAt: string
}

export interface TestResult {
  id: string
  testId: string
  userId: string
  score: number
  answers: Record<number, string>
  date: string
  category: string
  name: string
}

export interface Test {
  id: string
  title: string
  description: string
  duration: string
  questions: TestQuestion[]
  category: string
  icon: string
  difficulty: string
}

export interface TestQuestion {
  id: number
  question: string
  options: TestOption[]
  correctAnswer: string
}

export interface TestOption {
  id: string
  text: string
}

export interface Recommendation {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration: string
  icon: string
  progress?: number
  completed?: boolean
  highlighted?: boolean
  url?: string
}

export interface Skill {
  name: string
  score: number
  category: string
}

export interface UserCV {
  userId: string
  fileName: string
  fileSize: string
  fileType: string
  fileUrl: string // Changed from fileContent to fileUrl
  uploadDate: string
  skills: string[]
  experience: {
    title: string
    company: string
    startDate: string
    endDate: string
    description: string
  }[]
  education: {
    degree: string
    institution: string
    startDate: string
    endDate: string
    specialization?: string
  }[]
  lastAnalysisDate: string
}

export interface CategoryPerformanceData {
  title: string
  score: number
  change: number
  tests: number
  lastTest: string
  skills: {
    name: string
    score: number
  }[]
}
