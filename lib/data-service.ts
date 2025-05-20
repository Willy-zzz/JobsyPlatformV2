// lib/data-service.ts

import type { Test, TestResult, Recommendation, Skill, UserCV, CategoryPerformanceData, User } from "@/lib/types"
import fs from "fs"
import path from "path"
import { cookies } from "next/headers"

// File paths for server-side data storage
const DATA_DIR = path.join(process.cwd(), "data")
const USERS_FILE = path.join(DATA_DIR, "users.json")
const TESTS_FILE = path.join(DATA_DIR, "tests.json")
const TEST_RESULTS_FILE = path.join(DATA_DIR, "test-results.json")
const RECOMMENDATIONS_FILE = path.join(DATA_DIR, "recommendations.json")
const SKILLS_FILE = path.join(DATA_DIR, "skills.json")
const USER_CVS_FILE = path.join(DATA_DIR, "user-cvs.json")

// Asegurarnos de que defaultRecommendations esté definido correctamente
const defaultRecommendationsList = [
  {
    id: "1",
    title: "Curso: React desde cero",
    description: "Aprende los fundamentos de React y mejora tus habilidades de Frontend",
    category: "Frontend",
    difficulty: "Intermedio",
    duration: "10 horas",
    icon: "Code2",
    url: "https://www.freecodecamp.org/espanol/learn/front-end-development-libraries/#react",
    platform: "freeCodeCamp",
  },
  {
    id: "2",
    title: "Proyecto: API REST con Node.js",
    description: "Desarrolla una API completa con autenticación y base de datos",
    category: "Backend",
    difficulty: "Intermedio",
    duration: "15 horas",
    icon: "FileCode2",
    url: "https://www.udemy.com/course/nodejs-the-complete-guide/",
    platform: "Udemy",
  },
  {
    id: "3",
    title: "Curso: Algoritmos de ordenamiento",
    description: "Comprende y aplica los principales algoritmos de ordenamiento",
    category: "Algorithms",
    difficulty: "Intermedio",
    duration: "8 horas",
    icon: "Layers",
    url: "https://www.coursera.org/learn/algorithms-part1",
    platform: "Coursera",
  },
  {
    id: "4",
    title: "Ejercicio: Optimización de consultas SQL",
    description: "Mejora el rendimiento de consultas complejas en bases de datos",
    category: "Database",
    difficulty: "Avanzado",
    duration: "5 horas",
    icon: "Database",
    url: "https://www.codecademy.com/learn/learn-sql",
    platform: "Codecademy",
  },
  {
    id: "5",
    title: "Curso: Docker fundamentals",
    description: "Aprende a containerizar aplicaciones y gestionar imágenes",
    category: "DevOps",
    difficulty: "Principiante",
    duration: "12 horas",
    icon: "Layers",
    url: "https://www.docker.com/101-tutorial/",
    platform: "Documentación oficial",
  },
  {
    id: "11",
    title: "Introducción a la Ciberseguridad",
    description: "Aprende los fundamentos de la seguridad informática y protección de datos",
    category: "Security",
    difficulty: "Principiante",
    duration: "15 horas",
    icon: "Shield",
    url: "https://www.netacad.com/es/courses/introduction-to-cybersecurity?courseLang=es-XL",
    platform: "Netacad",
  },
  {
    id: "12",
    title: "Curso: Desarrollo de aplicaciones móviles con Flutter",
    description: "Crea aplicaciones nativas para iOS y Android con un solo código base",
    category: "Mobile",
    difficulty: "Intermedio",
    duration: "25 horas",
    icon: "Smartphone",
    url: "https://flutter.dev/learn",
    platform: "Documentación oficial",
  },
  {
    id: "13",
    title: "Fundamentos de AWS Cloud",
    description: "Aprende a utilizar los servicios básicos de Amazon Web Services",
    category: "Cloud",
    difficulty: "Principiante",
    duration: "20 horas",
    icon: "Cloud",
    url: "https://aws.amazon.com/es/training/learn-about/",
    platform: "AWS Training",
  },
  {
    id: "14",
    title: "Curso: Machine Learning con Python",
    description: "Introducción a los algoritmos de aprendizaje automático",
    category: "IA",
    difficulty: "Intermedio",
    duration: "30 horas",
    icon: "Brain",
    url: "https://www.coursera.org/learn/machine-learning-with-python",
    platform: "Coursera",
  },
  {
    id: "15",
    title: "Diseño de Interfaces de Usuario",
    description: "Aprende los principios fundamentales del diseño UI/UX",
    category: "Design",
    difficulty: "Principiante",
    duration: "12 horas",
    icon: "Palette",
    url: "https://www.interaction-design.org/courses",
    platform: "Interaction Design",
  },
]

// Asignar defaultRecommendationsList a defaultRecommendations
const defaultRecommendations = defaultRecommendationsList

