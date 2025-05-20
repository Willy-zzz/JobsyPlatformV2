// Update the SkillsChart component to better reflect test scores

"use client"

import { useEffect, useRef, useState } from "react"
import { getUserSkills, getUserTestResults } from "@/lib/data-service"
import { useAuth } from "@/lib/auth-context"

export function SkillsChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredSkill, setHoveredSkill] = useState<{
    name: string
    value: number
    x: number
    y: number
  } | null>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [skillsData, setSkillsData] = useState<{
    labels: string[]
    datasets: {
      data: number[]
      backgroundColor: string
      borderColor: string
      borderWidth: number
    }[]
  }>({
    labels: [
      "Frontend",
      "Backend",
      "Bases de datos",
      "Algoritmos",
      "DevOps",
      "Móvil",
      "Cloud",
      "IA",
      "Diseño",
      "Seguridad",
    ],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
      },
    ],
  })
  const { user } = useAuth()

  useEffect(() => {
    // Fetch user skills and test results
    const fetchData = async () => {
      if (!user) return

      try {
        const skills = await getUserSkills(user.id)
        const testResults = await getUserTestResults(user.id)

        // Calculate average scores by category
        const categories = [
          "Frontend",
          "Backend",
          "Bases de datos",
          "Algoritmos",
          "DevOps",
          "Móvil",
          "Cloud",
          "IA",
          "Diseño",
          "Seguridad",
        ]
        const scores = categories.map((category) => {
          // Get skills for this category
          const categorySkills = skills.filter((skill) => skill.category === category)

          // Get test results for this category
          const categoryTests = testResults.filter((test) => test.category === category)

          // Calculate average score
          let score = 0
          if (categorySkills.length > 0) {
            score = categorySkills.reduce((sum, skill) => sum + skill.score, 0) / categorySkills.length
          } else if (categoryTests.length > 0) {
            score = categoryTests.reduce((sum, test) => sum + test.score, 0) / categoryTests.length
          }

          return score
        })

        // Update chart data
        setSkillsData({
          labels: categories,
          datasets: [
            {
              data: scores,
              backgroundColor: "rgba(99, 102, 241, 0.2)",
              borderColor: "rgba(99, 102, 241, 1)",
              borderWidth: 2,
            },
          ],
        })
      } catch (error) {
        console.error("Error fetching skills data:", error)
      }
    }

    fetchData()
  }, [user])

  useEffect(() => {
    // Animate the chart when it first renders
    let start: number | null = null
    const duration = 1000 // 1 second animation

    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)

      setAnimationProgress(progress)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with higher resolution for sharper rendering
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    ctx.scale(dpr, dpr)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    // Apply animation to data
    const animatedData = {
      ...skillsData,
      datasets: [
        {
          ...skillsData.datasets[0],
          data: skillsData.datasets[0].data.map((value) => value * animationProgress),
        },
      ],
    }

    // Draw the chart
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const radius = Math.min(centerX, centerY) * 0.75

    // Draw the chart
    drawRadarChart(ctx, animatedData, centerX, centerY, radius)

    // Handle mouse move for tooltips
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      checkHover(mouseX, mouseY, animatedData, centerX, centerY, radius)
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    // Handle mouse leave
    const handleMouseLeave = () => {
      setHoveredSkill(null)
    }

    canvas.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [animationProgress, hoveredSkill, skillsData])

  // Function to check if mouse is hovering over a data point
  const checkHover = (
    mouseX: number,
    mouseY: number,
    data: {
      labels: string[]
      datasets: {
        data: number[]
        backgroundColor: string
        borderColor: string
        borderWidth: number
      }[]
    },
    centerX: number,
    centerY: number,
    radius: number,
  ) => {
    const numPoints = data.labels.length
    const angleStep = (Math.PI * 2) / numPoints
    const dataset = data.datasets[0]

    for (let i = 0; i < numPoints; i++) {
      const value = dataset.data[i] / 100
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + radius * value * Math.cos(angle)
      const y = centerY + radius * value * Math.sin(angle)

      // Check if mouse is within 15px of the data point
      const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2))

      if (distance < 15) {
        setHoveredSkill({
          name: data.labels[i],
          value: Math.round(dataset.data[i]),
          x: x,
          y: y,
        })
        return
      }
    }

    setHoveredSkill(null)
  }

  // Function to draw the radar chart
  const drawRadarChart = (
    ctx: CanvasRenderingContext2D,
    data: {
      labels: string[]
      datasets: {
        data: number[]
        backgroundColor: string
        borderColor: string
        borderWidth: number
      }[]
    },
    centerX: number,
    centerY: number,
    radius: number,
  ) => {
    const numPoints = data.labels.length
    const angleStep = (Math.PI * 2) / numPoints

    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width / window.devicePixelRatio, ctx.canvas.height / window.devicePixelRatio)

    // Draw the grid lines with gradient
    for (let level = 1; level <= 5; level++) {
      const levelRadius = (radius * level) / 5

      ctx.beginPath()
      for (let i = 0; i <= numPoints; i++) {
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

      // Create gradient for grid lines
      const gradient = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius)
      gradient.addColorStop(0, "rgba(99, 102, 241, 0.05)")
      gradient.addColorStop(1, "rgba(99, 102, 241, 0.15)")

      ctx.fillStyle = gradient
      ctx.fill()

      ctx.strokeStyle = "rgba(99, 102, 241, 0.2)"
      ctx.lineWidth = 1
      ctx.stroke()

      // Add percentage labels
      if (level < 5) {
        const percentage = level * 20
        const labelX = centerX + 5
        const labelY = centerY - levelRadius + 15

        ctx.fillStyle = "rgba(107, 114, 128, 0.7)"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "left"
        ctx.textBaseline = "middle"
        ctx.fillText(`${percentage}%`, labelX, labelY)
      }
    }

    // Draw the axes with drop shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
    ctx.shadowBlur = 5
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2

    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = "rgba(99, 102, 241, 0.3)"
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Draw the labels with background for better readability
      const labelX = centerX + (radius + 25) * Math.cos(angle)
      const labelY = centerY + (radius + 25) * Math.sin(angle)

      // Draw label background
      const label = data.labels[i]
      const labelWidth = ctx.measureText(label).width

      ctx.shadowColor = "transparent"
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.fillRect(labelX - labelWidth / 2 - 5, labelY - 10, labelWidth + 10, 20)

      // Draw label text
      ctx.fillStyle = "rgba(17, 24, 39, 0.9)"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(data.labels[i], labelX, labelY)
    }

    // Reset shadow
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    // Draw the data
    const dataset = data.datasets[0]

    // Draw filled area
    ctx.beginPath()
    for (let i = 0; i < numPoints; i++) {
      const value = dataset.data[i] / 100
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + radius * value * Math.cos(angle)
      const y = centerY + radius * value * Math.sin(angle)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.closePath()

    // Create gradient fill
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
    gradient.addColorStop(0, "rgba(99, 102, 241, 0.7)")
    gradient.addColorStop(1, "rgba(99, 102, 241, 0.1)")

    ctx.fillStyle = gradient
    ctx.fill()

    // Draw outline with glow effect
    ctx.strokeStyle = dataset.borderColor
    ctx.lineWidth = dataset.borderWidth
    ctx.lineJoin = "round"
    ctx.stroke()

    // Draw data points with glow effect
    for (let i = 0; i < numPoints; i++) {
      const value = dataset.data[i] / 100
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + radius * value * Math.cos(angle)
      const y = centerY + radius * value * Math.sin(angle)

      // Draw glow
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 12)
      glow.addColorStop(0, "rgba(99, 102, 241, 0.8)")
      glow.addColorStop(1, "rgba(99, 102, 241, 0)")

      ctx.beginPath()
      ctx.arc(x, y, 12, 0, Math.PI * 2)
      ctx.fillStyle = glow
      ctx.fill()

      // Draw point
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fillStyle = "white"
      ctx.strokeStyle = dataset.borderColor
      ctx.lineWidth = 2
      ctx.fill()
      ctx.stroke()

      // Draw the value if not hovered
      if (!hoveredSkill || hoveredSkill.name !== data.labels[i]) {
        const valueX = centerX + radius * value * 0.85 * Math.cos(angle)
        const valueY = centerY + radius * value * 0.85 * Math.sin(angle)

        // Draw value background
        const valueText = `${Math.round(dataset.data[i])}%`
        const valueWidth = ctx.measureText(valueText).width

        ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
        ctx.fillRect(valueX - valueWidth / 2 - 4, valueY - 8, valueWidth + 8, 16)

        // Draw value text
        ctx.fillStyle = getScoreColor(Math.round(dataset.data[i]))
        ctx.font = "bold 11px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(valueText, valueX, valueY)
      }
    }
  }

  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 70) return "rgba(34, 197, 94, 1)" // Green for high scores
    if (score >= 50) return "rgba(234, 179, 8, 1)" // Amber for medium scores
    return "rgba(239, 68, 68, 1)" // Red for low scores
  }

  return (
    <div className="w-full h-[300px] relative">
      <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />

      {/* Tooltip */}
      {hoveredSkill && (
        <div
          className="absolute pointer-events-none bg-white p-2 rounded-md shadow-lg border border-gray-200 z-10 transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${hoveredSkill.x}px`,
            top: `${hoveredSkill.y - 10}px`,
          }}
        >
          <div className="font-medium">{hoveredSkill.name}</div>
          <div
            className={`text-sm font-bold ${
              hoveredSkill.value >= 70 ? "text-green-500" : hoveredSkill.value >= 50 ? "text-amber-500" : "text-red-500"
            }`}
          >
            {hoveredSkill.value}%
          </div>
          <div className="text-xs text-gray-500">
            {hoveredSkill.value >= 70 ? "Avanzado" : hoveredSkill.value >= 50 ? "Intermedio" : "Básico"}
          </div>
          <div className="absolute w-2 h-2 bg-white border-b border-r border-gray-200 transform rotate-45 left-1/2 -bottom-1 -ml-1"></div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-white/80 p-2 rounded-md text-xs flex flex-col gap-1 backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span>Avanzado (70-100%)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>Intermedio (50-69%)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>Básico (0-49%)</span>
        </div>
      </div>
    </div>
  )
}
