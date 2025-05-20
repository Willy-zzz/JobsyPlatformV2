"use client"

import { useEffect, useRef } from "react"

export function PerformanceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Data for the line chart
    const months = ["Octubre", "Noviembre", "Diciembre", "Enero", "Febrero", "Marzo"]
    const scores = [45, 48, 52, 60, 58, 62]

    // Chart configuration
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2
    const maxScore = 100
    const gridLines = 5

    // Draw the chart
    drawLineChart(ctx, months, scores, padding, chartWidth, chartHeight, maxScore, gridLines)

    // Handle window resize
    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        const chartWidth = canvas.width - padding * 2
        const chartHeight = canvas.height - padding * 2
        drawLineChart(ctx, months, scores, padding, chartWidth, chartHeight, maxScore, gridLines)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Function to draw the line chart
  const drawLineChart = (
    ctx: CanvasRenderingContext2D,
    labels: string[],
    data: number[],
    padding: number,
    chartWidth: number,
    chartHeight: number,
    maxValue: number,
    gridLines: number,
  ) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Draw grid lines
    ctx.beginPath()
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"
    ctx.lineWidth = 1

    // Horizontal grid lines
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

    // Vertical grid lines
    const step = chartWidth / (labels.length - 1)
    for (let i = 0; i < labels.length; i++) {
      const x = padding + step * i
      ctx.moveTo(x, padding)
      ctx.lineTo(x, padding + chartHeight)

      // Add labels for x-axis
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillText(labels[i], x, padding + chartHeight + 10)
    }

    ctx.stroke()

    // Draw the line
    ctx.beginPath()
    ctx.strokeStyle = "rgba(99, 102, 241, 1)"
    ctx.lineWidth = 3
    ctx.lineJoin = "round"

    for (let i = 0; i < data.length; i++) {
      const x = padding + step * i
      const y = padding + chartHeight - (data[i] / maxValue) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()

    // Draw the area under the line
    ctx.lineTo(padding + step * (data.length - 1), padding + chartHeight)
    ctx.lineTo(padding, padding + chartHeight)
    ctx.closePath()
    ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
    ctx.fill()

    // Draw data points
    for (let i = 0; i < data.length; i++) {
      const x = padding + step * i
      const y = padding + chartHeight - (data[i] / maxValue) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fillStyle = "white"
      ctx.fill()
      ctx.strokeStyle = "rgba(99, 102, 241, 1)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw the value
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "bottom"
      ctx.fillText(`${data[i]}%`, x, y - 10)
    }
  }

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  )
}