// Define default tests
const defaultTests = [
  {
    id: "1",
    title: "Frontend Básico",
    description: "HTML, CSS y JavaScript fundamentales",
    duration: "30 minutos",
    category: "Frontend",
    icon: "LayoutGrid",
    difficulty: "Principiante",
    questions: [
      {
        id: 1,
        question: "¿Cuál es la forma correcta de declarar una variable en JavaScript moderno?",
        options: [
          { id: "a", text: "var nombre = 'valor';" },
          { id: "b", text: "let nombre = 'valor';" },
          { id: "c", text: "const nombre = 'valor';" },
          { id: "d", text: "Tanto b como c son correctas." },
        ],
        correctAnswer: "d",
      },
      {
        id: 2,
        question: "¿Qué propiedad CSS se utiliza para cambiar el color de fondo de un elemento?",
        options: [
          { id: "a", text: "color" },
          { id: "b", text: "background-color" },
          { id: "c", text: "bgcolor" },
          { id: "d", text: "background" },
        ],
        correctAnswer: "b",
      },
      {
        id: 3,
        question: "¿Cuál es la etiqueta HTML correcta para crear un hipervínculo?",
        options: [
          { id: "a", text: "<a>" },
          { id: "b", text: "<link>" },
          { id: "c", text: "<href>" },
          { id: "d", text: "<hyperlink>" },
        ],
        correctAnswer: "a",
      },
      {
        id: 4,
        question: "¿Qué método de array se utiliza para agregar elementos al final?",
        options: [
          { id: "a", text: "push()" },
          { id: "b", text: "append()" },
          { id: "c", text: "add()" },
          { id: "d", text: "insert()" },
        ],
        correctAnswer: "a",
      },
      {
        id: 5,
        question: "¿Cuál es el selector CSS para seleccionar elementos con una clase específica?",
        options: [
          { id: "a", text: "#nombre" },
          { id: "b", text: ".nombre" },
          { id: "c", text: "*nombre" },
          { id: "d", text: "nombre" },
        ],
        correctAnswer: "b",
      },
    ],
  },
  {
    id: "2",
    title: "Algoritmos y Estructuras",
    description: "Ordenamiento, búsqueda y estructuras de datos",
    duration: "45 minutos",
    category: "Algoritmos",
    icon: "Layers",
    difficulty: "Intermedio",
    questions: [
      {
        id: 1,
        question: "¿Cuál es la complejidad temporal del algoritmo de ordenamiento QuickSort en el caso promedio?",
        options: [
          { id: "a", text: "O(n)" },
          { id: "b", text: "O(n log n)" },
          { id: "c", text: "O(n²)" },
          { id: "d", text: "O(log n)" },
        ],
        correctAnswer: "b",
      },
      {
        id: 2,
        question: "¿Qué estructura de datos funciona bajo el principio LIFO (Last In, First Out)?",
        options: [
          { id: "a", text: "Cola (Queue)" },
          { id: "b", text: "Pila (Stack)" },
          { id: "c", text: "Lista enlazada (Linked List)" },
          { id: "d", text: "Árbol (Tree)" },
        ],
        correctAnswer: "b",
      },
      {
        id: 3,
        question: "¿Cuál de los siguientes algoritmos de ordenamiento es más eficiente para arreglos casi ordenados?",
        options: [
          { id: "a", text: "Bubble Sort" },
          { id: "b", text: "Merge Sort" },
          { id: "c", text: "Insertion Sort" },
          { id: "d", text: "Selection Sort" },
        ],
        correctAnswer: "c",
      },
      {
        id: 4,
        question: "¿Qué estructura de datos es más adecuada para implementar un diccionario?",
        options: [
          { id: "a", text: "Array" },
          { id: "b", text: "Linked List" },
          { id: "c", text: "Hash Table" },
          { id: "d", text: "Stack" },
        ],
        correctAnswer: "c",
      },
      {
        id: 5,
        question: "¿Cuál es la complejidad temporal de la búsqueda binaria?",
        options: [
          { id: "a", text: "O(n)" },
          { id: "b", text: "O(n log n)" },
          { id: "c", text: "O(n²)" },
          { id: "d", text: "O(log n)" },
        ],
        correctAnswer: "d",
      },
    ],
  },
]

// Initialize localStorage with default data if it doesn't exist
export function initializeLocalStorage() {
  if (typeof window === "undefined") return // Only run on client

  // Initialize users if not exists
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]))
  }

  // Initialize tests if not exists
  if (!localStorage.getItem("tests")) {
    localStorage.setItem("tests", JSON.stringify(defaultTests))
  }

  // Initialize test results if not exists
  if (!localStorage.getItem("testResults")) {
    localStorage.setItem("testResults", JSON.stringify([]))
  }

  // Initialize recommendations if not exists
  if (!localStorage.getItem("recommendations")) {
    localStorage.setItem("recommendations", JSON.stringify(defaultRecommendations))
  }

  // Initialize user CVs if not exists
  if (!localStorage.getItem("userCVs")) {
    localStorage.setItem("userCVs", JSON.stringify([]))
  }

  // Initialize skills if not exists
  if (!localStorage.getItem("skills")) {
    localStorage.setItem("skills", JSON.stringify([]))
  }
}

// Ensure data directory exists
export function ensureDataDir() {
  if (typeof window !== "undefined") return // Only run on server

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    // Initialize files if they don't exist
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([]))
    }

    if (!fs.existsSync(TESTS_FILE)) {
      fs.writeFileSync(TESTS_FILE, JSON.stringify(defaultTests))
    }

    if (!fs.existsSync(TEST_RESULTS_FILE)) {
      fs.writeFileSync(TEST_RESULTS_FILE, JSON.stringify([]))
    }

    if (!fs.existsSync(RECOMMENDATIONS_FILE)) {
      fs.writeFileSync(RECOMMENDATIONS_FILE, JSON.stringify(defaultRecommendations))
    }

    if (!fs.existsSync(SKILLS_FILE)) {
      fs.writeFileSync(SKILLS_FILE, JSON.stringify([]))
    }

    if (!fs.existsSync(USER_CVS_FILE)) {
      fs.writeFileSync(USER_CVS_FILE, JSON.stringify([]))
    }
  } catch (error) {
    console.error("Error initializing data directory:", error)
  }
}

// Authentication functions
export async function getCurrentUser(): Promise<User | null> {
  if (typeof window !== "undefined") {
    // Client-side fallback
    const storedUser = localStorage.getItem("currentUser")
    return storedUser ? JSON.parse(storedUser) : null
  }

  // Server-side implementation
  const userId = cookies().get("userId")?.value
  if (!userId) return null

  try {
    ensureDataDir()
    const usersData = fs.readFileSync(USERS_FILE, "utf-8")
    const users: User[] = JSON.parse(usersData)
    return users.find((user) => user.id === userId) || null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  try {
    if (typeof window !== "undefined") {
      // Client-side fallback
      const users = JSON.parse(localStorage.getItem("users") || "[]") as User[]
      const user = users.find((u) => u.email === email && u.password === password)

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user))
        return { success: true }
      }

      return { success: false, message: "Credenciales inválidas" }
    }

    // Server-side implementation
    ensureDataDir()
    const usersData = fs.readFileSync(USERS_FILE, "utf-8")
    const users: User[] = JSON.parse(usersData)

    const user = users.find((u) => u.email === email && u.password === password)
    if (!user) {
      return { success: false, message: "Credenciales inválidas" }
    }

    // Set cookie
    cookies().set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "Error en el servidor" }
  }
}

