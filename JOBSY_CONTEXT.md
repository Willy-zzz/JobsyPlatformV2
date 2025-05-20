# JOBSY - Plataforma de Desarrollo Profesional

## Descripción General

JOBSY es una plataforma fullstack de desarrollo profesional para estudiantes del Tecnológico de México, Campus Villahermosa. La plataforma permite a los estudiantes evaluar sus habilidades técnicas, recibir recomendaciones personalizadas de cursos, gestionar su CV y seguir su progreso académico. El objetivo principal es ayudar a los estudiantes a mejorar sus habilidades técnicas y prepararse para el mercado laboral.

## Arquitectura Técnica Actual

- **Framework**: Next.js 14 con App Router
- **Frontend**: React con TypeScript y Tailwind CSS
- **Backend**: Serverless con Server Actions de Next.js
- **Autenticación**: Sistema personalizado con cookies HTTP seguras
- **Almacenamiento**: Actualmente usa archivos JSON en el servidor para persistencia de datos
- **Componentes UI**: Utiliza shadcn/ui para componentes consistentes
- **Iconos**: Lucide React para iconografía

## Estructura de Datos Actual

La plataforma maneja los siguientes modelos de datos:

1. **User**: Información de usuarios, credenciales, perfil académico
2. **Test**: Pruebas técnicas con preguntas y respuestas
3. **TestResult**: Resultados de pruebas realizadas por usuarios
4. **Recommendation**: Cursos recomendados personalizados
5. **UserCV**: CVs subidos por usuarios con análisis de habilidades
6. **Skill**: Habilidades técnicas de los usuarios

Actualmente, estos datos se almacenan en archivos JSON separados en el servidor:
- `/data/users.json`
- `/data/tests.json`
- `/data/test-results.json`
- `/data/recommendations.json`
- `/data/skills.json`
- `/data/user-cvs.json`

## Funcionalidades Principales

1. **Autenticación**: Registro, login y gestión de sesiones
2. **Tests Técnicos**: Evaluaciones interactivas en diferentes áreas
3. **Dashboard**: Visualización de progreso y estadísticas
4. **Recomendaciones**: Cursos personalizados según carrera, especialidad y rendimiento
5. **Gestión de CV**: Subida, análisis y almacenamiento de currículums
6. **Estadísticas**: Análisis de rendimiento por categorías

## Tecnologías Utilizadas

- **Next.js**: Framework React para renderizado híbrido
- **TypeScript**: Tipado estático para mayor robustez
- **Tailwind CSS**: Utilidades CSS para estilizado
- **shadcn/ui**: Componentes UI reutilizables
- **Server Actions**: Para operaciones del lado del servidor
- **HTTP Cookies**: Para gestión de sesiones
- **File System API**: Para almacenamiento de datos y archivos

## Plan de Integración con Prisma ORM

Queremos migrar del sistema actual basado en archivos JSON a una base de datos relacional utilizando Prisma ORM. Los objetivos son:

1. **Mejorar la escalabilidad**: Permitir un crecimiento sostenible de usuarios y datos
2. **Aumentar la confiabilidad**: Garantizar la integridad de los datos con un RDBMS
3. **Facilitar consultas complejas**: Permitir búsquedas y filtrados avanzados
4. **Mejorar el rendimiento**: Optimizar la velocidad de acceso a datos
5. **Implementar relaciones**: Establecer relaciones adecuadas entre entidades

## Pasos Planeados para la Migración

1. **Definir el schema de Prisma** basado en los modelos actuales
2. **Configurar la conexión a la base de datos** (PostgreSQL o MySQL)
3. **Migrar los datos existentes** de archivos JSON a la base de datos
4. **Refactorizar el servicio de datos** para usar Prisma en lugar de operaciones de archivo
5. **Implementar nuevas funcionalidades** aprovechando las capacidades de Prisma

## Estructura de Archivos Actual

\`\`\`
/app
  /dashboard
    page.tsx
  /login
    page.tsx
  /register
    page.tsx
  /tests
    /[id]
      page.tsx
    page.tsx
    results/
      page.tsx
  /recommendations
    page.tsx
  /profile
    page.tsx
  /resume
    page.tsx
  /statistics
    page.tsx
  layout.tsx
  page.tsx
/components
  /ui
    button.tsx
    card.tsx
    ... (otros componentes shadcn)
  dashboard-layout.tsx
  recommendation-card.tsx
  skills-chart.tsx
  ... (otros componentes)
/lib
  auth-context.tsx
  data-service.ts
  types.ts
  utils.ts
/public
  /uploads
    ... (archivos subidos por usuarios)
/data
  users.json
  tests.json
  test-results.json
  recommendations.json
  skills.json
  user-cvs.json
\`\`\`

## Modelos de Datos Detallados

### User
\`\`\`typescript
interface User {
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
\`\`\`

### Test
\`\`\`typescript
interface Test {
  id: string
  title: string
  description: string
  duration: string
  questions: TestQuestion[]
  category: string
  icon: string
  difficulty: string
}

interface TestQuestion {
  id: number
  question: string
  options: TestOption[]
  correctAnswer: string
}

interface TestOption {
  id: string
  text: string
}
\`\`\`

### TestResult
\`\`\`typescript
interface TestResult {
  id: string
  testId: string
  userId: string
  score: number
  answers: Record<number, string>
  date: string
  category: string
  name: string
}
\`\`\`

### Recommendation
\`\`\`typescript
interface Recommendation {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration?: string
  icon?: string
  progress?: number
  completed?: boolean
  highlighted?: boolean
  url?: string
  platform?: string
}
\`\`\`

### UserCV
\`\`\`typescript
interface UserCV {
  userId: string
  fileName: string
  fileSize: string
  fileType: string
  fileUrl: string
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
\`\`\`

### Skill
\`\`\`typescript
interface Skill {
  name: string
  score: number
  category: string
}
\`\`\`

## Funciones Principales del Servicio de Datos

El archivo `data-service.ts` contiene las siguientes funciones principales que deberán ser migradas a Prisma:

1. **Autenticación**: `login()`, `register()`, `logout()`, `getCurrentUser()`
2. **Gestión de usuarios**: `updateUser()`
3. **Tests**: `getTests()`, `getTestById()`, `saveTestResult()`
4. **Resultados**: `getUserTestResults()`
5. **Recomendaciones**: `getUserRecommendations()`, `updateRecommendationProgress()`
6. **CV**: `getUserCV()`, `saveUserCV()`
7. **Habilidades**: `getUserSkills()`, `saveUserSkills()`
8. **Estadísticas**: `getCategoryPerformance()`, `updateUserProgress()`

## Desafíos Esperados

1. **Migración de datos**: Convertir los datos JSON existentes al esquema de Prisma
2. **Relaciones**: Establecer correctamente las relaciones entre entidades
3. **Transacciones**: Implementar operaciones transaccionales donde sea necesario
4. **Optimización**: Asegurar que las consultas sean eficientes
5. **Despliegue**: Configurar la base de datos en el entorno de producción

## Objetivos Adicionales

1. **Implementar búsqueda avanzada** de usuarios, tests y recomendaciones
2. **Añadir filtros complejos** para estadísticas y resultados
3. **Mejorar el rendimiento** de las consultas más frecuentes
4. **Implementar paginación** para listas largas
5. **Añadir funcionalidades de administración** para gestionar contenido
