/**
 * Guía de migración a Prisma ORM
 *
 * Este archivo contiene instrucciones y ejemplos para migrar
 * las funciones de data-service.ts a Prisma ORM.
 */

// Ejemplo de migración de la función getCurrentUser
/*
// Versión original con archivos JSON
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

// Versión migrada a Prisma
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function getCurrentUser() {
  const userId = cookies().get("userId")?.value
  if (!userId) return null

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
*/

// Ejemplo de migración de la función login
/*
// Versión original con archivos JSON
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

// Versión migrada a Prisma
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { compare } from 'bcryptjs'

export async function login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  try {
    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return { success: false, message: "Credenciales inválidas" }
    }

    // Verificar contraseña
    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) {
      return { success: false, message: "Credenciales inválidas" }
    }

    // Establecer cookie
    cookies().set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "Error en el servidor" }
  }
}
*/

// Pasos para completar la migración:
// 1. Instalar dependencias: npm install @prisma/client bcryptjs
// 2. Instalar dependencias de desarrollo: npm install -D prisma @types/bcryptjs
// 3. Inicializar Prisma: npx prisma init
// 4. Definir el schema de Prisma en prisma/schema.prisma
// 5. Configurar la conexión a la base de datos en .env
// 6. Crear el archivo lib/prisma.ts para exportar la instancia de PrismaClient
// 7. Migrar cada función de data-service.ts a Prisma
// 8. Crear script de migración de datos para importar datos JSON existentes
// 9. Ejecutar la migración: npx prisma migrate dev
// 10. Ejecutar el script de migración de datos: npm run db:seed