export async function register(
  userData: Omit<User, "id" | "createdAt">,
): Promise<{ success: boolean; message?: string }> {
  try {
    if (typeof window !== "undefined") {
      // Client-side fallback
      const users = JSON.parse(localStorage.getItem("users") || "[]") as User[]

      if (users.some((u) => u.email === userData.email)) {
        return { success: false, message: "El correo ya está registrado" }
      }

      const newUser: User = {
        ...userData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("currentUser", JSON.stringify(newUser))

      // Initialize user data
      initializeUserData(newUser.id)

      return { success: true }
    }

    // Server-side implementation
    ensureDataDir()
    const usersData = fs.readFileSync(USERS_FILE, "utf-8")
    const users: User[] = JSON.parse(usersData)

    if (users.some((u) => u.email === userData.email)) {
      return { success: false, message: "El correo ya está registrado" }
    }

    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))

    // Set cookie
    cookies().set("userId", newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Initialize user data
    await initializeUserData(newUser.id)

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, message: "Error en el servidor" }
  }
}

export async function logout(): Promise<void> {
  if (typeof window !== "undefined") {
    // Client-side fallback
    localStorage.removeItem("currentUser")
    return
  }

  // Server-side implementation
  cookies().delete("userId")
}

export async function updateUser(userData: Partial<User>): Promise<boolean> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return false

    if (typeof window !== "undefined") {
      // Client-side fallback
      const users = JSON.parse(localStorage.getItem("users") || "[]") as User[]
      const updatedUsers = users.map((u) => (u.id === currentUser.id ? { ...u, ...userData } : u))

      localStorage.setItem("users", JSON.stringify(updatedUsers))
      localStorage.setItem("currentUser", JSON.stringify({ ...currentUser, ...userData }))

      return true
    }

    // Server-side implementation
    ensureDataDir()
    const usersData = fs.readFileSync(USERS_FILE, "utf-8")
    const users: User[] = JSON.parse(usersData)

    const updatedUsers = users.map((u) => (u.id === currentUser.id ? { ...u, ...userData } : u))
    fs.writeFileSync(USERS_FILE, JSON.stringify(updatedUsers, null, 2))

    return true
  } catch (error) {
    console.error("Update user error:", error)
    return false
  }
}

// Initialize data for a new user
export async function initializeUserData(userId: string): Promise<void> {
  if (typeof window !== "undefined") {
    // Client-side fallback
    // Initialize empty skills for the user
    const skills = JSON.parse(localStorage.getItem("skills") || "[]") as { userId: string; skills: Skill[] }[]
    if (!skills.some((s) => s.userId === userId)) {
      skills.push({ userId, skills: [] })
      localStorage.setItem("skills", JSON.stringify(skills))
    }

    // Initialize empty CV for the user
    const cvs = JSON.parse(localStorage.getItem("userCVs") || "[]") as UserCV[]
    if (!cvs.some((cv) => cv.userId === userId)) {
      cvs.push({
        userId,
        fileName: "",
        fileSize: "",
        fileType: "",
        fileContent: "",
        uploadDate: "",
        skills: [],
        experience: [],
        education: [],
        lastAnalysisDate: "",
      })
      localStorage.setItem("userCVs", JSON.stringify(cvs))
    }

    // Generate initial recommendations based on user specialization
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null")
    if (currentUser && currentUser.id === userId) {
      const specialization = currentUser.specialization
      generateInitialRecommendations(userId, specialization)
    }

    // Inicializar progreso en 0 para nuevos usuarios
    const progress = {
      userId,
      overall: 0,
      categories: {
        Frontend: 0,
        Backend: 0,
        "Bases de datos": 0,
        Algoritmos: 0,
        DevOps: 0,
      },
      lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem(`progress_${userId}`, JSON.stringify(progress))

    return
  }

  // Server-side implementation
  try {
    ensureDataDir()

    // Initialize empty skills for the user
    const skillsData = fs.readFileSync(SKILLS_FILE, "utf-8")
    const skills: { userId: string; skills: Skill[] }[] = JSON.parse(skillsData)

    if (!skills.some((s) => s.userId === userId)) {
      skills.push({ userId, skills: [] })
      fs.writeFileSync(SKILLS_FILE, JSON.stringify(skills, null, 2))
    }

    // Initialize empty CV for the user
    const cvsData = fs.readFileSync(USER_CVS_FILE, "utf-8")
    const cvs: UserCV[] = JSON.parse(cvsData)

    if (!cvs.some((cv) => cv.userId === userId)) {
      cvs.push({
        userId,
        fileName: "",
        fileSize: "",
        fileType: "",
        fileContent: "",
        uploadDate: "",
        skills: [],
        experience: [],
        education: [],
        lastAnalysisDate: "",
      })
      fs.writeFileSync(USER_CVS_FILE, JSON.stringify(cvs, null, 2))
    }

    // Create user uploads directory
    const userUploadsDir = path.join(process.cwd(), "public", "uploads", userId)
    if (!fs.existsSync(userUploadsDir)) {
      fs.mkdirSync(userUploadsDir, { recursive: true })
    }

    // Generate initial recommendations based on user specialization
    const usersData = fs.readFileSync(USERS_FILE, "utf-8")
    const users: User[] = JSON.parse(usersData)
    const user = users.find((u) => u.id === userId)

    if (user) {
      await generateInitialRecommendations(userId, user.specialization)
    }

    // Inicializar progreso en 0 para nuevos usuarios
    try {
      const progressPath = path.join(DATA_DIR, `progress_${userId}.json`)
      const progress = {
        userId,
        overall: 0,
        categories: {
          Frontend: 0,
          Backend: 0,
          "Bases de datos": 0,
          Algoritmos: 0,
          DevOps: 0,
        },
        lastUpdated: new Date().toISOString(),
      }
      fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2))
    } catch (error) {
      console.error("Error initializing user progress:", error)
    }
  } catch (error) {
    console.error("Error initializing user data:", error)
  }
}

