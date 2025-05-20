"use client"

import { useEffect, useRef } from "react"

export function ComparisonChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Data for the bar chart
    const categories = ["Frontend", "Backend", "Bases de datos", "Algoritmos", "DevOps"]
    const userScores = [42, 68, 85, 56, 32]
    const averageScores = [60, 55, 60, 58, 50]

    // Chart configuration
    const padding = 60
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2
    const maxScore = 100
    const barWidth = chartWidth / categories.length / 3
    const barSpacing = barWidth / 2

    // Draw the chart
    drawBarChart(
      ctx,
      categories,
      userScores,
      averageScores,
      padding,
      chartWidth,
      chartHeight,
      maxScore,
      barWidth,
      barSpacing,
    )

    // Handle window resize
    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        const chartWidth = canvas.width - padding * 2
        const chartHeight = canvas.height - padding * 2
        const barWidth = chartWidth / categories.length / 3
        const barSpacing = barWidth / 2
        drawBarChart(
          ctx,
          categories,
          userScores,
          averageScores,
          padding,
          chartWidth,
          chartHeight,
          maxScore,
          barWidth,
          barSpacing,
        )
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Function to draw the bar chart
  const drawBarChart = (
    ctx: CanvasRenderingContext2D,
    categories: string[],
    userScores: number[],
    averageScores: number[],
    padding: number,
    chartWidth: number,
    chartHeight: number,
    maxValue: number,
    barWidth: number,
    barSpacing: number,
  ) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Draw grid lines
    ctx.beginPath()
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"
    ctx.lineWidth = 1

    // Horizontal grid lines
    const gridLines = 5
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (chartHeight / gridLines) * i
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)

      // Add labels for y-axis
      const value = maxValue - (maxValue / gridLines) * i
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"
      ctx.fillText(`${value}%`, padding - 10, y)
    }

    ctx.stroke()

    // Draw the bars
    const categoryWidth = chartWidth / categories.length

    for (let i = 0; i < categories.length; i++) {
      const categoryX = padding + categoryWidth * i + categoryWidth / 2

      // Draw user score bar
      const userBarHeight = (userScores[i] / maxValue) * chartHeight
      const userBarX = categoryX - barWidth - barSpacing / 2
      const userBarY = padding + chartHeight - userBarHeight

      ctx.fillStyle = "rgba(99, 102, 241, 0.8)"
      ctx.fillRect(userBarX, userBarY, barWidth, userBarHeight)

      // Draw average score bar
      const avgBarHeight = (averageScores[i] / maxValue) * chartHeight
      const avgBarX = categoryX + barSpacing / 2
      const avgBarY = padding + chartHeight - avgBarHeight

      ctx.fillStyle = "rgba(161, 161, 170, 0.8)"
      ctx.fillRect(avgBarX, avgBarY, barWidth, avgBarHeight)

      // Add category label
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillText(categories[i], categoryX, padding + chartHeight + 10)

      // Add score values
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "bottom"

      // User score
      ctx.fillStyle = "rgba(99, 102, 241, 1)"
      ctx.fillText(`${userScores[i]}%`, userBarX + barWidth / 2, userBarY - 5)

      // Average score
      ctx.fillStyle = "rgba(161, 161, 170, 1)"
      ctx.fillText(`${averageScores[i]}%`, avgBarX + barWidth / 2, avgBarY - 5)
    }

    // Draw legend
    const legendX = padding
    const legendY = padding / 2

    // User score legend
    ctx.fillStyle = "rgba(99, 102, 241, 0.8)"
    ctx.fillRect(legendX, legendY, 15, 15)

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"
    ctx.fillText("Tu puntuación", legendX + 20, legendY + 7.5)

    // Average score legend
    ctx.fillStyle = "rgba(161, 161, 170, 0.8)"
    ctx.fillRect(legendX + 120, legendY, 15, 15)

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillText("Promedio", legendX + 140, legendY + 7.5)
  }

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  )
}
