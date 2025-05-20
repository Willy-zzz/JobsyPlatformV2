"use client"

import { useEffect, useRef } from "react"

export function SkillsRadarChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Data for the radar chart
    const data = {
      categories: [
        {
          name: "Frontend",
          skills: [
            { name: "HTML", score: 65 },
            { name: "CSS", score: 58 },
            { name: "JavaScript", score: 45 },
            { name: "React", score: 32 },
          ],
        },
        {
          name: "Backend",
          skills: [
            { name: "Node.js", score: 72 },
            { name: "Express", score: 65 },
            { name: "APIs REST", score: 70 },
            { name: "Autenticación", score: 60 },
          ],
        },
        {
          name: "Bases de datos",
          skills: [
            { name: "SQL", score: 90 },
            { name: "Modelado", score: 82 },
            { name: "Optimización", score: 78 },
            { name: "NoSQL", score: 65 },
          ],
        },
        {
          name: "Algoritmos",
          skills: [
            { name: "Estructuras de datos", score: 62 },
            { name: "Ordenamiento", score: 58 },
            { name: "Búsqueda", score: 55 },
            { name: "Complejidad", score: 48 },
          ],
        },
        {
          name: "DevOps",
          skills: [
            { name: "Git", score: 60 },
            { name: "Docker", score: 25 },
            { name: "CI/CD", score: 20 },
            { name: "Despliegue", score: 30 },
          ],
        },
      ],
    }

    // Chart configuration
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) * 0.7

    // Draw the chart
    drawSkillsRadarChart(ctx, data, centerX, centerY, radius)

    // Handle window resize
    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const radius = Math.min(centerX, centerY) * 0.7
        drawSkillsRadarChart(ctx, data, centerX, centerY, radius)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Function to draw the skills radar chart
  const drawSkillsRadarChart = (
    ctx: CanvasRenderingContext2D,
    data: {
      categories: {
        name: string
        skills: {
          name: string
          score: number
        }[]
      }[]
    },
    centerX: number,
    centerY: number,
    radius: number,
  ) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    const categories = data.categories
    const numCategories = categories.length
    const angleStep = (Math.PI * 2) / numCategories

    // Draw the background grid
    for (let level = 1; level <= 5; level++) {
      const levelRadius = (radius * level) / 5

      ctx.beginPath()
      for (let i = 0; i <= numCategories; i++) {
        const angle = i * angleStep - Math.PI / 2
        const x = centerX + levelRadius * Math.cos(angle)
        const y = centerY + levelRadius * Math.sin(angle)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.closePath()
      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"
      ctx.stroke()
    }

    // Draw the category axes
    for (let i = 0; i < numCategories; i++) {
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
      ctx.stroke()

      // Draw category labels
      const labelX = centerX + (radius + 20) * Math.cos(angle)
      const labelY = centerY + (radius + 20) * Math.sin(angle)

      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(categories[i].name, labelX, labelY)
    }

    // Draw the skills for each category
    for (let i = 0; i < numCategories; i++) {
      const category = categories[i]
      const categoryAngle = i * angleStep - Math.PI / 2
      const skills = category.skills

      for (let j = 0; j < skills.length; j++) {
        const skill = skills[j]
        const skillRadius = (radius * skill.score) / 100

        // Calculate position with slight offset from category axis
        const offsetAngle = categoryAngle + (j - (skills.length - 1) / 2) * 0.15
        const x = centerX + skillRadius * Math.cos(offsetAngle)
        const y = centerY + skillRadius * Math.sin(offsetAngle)

        // Draw skill point
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = getSkillColor(skill.score)
        ctx.fill()

        // Draw skill label
        const labelDistance = skillRadius + 15
        const labelX = centerX + labelDistance * Math.cos(offsetAngle)
        const labelY = centerY + labelDistance * Math.sin(offsetAngle)

        ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
        ctx.font = "11px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${skill.name} (${skill.score}%)`, labelX, labelY)
      }
    }

    // Draw legend
    const legendX = 20
    const legendY = 20
    const legendSpacing = 20

    const skillLevels = [
      { label: "Avanzado (70-100%)", color: "rgba(34, 197, 94, 0.8)" },
      { label: "Intermedio (50-69%)", color: "rgba(234, 179, 8, 0.8)" },
      { label: "Básico (0-49%)", color: "rgba(239, 68, 68, 0.8)" },
    ]

    for (let i = 0; i < skillLevels.length; i++) {
      const y = legendY + i * legendSpacing

      ctx.beginPath()
      ctx.arc(legendX, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = skillLevels[i].color
      ctx.fill()

      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(skillLevels[i].label, legendX + 10, y)
    }
  }

  // Helper function to get color based on skill score
  const getSkillColor = (score: number) => {
    if (score >= 70) {
      return "rgba(34, 197, 94, 0.8)" // Green for advanced
    } else if (score >= 50) {
      return "rgba(234, 179, 8, 0.8)" // Yellow for intermediate
    } else {
      return "rgba(239, 68, 68, 0.8)" // Red for basic
    }
  }

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  )
}