// Generate initial recommendations based on user specialization
async function generateInitialRecommendations(userId: string, specialization: string): Promise<void> {
  try {
    if (typeof window !== "undefined") {
      // Client-side fallback
      // Get default recommendations
      const recommendations = [...defaultRecommendations]

      // Add specialization-specific recommendations
      if (specialization === "Gestión de datos") {
        recommendations.push(
          {
            id: "spec-1",
            title: "Curso: SQL Avanzado para Gestión de Datos",
            description: "Aprende técnicas avanzadas de SQL para gestionar grandes volúmenes de datos",
            category: "Bases de datos",
            difficulty: "Intermedio",
            duration: "15 horas",
            icon: "Database",
            url: "https://www.coursera.org/learn/sql-for-data-science",
          },
          {
            id: "spec-2",
            title: "Proyecto: Data Warehouse con ETL",
            description: "Implementa un data warehouse completo con procesos ETL",
            category: "Bases de datos",
            difficulty: "Avanzado",
            duration: "25 horas",
            icon: "Database",
            url: "https://www.udemy.com/course/data-warehouse-the-ultimate-guide/",
          },
        )
      } else if (specialization === "Programación Multiplataforma") {
        recommendations.push(
          {
            id: "spec-1",
            title: "Curso: React Native para aplicaciones móviles",
            description: "Desarrolla aplicaciones móviles multiplataforma con React Native",
            category: "Frontend",
            difficulty: "Intermedio",
            duration: "20 horas",
            icon: "Code2",
            url: "https://reactnative.dev/docs/getting-started",
          },
          {
            id: "spec-2",
            title: "Proyecto: Aplicación Multiplataforma con Flutter",
            description: "Crea una aplicación que funcione en iOS, Android y Web con Flutter",
            category: "Frontend",
            difficulty: "Intermedio",
            duration: "30 horas",
            icon: "Code2",
            url: "https://flutter.dev/learn",
          },
        )
      }

      // Save updated recommendations
      localStorage.setItem("recommendations", JSON.stringify(recommendations))
      return
    }

    // Server-side implementation
    ensureDataDir()
    const recommendationsData = fs.readFileSync(RECOMMENDATIONS_FILE, "utf-8")
    const recommendations: Recommendation[] = JSON.parse(recommendationsData)

    // Add specialization-specific recommendations
    if (specialization === "Gestión de datos") {
      recommendations.push(
        {
          id: "spec-1",
          title: "Curso: SQL Avanzado para Gestión de Datos",
          description: "Aprende técnicas avanzadas de SQL para gestionar grandes volúmenes de datos",
          category: "Bases de datos",
          difficulty: "Intermedio",
          duration: "15 horas",
          icon: "Database",
          url: "https://www.coursera.org/learn/sql-for-data-science",
        },
        {
          id: "spec-2",
          title: "Proyecto: Data Warehouse con ETL",
          description: "Implementa un data warehouse completo con procesos ETL",
          category: "Bases de datos",
          difficulty: "Avanzado",
          duration: "25 horas",
          icon: "Database",
          url: "https://www.udemy.com/course/data-warehouse-the-ultimate-guide/",
        },
      )
    } else if (specialization === "Programación Multiplataforma") {
      recommendations.push(
        {
          id: "spec-1",
          title: "Curso: React Native para aplicaciones móviles",
          description: "Desarrolla aplicaciones móviles multiplataforma con React Native",
          category: "Frontend",
          difficulty: "Intermedio",
          duration: "20 horas",
          icon: "Code2",
          url: "https://reactnative.dev/docs/getting-started",
        },
        {
          id: "spec-2",
          title: "Proyecto: Aplicación Multiplataforma con Flutter",
          description: "Crea una aplicación que funcione en iOS, Android y Web con Flutter",
          category: "Frontend",
          difficulty: "Intermedio",
          duration: "30 horas",
          icon: "Code2",
          url: "https://flutter.dev/learn",
        },
      )
    }

    fs.writeFileSync(RECOMMENDATIONS_FILE, JSON.stringify(recommendations, null, 2))
  } catch (error) {
    console.error("Error generating initial recommendations:", error)
  }
}

// Test related functions
export async function getTests(): Promise<Test[]> {
  try {
    if (typeof window !== "undefined") {
      // Client-side fallback
      return JSON.parse(localStorage.getItem("tests") || "[]")
    }

    // Server-side implementation
    ensureDataDir()
    const testsData = fs.readFileSync(TESTS_FILE, "utf-8")
    return JSON.parse(testsData)
  } catch (error) {
    console.error("Error getting tests:", error)
    return []
  }
}

// Added this function to fix the deployment error
export async function getTest(testId: string): Promise<Test | null> {
  return getTestById(testId)
}

export async function getTestById(testId: string): Promise<Test | null> {
  try {
    const tests = await getTests()
    return tests.find((test) => test.id === testId) || null
  } catch (error) {
    console.error("Error getting test by ID:", error)
    return null
  }
}

// Export Badge component for the UI
// Eliminamos la exportación incorrecta de Badge
// export const Badge = { Root: "div" }

