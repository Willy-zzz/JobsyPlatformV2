import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"
import * as fs from "fs"
import * as path from "path"

const prisma = new PrismaClient()

async function main() {
  console.log("Iniciando migración de datos...")

  // Leer datos de los archivos JSON
  const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf-8"))
  const testsData = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/tests.json"), "utf-8"))
  const testResultsData = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/test-results.json"), "utf-8"))
  const recommendationsData = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/recommendations.json"), "utf-8"))
  const skillsData = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/skills.json"), "utf-8"))
  const userCVsData = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/user-cvs.json"), "utf-8"))

  // Migrar usuarios
  console.log("Migrando usuarios...")
  for (const user of usersData) {
    // Hashear contraseña
    const hashedPassword = await hash(user.password, 10)

    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email,
        password: hashedPassword,
        name: user.name,
        studentId: user.studentId,
        career: user.career,
        semester: user.semester,
        specialization: user.specialization || null,
        bio: user.bio || null,
        level: user.level === "Principiante" ? "PRINCIPIANTE" : user.level === "Intermedio" ? "INTERMEDIO" : "AVANZADO",
        avatarUrl: user.avatarUrl || null,
        createdAt: new Date(user.createdAt),
      },
    })
  }

  // Migrar tests y preguntas
  console.log("Migrando tests y preguntas...")
  for (const test of testsData) {
    const createdTest = await prisma.test.create({
      data: {
        id: test.id,
        title: test.title,
        description: test.description,
        duration: test.duration,
        category: test.category,
        icon: test.icon,
        difficulty: test.difficulty,
      },
    })

    // Crear preguntas y opciones
    for (const question of test.questions) {
      const createdQuestion = await prisma.testQuestion.create({
        data: {
          id: question.id,
          question: question.question,
          correctAnswer: question.correctAnswer,
          testId: createdTest.id,
        },
      })

      // Crear opciones
      for (const option of question.options) {
        await prisma.testOption.create({
          data: {
            id: option.id,
            text: option.text,
            questionId: createdQuestion.id,
          },
        })
      }
    }
  }

  // Migrar resultados de tests
  console.log("Migrando resultados de tests...")
  for (const result of testResultsData) {
    await prisma.testResult.create({
      data: {
        id: result.id,
        score: result.score,
        answers: result.answers,
        date: new Date(result.date),
        category: result.category,
        name: result.name,
        userId: result.userId,
        testId: result.testId,
      },
    })
  }

  // Migrar recomendaciones
  console.log("Migrando recomendaciones...")
  for (const recommendation of recommendationsData) {
    await prisma.recommendation.create({
      data: {
        id: recommendation.id,
        title: recommendation.title,
        description: recommendation.description,
        category: recommendation.category,
        difficulty: recommendation.difficulty,
        duration: recommendation.duration || null,
        icon: recommendation.icon || null,
        url: recommendation.url || null,
        platform: recommendation.platform || null,
      },
    })
  }

  // Migrar habilidades
  console.log("Migrando habilidades...")
  for (const userSkills of skillsData) {
    for (const skill of userSkills.skills) {
      await prisma.skill.create({
        data: {
          name: skill.name,
          score: skill.score,
          category: skill.category,
          userId: userSkills.userId,
        },
      })
    }
  }

  // Migrar CVs de usuarios
  console.log("Migrando CVs de usuarios...")
  for (const cv of userCVsData) {
    if (cv.fileName && cv.fileContent) {
      await prisma.userCV.create({
        data: {
          fileName: cv.fileName,
          fileSize: cv.fileSize,
          fileType: cv.fileType,
          fileUrl: cv.fileContent, // Nota: Aquí deberías migrar el archivo a un almacenamiento adecuado
          uploadDate: new Date(cv.uploadDate),
          lastAnalysisDate: cv.lastAnalysisDate ? new Date(cv.lastAnalysisDate) : null,
          skills: cv.skills || [],
          experience: cv.experience || [],
          education: cv.education || [],
          userId: cv.userId,
        },
      })
    }
  }

  console.log("Migración completada con éxito!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