// Rest of the functions...
// (Omitted for brevity but would include all the other functions from the original file)
export async function saveTestResult(result: TestResult): Promise<void> {
  try {
    if (typeof window !== "undefined") {
      // Client-side fallback
      const results = JSON.parse(localStorage.getItem("testResults") || "[]") as TestResult[]
      results.unshift(result)
      localStorage.setItem("testResults", JSON.stringify(results))

      // Update skills based on test result
      await updateSkillsFromTestResult(result)

      // Update user level based on test results
      await updateUserLevel(result.userId)

      // Update user progress
      await updateUserProgress(result.userId, result)

      return
    }

    // Server-side implementation
    ensureDataDir()
    const resultsData = fs.readFileSync(TEST_RESULTS_FILE, "utf-8")
    const results: TestResult[] = JSON.parse(resultsData)

    results.unshift(result)
    fs.writeFileSync(TEST_RESULTS_FILE, JSON.stringify(results, null, 2))

    // Update skills based on test result
    await updateSkillsFromTestResult(result)

    // Update user level based on test results
    await updateUserLevel(result.userId)

    // Update user progress
    await updateUserProgress(result.userId, result)
  } catch (error) {
    console.error("Error saving test result:", error)
  }
}

export async function updateUserProgress(userId: string, testResult: TestResult): Promise<void> {
  try {
    let progress

    if (typeof window !== "undefined") {
      // Cliente
      const progressData = localStorage.getItem(`progress_${userId}`)
      progress = progressData
        ? JSON.parse(progressData)
        : {
            userId,
            overall: 0,
            categories: {
              Frontend: 0,
              Backend: 0,
              "Bases de datos": 0,
              Algoritmos: 0,
              DevOps: 0,
            },
            lastUpdated: new Date().toISOString(),
          }

      // Actualizar progreso de la categoría
      if (progress.categories[testResult.category]) {
        // Promedio ponderado con más peso al nuevo resultado
        progress.categories[testResult.category] = Math.round(
          progress.categories[testResult.category] * 0.3 + testResult.score * 0.7,
        )
      } else {
        progress.categories[testResult.category] = testResult.score
      }

      // Calcular progreso general
      const categoryValues = Object.values(progress.categories) as number[]
      progress.overall = Math.round(categoryValues.reduce((sum, value) => sum + value, 0) / categoryValues.length)

      progress.lastUpdated = new Date().toISOString()
      localStorage.setItem(`progress_${userId}`, JSON.stringify(progress))
    } else {
      // Servidor
      try {
        const progressPath = path.join(DATA_DIR, `progress_${userId}.json`)
        let progress

        if (fs.existsSync(progressPath)) {
          const progressData = fs.readFileSync(progressPath, "utf-8")
          progress = JSON.parse(progressData)
        } else {
          progress = {
            userId,
            overall: 0,
            categories: {
              Frontend: 0,
              Backend: 0,
              "Bases de datos": 0,
              Algoritmos: 0,
              DevOps: 0,
            },
            lastUpdated: new Date().toISOString(),
          }
        }

        // Actualizar progreso de la categoría
        if (progress.categories[testResult.category]) {
          // Promedio ponderado con más peso al nuevo resultado
          progress.categories[testResult.category] = Math.round(
            progress.categories[testResult.category] * 0.3 + testResult.score * 0.7,
          )
        } else {
          progress.categories[testResult.category] = testResult.score
        }

        // Calcular progreso general
        const categoryValues = Object.values(progress.categories) as number[]
        progress.overall = Math.round(categoryValues.reduce((sum, value) => sum + value, 0) / categoryValues.length)

        progress.lastUpdated = new Date().toISOString()
        fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2))
      } catch (error) {
        console.error("Error updating user progress:", error)
      }
    }
  } catch (error) {
    console.error("Error updating user progress:", error)
  }
}

export async function getUserTestResults(userId: string): Promise<TestResult[]> {
  try {
    if (typeof window !== "undefined") {
      // Client-side fallback
      const results = JSON.parse(localStorage.getItem("testResults") || "[]") as TestResult[]
      return results.filter((result) => result.userId === userId)
    }

    // Server-side implementation
    ensureDataDir()
    const resultsData = fs.readFileSync(TEST_RESULTS_FILE, "utf-8")
    const results: TestResult[] = JSON.parse(resultsData)

    return results.filter((result) => result.userId === userId)
  } catch (error) {
    console.error("Error getting user test results:", error)
    return []
  }
}

// Recommendation related functions
export async function getRecommendations(): Promise<Recommendation[]> {
  try {
    if (typeof window !== "undefined") {
      // Client-side fallback
      const recommendations = JSON.parse(localStorage.getItem("recommendations") || "[]")
      return Array.isArray(recommendations) ? recommendations : []
    }

    // Server-side implementation
    ensureDataDir()
    const recommendationsData = fs.readFileSync(RECOMMENDATIONS_FILE, "utf-8")
    const recommendations = JSON.parse(recommendationsData)
    return Array.isArray(recommendations) ? recommendations : []
  } catch (error) {
    console.error("Error getting recommendations:", error)
    return []
  }
}

export async function getUserRecommendations(userId: string): Promise<Recommendation[]> {
  try {
    // Verificar si el archivo existe
    if (!fs.existsSync(path.join(process.cwd(), "data"))) {
      fs.mkdirSync(path.join(process.cwd(), "data"))
    }

    const recommendationsPath = path.join(process.cwd(), "data", "recommendations.json")

    if (!fs.existsSync(recommendationsPath)) {
      // Crear recomendaciones iniciales con cursos reales
      const initialRecommendations: Recommendation[] = [
        {
          id: "rec1",
          title: "Introducción a la Ciberseguridad",
          description:
            "Aprende los fundamentos de la ciberseguridad y protección de datos con este curso introductorio de Cisco Netacad.",
          category: "Security",
          difficulty: "Principiante",
          url: "https://www.netacad.com/es/courses/introduction-to-cybersecurity?courseLang=es-XL",
          platform: "Netacad",
        },
        {
          id: "rec2",
          title: "Machine Learning con Python",
          description: "Curso completo de Machine Learning con Python de la Universidad de Stanford en Coursera.",
          category: "IA",
          difficulty: "Intermedio",
          url: "https://www.coursera.org/learn/machine-learning",
          platform: "Coursera",
        },
        {
          id: "rec3",
          title: "Desarrollo Web Responsive",
          description: "Aprende a crear sitios web responsivos con HTML, CSS y JavaScript en freeCodeCamp.",
          category: "Frontend",
          difficulty: "Principiante",
          url: "https://www.freecodecamp.org/learn/responsive-web-design/",
          platform: "freeCodeCamp",
        },
        {
          id: "rec4",
          title: "Node.js para Backend",
          description: "Domina Node.js y Express para crear APIs robustas y aplicaciones backend escalables.",
          category: "Backend",
          difficulty: "Intermedio",
          url: "https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/",
          platform: "Udemy",
        },
        {
          id: "rec5",
          title: "React Native para Móviles",
          description: "Crea aplicaciones móviles nativas para iOS y Android con React Native.",
          category: "Mobile",
          difficulty: "Intermedio",
          url: "https://reactnative.dev/docs/getting-started",
          platform: "Documentación oficial",
        },
        {
          id: "rec6",
          title: "MongoDB para Desarrolladores",
          description: "Aprende a diseñar, construir y optimizar bases de datos NoSQL con MongoDB.",
          category: "Database",
          difficulty: "Intermedio",
          url: "https://university.mongodb.com/courses/M001/about",
          platform: "MongoDB University",
        },
        {
          id: "rec7",
          title: "DevOps con Docker y Kubernetes",
          description: "Implementa CI/CD y orquestación de contenedores con Docker y Kubernetes.",
          category: "DevOps",
          difficulty: "Avanzado",
          url: "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/",
          platform: "Udemy",
        },
        {
          id: "rec8",
          title: "AWS Cloud Practitioner",
          description: "Fundamentos de AWS Cloud para principiantes y preparación para la certificación.",
          category: "Cloud",
          difficulty: "Principiante",
          url: "https://aws.amazon.com/es/training/learn-about/cloud-practitioner/",
          platform: "AWS Training",
        },
        {
          id: "rec9",
          title: "Algoritmos y Estructuras de Datos",
          description: "Domina los algoritmos y estructuras de datos fundamentales para entrevistas técnicas.",
          category: "Algorithms",
          difficulty: "Intermedio",
          url: "https://www.coursera.org/specializations/algorithms",
          platform: "Coursera",
        },
        {
          id: "rec10",
          title: "UI/UX Design Fundamentals",
          description: "Aprende los principios del diseño de interfaces y experiencia de usuario.",
          category: "Design",
          difficulty: "Principiante",
          url: "https://www.udemy.com/course/ui-ux-web-design-using-adobe-xd/",
          platform: "Udemy",
        },
        {
          id: "rec11",
          title: "Flutter para Desarrollo Móvil",
          description: "Crea hermosas aplicaciones nativas para iOS y Android con Flutter.",
          category: "Mobile",
          difficulty: "Intermedio",
          url: "https://flutter.dev/docs/get-started/install",
          platform: "Documentación oficial",
        },
        {
          id: "rec12",
          title: "Azure Fundamentals",
          description: "Introducción a los servicios y conceptos de Microsoft Azure Cloud.",
          category: "Cloud",
          difficulty: "Principiante",
          url: "https://learn.microsoft.com/es-es/training/paths/azure-fundamentals/",
          platform: "Microsoft Learn",
        },
        {
          id: "rec13",
          title: "TensorFlow para Deep Learning",
          description: "Aprende a construir y entrenar redes neuronales con TensorFlow.",
          category: "IA",
          difficulty: "Avanzado",
          url: "https://www.tensorflow.org/tutorials",
          platform: "Documentación oficial",
        },
        {
          id: "rec14",
          title: "Seguridad en Aplicaciones Web",
          description: "Protege tus aplicaciones web contra vulnerabilidades comunes como XSS y CSRF.",
          category: "Security",
          difficulty: "Intermedio",
          url: "https://www.udemy.com/course/security-for-hackers-and-developers/",
          platform: "Udemy",
        },
        {
          id: "rec15",
          title: "GraphQL para APIs modernas",
          description: "Diseña APIs flexibles y eficientes con GraphQL como alternativa a REST.",
          category: "Backend",
          difficulty: "Intermedio",
          url: "https://graphql.org/learn/",
          platform: "Documentación oficial",
        },
      ]

      fs.writeFileSync(recommendationsPath, JSON.stringify(initialRecommendations, null, 2))
      return initialRecommendations
    }

    // Leer recomendaciones existentes
    const recommendationsData = fs.readFileSync(recommendationsPath, "utf8")
    const recommendations: Recommendation[] = JSON.parse(recommendationsData)

    // Obtener resultados de tests del usuario para personalizar recomendaciones
    const userResults = await getUserTestResults(userId)

    if (!userResults || userResults.length === 0) {
      // Si no hay resultados, devolver todas las recomendaciones
      return recommendations
    }

    // Analizar resultados para personalizar recomendaciones
    const categoryScores: Record<string, number> = {}

    userResults.forEach((result) => {
      if (!categoryScores[result.category]) {
        categoryScores[result.category] = 0
      }
      categoryScores[result.category] += result.score
    })

    // Normalizar puntuaciones
    Object.keys(categoryScores).forEach((category) => {
      const testsInCategory = userResults.filter((r) => r.category === category).length
      categoryScores[category] = categoryScores[category] / testsInCategory
    })

    // Ordenar recomendaciones basadas en puntuaciones bajas primero
    const sortedRecommendations = [...recommendations].sort((a, b) => {
      const scoreA = categoryScores[a.category] || 100
      const scoreB = categoryScores[b.category] || 100
      return scoreA - scoreB
    })

    return sortedRecommendations
  } catch (error) {
    console.error("Error getting user recommendations:", error)
    return []
  }
}

export async function updateRecommendationProgress(
  userId: string,
  recommendationId: string,
  progress: number,
): Promise<void> {
  try {
    if (typeof window !== "undefined") {
      // Client-side fallback
      const recommendations = JSON.parse(localStorage.getItem("recommendations") || "[]") as Recommendation[]
      const updatedRecommendations = recommendations.map((rec) =>
        rec.id === recommendationId ? { ...rec, progress } : rec,
      )

      localStorage.setItem("recommendations", JSON.stringify(updatedRecommendations))
      return
    }

    // Server-side implementation
    ensureDataDir()
    const recommendationsData = fs.readFileSync(RECOMMENDATIONS_FILE, "utf-8")
    const recommendations: Recommendation[] = JSON.parse(recommendationsData)

    const updatedRecommendations = recommendations.map((rec) =>
      rec.id === recommendationId ? { ...rec, progress } : rec,
    )

    fs.writeFileSync(RECOMMENDATIONS_FILE, JSON.stringify(updatedRecommendations, null, 2))
  } catch (error) {
    console.error("Error updating recommendation progress:", error)
  }
}

export async function completeRecommendation(userId: string, recommendationId: string): Promise<void> {
  try {
    if (typeof window !== "undefined") {
      // Client-side fallback
      const recommendations = JSON.parse(localStorage.getItem("recommendations") || "[]") as Recommendation[]
      const updatedRecommendations = recommendations.map((rec) =>
        rec.id === recommendationId ? { ...rec, completed: true, progress: 100 } : rec,
      )

      localStorage.setItem("recommendations", JSON.stringify(updatedRecommendations))
      return
    }

    // Server-side implementation
    ensureDataDir()
    const recommendationsData = fs.readFileSync(RECOMMENDATIONS_FILE, "utf-8")
    const recommendations: Recommendation[] = JSON.parse(recommendationsData)

    const updatedRecommendations = recommendations.map((rec) =>
      rec.id === recommendationId ? { ...rec, completed: true, progress: 100 } : rec,
    )

    fs.writeFileSync(RECOMMENDATIONS_FILE, JSON.stringify(updatedRecommendations, null, 2))
  } catch (error) {
    console.error("Error completing recommendation:", error)
  }
}

// CV related functions
export async function getUserCV(userId: string): Promise<UserCV | null> {
  try {
    if (typeof window !== "undefined") {
      // Client-side fallback
      const cvs = JSON.parse(localStorage.getItem("userCVs") || "[]") as UserCV[]
      return cvs.find((cv) => cv.userId === userId) || null
    }

    // Server-side implementation
    ensureDataDir()
    const cvsData = fs.readFileSync(USER_CVS_FILE, "utf-8")
    const cvs: UserCV[] = JSON.parse(cvsData)

    return cvs.find((cv) => cv.userId === userId) || null
  } catch (error) {
    console.error("Error getting user CV:", error)
    return null
  }
}

export async function saveUserCV(cv: UserCV): Promise<void> {
  try {
    if (typeof window !== "undefined") {
      // Client-side fallback
      const cvs = JSON.parse(localStorage.getItem("userCVs") || "[]") as UserCV[]
      const existingIndex = cvs.findIndex((c) => c.userId === cv.userId)

      if (existingIndex >= 0) {
        cvs[existingIndex] = cv
      } else {
        cvs.push(cv)
      }

      localStorage.setItem("userCVs", JSON.stringify(cvs))

      // Update skills based on CV
      if (cv.skills && cv.skills.length > 0) {
        await updateSkillsFromCV(cv)
      }

      return
    }

    // Server-side implementation
    ensureDataDir()
    const cvsData = fs.readFileSync(USER_CVS_FILE, "utf-8")
    const cvs: UserCV[] = JSON.parse(cvsData)

    const existingIndex = cvs.findIndex((c) => c.userId === cv.userId)

    if (existingIndex >= 0) {
      cvs[existingIndex] = cv
    } else {
      cvs.push(cv)
    }

    fs.writeFileSync(USER_CVS_FILE, JSON.stringify(cvs, null, 2))

    // Update skills based on CV
    if (cv.skills && cv.skills.length > 0) {
      await updateSkillsFromCV(cv)
    }

    // If there's file content, save it to the user's uploads directory
    if (cv.fileContent && cv.fileName) {
      const userUploadsDir = path.join(process.cwd(), "public", "uploads", cv.userId)

      if (!fs.existsSync(userUploadsDir)) {
        fs.mkdirSync(userUploadsDir, { recursive: true })
      }

      // Save the file
      const filePath = path.join(userUploadsDir, cv.fileName)

      // If fileContent is base64, decode it
      if (cv.fileContent.startsWith("data:")) {
        const base64Data = cv.fileContent.split(",")[1]
        const buffer = Buffer.from(base64Data, "base64")
        fs.writeFileSync(filePath, buffer)
      } else {
        fs.writeFileSync(filePath, cv.fileContent)
      }
    }
  } catch (error) {
    console.error("Error saving user CV:", error)
  }
}

// Update skills based on CV
async function updateSkillsFromCV(cv: UserCV): Promise<void> {
  try {
    const userId = cv.userId
    const userSkills = await getUserSkills(userId)

    // Merge CV skills with existing skills
    const updatedSkills = [...userSkills]

    cv.skills.forEach((cvSkill) => {
      const existingSkillIndex = updatedSkills.findIndex(
        (s) => s.name.toLowerCase() === cvSkill.toLowerCase() && s.category === "CV",
      )

      if (existingSkillIndex >= 0) {
        // Skill already exists, update score
        updatedSkills[existingSkillIndex].score = Math.min(updatedSkills[existingSkillIndex].score + 5, 100)
      } else {
        // Add new skill
        updatedSkills.push({
          name: cvSkill,
          score: 60, // Default score for CV-detected skills
          category: "CV",
        })
      }
    })

    await saveUserSkills(userId, updatedSkills)
  } catch (error) {
    console.error("Error updating skills from CV:", error)
  }
}

// Skills related functions
export async function getUserSkills(userId: string): Promise<Skill[]> {
  try {
    if (typeof window !== "undefined") {
      // Client-side fallback
      const skills = JSON.parse(localStorage.getItem("skills") || "[]") as { userId: string; skills: Skill[] }[]
      const userSkills = skills.find((s) => s.userId === userId)

      return userSkills ? userSkills.skills : []
    }

    // Server-side implementation
    ensureDataDir()
    const skillsData = fs.readFileSync(SKILLS_FILE, "utf-8")
    const skills: { userId: string; skills: Skill[] }[] = JSON.parse(skillsData)

    const userSkills = skills.find((s) => s.userId === userId)
    return userSkills ? userSkills.skills : []
  } catch (error) {
    console.error("Error getting user skills:", error)
    return []
  }
}

export async function saveUserSkills(userId: string, skills: Skill[]): Promise<void> {
  try {
    if (typeof window !== "undefined") {
      // Client-side fallback
      const allSkills = JSON.parse(localStorage.getItem("skills") || "[]") as { userId: string; skills: Skill[] }[]
      const existingIndex = allSkills.findIndex((s) => s.userId === userId)

      if (existingIndex >= 0) {
        allSkills[existingIndex].skills = skills
      } else {
        allSkills.push({ userId, skills })
      }

      localStorage.setItem("skills", JSON.stringify(allSkills))
      return
    }

    // Server-side implementation
    ensureDataDir()
    const skillsData = fs.readFileSync(SKILLS_FILE, "utf-8")
    const allSkills: { userId: string; skills: Skill[] }[] = JSON.parse(skillsData)

    const existingIndex = allSkills.findIndex((s) => s.userId === userId)

    if (existingIndex >= 0) {
      allSkills[existingIndex].skills = skills
    } else {
      allSkills.push({ userId, skills })
    }

    fs.writeFileSync(SKILLS_FILE, JSON.stringify(allSkills, null, 2))
  } catch (error) {
    console.error("Error saving user skills:", error)
  }
}

// Helper function to update skills based on test results
async function updateSkillsFromTestResult(result: TestResult): Promise<void> {
  try {
    const userId = result.userId
    const test = await getTestById(result.testId)
    if (!test) return

    const userSkills = await getUserSkills(userId)

    // Define which skills are affected by this test category
    const affectedSkills: Record<string, string[]> = {
      Frontend: ["HTML", "CSS", "JavaScript", "React"],
      Backend: ["Node.js", "Express", "APIs REST", "Autenticación"],
      "Bases de datos": ["SQL", "Modelado", "Optimización", "NoSQL"],
      Algoritmos: ["Estructuras de datos", "Ordenamiento", "Búsqueda", "Complejidad"],
      DevOps: ["Git", "Docker", "CI/CD", "Despliegue"],
    }

    const skillsToUpdate = affectedSkills[test.category] || []

    // Update or add skills
    const updatedSkills = [...userSkills]

    skillsToUpdate.forEach((skillName, index) => {
      // Calculate skill score based on test score and skill position
      // First skills in the array get higher scores from the test result
      const skillScore = Math.max(result.score - index * 5, result.score * (1 - index * 0.1))

      const existingSkillIndex = updatedSkills.findIndex((s) => s.name === skillName && s.category === test.category)

      if (existingSkillIndex >= 0) {
        // Average with existing score, with more weight to the new score
        updatedSkills[existingSkillIndex].score = Math.round(
          updatedSkills[existingSkillIndex].score * 0.3 + skillScore * 0.7,
        )
      } else {
        updatedSkills.push({
          name: skillName,
          score: Math.round(skillScore),
          category: test.category,
        })
      }
    })

    await saveUserSkills(userId, updatedSkills)
  } catch (error) {
    console.error("Error updating skills from test result:", error)
  }
}

// Update user level based on test results and skills
async function updateUserLevel(userId: string): Promise<void> {
  try {
    const skills = await getUserSkills(userId)
    const testResults = await getUserTestResults(userId)

    if (skills.length === 0 || testResults.length === 0) return

    // Calculate average skill score
    const avgSkillScore = skills.reduce((sum, skill) => sum + skill.score, 0) / skills.length

    // Calculate average test score
    const avgTestScore = testResults.reduce((sum, test) => sum + test.score, 0) / testResults.length

    // Determine level based on scores and number of tests
    let newLevel = "Principiante"

    if (testResults.length >= 5 && avgTestScore >= 70 && avgSkillScore >= 70) {
      newLevel = "Avanzado"
    } else if (testResults.length >= 3 && avgTestScore >= 50 && avgSkillScore >= 50) {
      newLevel = "Intermedio"
    }

    // Update user level
    await updateUser({ level: newLevel })
  } catch (error) {
    console.error("Error updating user level:", error)
  }
}

// Get category performance data for dashboard
export async function getCategoryPerformance(userId: string): Promise<CategoryPerformanceData[]> {
  try {
    const skills = await getUserSkills(userId)
    const testResults = await getUserTestResults(userId)

    const categories = ["Frontend", "Backend", "Bases de datos", "Algoritmos", "DevOps"]

    return categories.map((category) => {
      const categorySkills = skills.filter((skill) => skill.category === category)
      const categoryTests = testResults.filter((result) => result.category === category)

      // Calculate average score for the category
      const score =
        categorySkills.length > 0
          ? Math.round(categorySkills.reduce((sum, skill) => sum + skill.score, 0) / categorySkills.length)
          : 0

      // Calculate change in score
      const sortedTests = [...categoryTests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      let change = 0
      if (sortedTests.length >= 2) {
        change = sortedTests[0].score - sortedTests[1].score
      }

      return {
        title: category,
        score,
        change,
        tests: categoryTests.length,
        lastTest: sortedTests.length > 0 ? sortedTests[0].date : "N/A",
        skills: categorySkills.map((skill) => ({
          name: skill.name,
          score: skill.score,
        })),
      }
    })
  } catch (error) {
    console.error("Error getting category performance:", error)
    return []
  }
}
