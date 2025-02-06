"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { generateQRCodeSVG } from "../utils/qr-code-styles"
import { Card, CardContent } from "../../components/ui/card"
import QRCode from "qrcode"
import { DraggableElement } from "./draggable-element"
import { useTheme } from "next-themes"

interface ElementStyle {
  shape: string
  borderRadius: number
  rotation: number
  opacity: number
}

interface CardPreviewProps {
  cardData: {
    name: { text: string; x: number; y: number; size: number; font: string }
    title: { text: string; x: number; y: number; size: number; font: string }
    company: { text: string; x: number; y: number; size: number; font: string }
    email: { text: string; x: number; y: number; size: number; font: string }
    phone: { text: string; x: number; y: number; size: number; font: string }
    website: { text: string; x: number; y: number; size: number; font: string }
    services?: Array<{ text: string; x: number; y: number; size: number; font: string }>
    backgroundColor: string
    textColor: string
    profileImage: {
      file?: File
      style: {
        shape: string
        shadow: boolean
        shadowBlur: number
      }
      x?: number
      y?: number
      size?: number
    }
    logoImage: {
      file?: File
      style: {
        shape: string
        shadow: boolean
        shadowBlur: number
      }
      x?: number
      y?: number
      size?: number
    }
    designStyle: {
      backgroundGradient: boolean
      gradientColors: string[]
      backgroundGradientType: string
      backgroundGradientAngle: number
      pattern: string
      overlay: string
      borderStyle: string
    }
  }
}

const applyPattern = (ctx: CanvasRenderingContext2D, pattern: string, width: number, height: number) => {
  switch (pattern) {
    case "dots":
      for (let x = 0; x < width; x += 20) {
        for (let y = 0; y < height; y += 20) {
          ctx.beginPath()
          ctx.arc(x, y, 1, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(0,0,0,0.1)"
          ctx.fill()
        }
      }
      break
    case "lines":
      ctx.strokeStyle = "rgba(0,0,0,0.1)"
      ctx.lineWidth = 1
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
      break
    case "grid":
      ctx.strokeStyle = "rgba(0,0,0,0.1)"
      ctx.lineWidth = 1
      for (let x = 0; x < width; x += 20) {
        for (let y = 0; y < height; y += 20) {
          ctx.strokeRect(x, y, 20, 20)
        }
      }
      break
  }
}

const applyOverlay = (ctx: CanvasRenderingContext2D, overlay: string, width: number, height: number) => {
  switch (overlay) {
    case "gradient":
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, "rgba(255,255,255,0.1)")
      gradient.addColorStop(1, "rgba(0,0,0,0.1)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      break
    case "vignette":
      const radialGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.5
      )
      radialGradient.addColorStop(0, "rgba(0,0,0,0)")
      radialGradient.addColorStop(1, "rgba(0,0,0,0.2)")
      ctx.fillStyle = radialGradient
      ctx.fillRect(0, 0, width, height)
      break
  }
}

const applyBorder = (ctx: CanvasRenderingContext2D, style: string, width: number, height: number) => {
  switch (style) {
    case "solid":
      ctx.strokeStyle = "rgba(0,0,0,0.2)"
      ctx.lineWidth = 2
      ctx.strokeRect(10, 10, width - 20, height - 20)
      break
    case "double":
      ctx.strokeStyle = "rgba(0,0,0,0.2)"
      ctx.lineWidth = 1
      ctx.strokeRect(8, 8, width - 16, height - 16)
      ctx.strokeRect(12, 12, width - 24, height - 24)
      break
    case "dashed":
      ctx.strokeStyle = "rgba(0,0,0,0.2)"
      ctx.lineWidth = 2
      ctx.setLineDash([10, 10])
      ctx.strokeRect(10, 10, width - 20, height - 20)
      ctx.setLineDash([])
      break
  }
}

export function CardPreview({ cardData }: CardPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawPattern = (ctx: CanvasRenderingContext2D) => {
    const { pattern } = cardData.designStyle
    const width = ctx.canvas.width
    const height = ctx.canvas.height

    ctx.save()
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1

    switch (pattern) {
      case "dots":
        for (let x = 0; x < width; x += 20) {
          for (let y = 0; y < height; y += 20) {
            ctx.beginPath()
            ctx.arc(x, y, 1, 0, Math.PI * 2)
            ctx.stroke()
          }
        }
        break
      case "lines":
        for (let x = 0; x < width; x += 30) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, height)
          ctx.stroke()
        }
        for (let y = 0; y < height; y += 30) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
          ctx.stroke()
        }
        break
      case "grid":
        ctx.beginPath()
        for (let x = 0; x < width; x += 40) {
          ctx.moveTo(x, 0)
          ctx.lineTo(x, height)
        }
        for (let y = 0; y < height; y += 40) {
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
        }
        ctx.stroke()
        break
    }
    ctx.restore()
  }

  const applyOverlay = (ctx: CanvasRenderingContext2D) => {
    const { overlay } = cardData.designStyle
    const width = ctx.canvas.width
    const height = ctx.canvas.height

    ctx.save()
    switch (overlay) {
      case "gradient":
        const gradient = ctx.createLinearGradient(0, 0, width, height)
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.1)")
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.1)")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
        break
      case "vignette":
        const radialGradient = ctx.createRadialGradient(
          width / 2,
          height / 2,
          0,
          width / 2,
          height / 2,
          Math.max(width, height) / 1.5
        )
        radialGradient.addColorStop(0, "rgba(0, 0, 0, 0)")
        radialGradient.addColorStop(1, "rgba(0, 0, 0, 0.3)")
        ctx.fillStyle = radialGradient
        ctx.fillRect(0, 0, width, height)
        break
    }
    ctx.restore()
  }

  const drawBorder = (ctx: CanvasRenderingContext2D) => {
    const { borderStyle } = cardData.designStyle
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    const padding = 10

    ctx.save()
    ctx.strokeStyle = cardData.textColor
    ctx.lineWidth = 2

    switch (borderStyle) {
      case "solid":
        ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2)
        break
      case "double":
        ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2)
        ctx.strokeRect(
          padding + 5,
          padding + 5,
          width - (padding + 5) * 2,
          height - (padding + 5) * 2
        )
        break
      case "dashed":
        ctx.setLineDash([10, 10])
        ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2)
        break
    }
    ctx.restore()
  }

  const drawImage = async (
    ctx: CanvasRenderingContext2D,
    file: File,
    x: number,
    y: number,
    size: number,
    style: { shape: string; shadow: boolean; shadowBlur: number }
  ) => {
    return new Promise<void>((resolve, reject) => {
      try {
        const img = new Image()
        const objectUrl = typeof window !== 'undefined' ? window.URL.createObjectURL(file) : ''

        const cleanup = () => {
          if (objectUrl) {
            window.URL.revokeObjectURL(objectUrl)
          }
        }

        img.onload = () => {
          try {
            ctx.save()

            if (style.shadow) {
              ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
              ctx.shadowBlur = style.shadowBlur
              ctx.shadowOffsetX = 3
              ctx.shadowOffsetY = 3
            }

            ctx.beginPath()
            switch (style.shape) {
              case "circle":
                ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
                break
              case "square":
                ctx.rect(x, y, size, size)
                break
              case "hexagon":
                const a = (2 * Math.PI) / 6
                const r = size / 2
                for (let i = 0; i < 6; i++) {
                  ctx.lineTo(
                    x + size / 2 + r * Math.cos(a * i),
                    y + size / 2 + r * Math.sin(a * i)
                  )
                }
                ctx.closePath()
                break
            }
            ctx.clip()
            ctx.drawImage(img, x, y, size, size)
            ctx.restore()
            cleanup()
            resolve()
          } catch (error) {
            console.error('Error drawing image:', error)
            cleanup()
            resolve() // Resolve anyway to prevent hanging
          }
        }

        img.onerror = () => {
          console.error('Error loading image')
          cleanup()
          resolve() // Resolve anyway to prevent hanging
        }

        if (objectUrl) {
          img.src = objectUrl
        } else {
          resolve() // Skip if no objectUrl (SSR)
        }
      } catch (error) {
        console.error('Error in drawImage:', error)
        resolve() // Resolve anyway to prevent hanging
      }
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")

    if (!canvas || !ctx) return

    const drawCard = async () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      if (cardData.designStyle.backgroundGradient) {
        const { gradientColors, backgroundGradientType, backgroundGradientAngle } =
          cardData.designStyle
        let gradient

        if (backgroundGradientType === "linear") {
          const angle = (backgroundGradientAngle * Math.PI) / 180
          const x1 = canvas.width / 2 - Math.cos(angle) * canvas.width
          const y1 = canvas.height / 2 - Math.sin(angle) * canvas.height
          const x2 = canvas.width / 2 + Math.cos(angle) * canvas.width
          const y2 = canvas.height / 2 + Math.sin(angle) * canvas.height
          gradient = ctx.createLinearGradient(x1, y1, x2, y2)
        } else {
          gradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2,
            Math.max(canvas.width, canvas.height) / 2
          )
        }

        gradientColors.forEach((color, index) => {
          gradient.addColorStop(index / (gradientColors.length - 1), color)
        })
        ctx.fillStyle = gradient
      } else {
        ctx.fillStyle = cardData.backgroundColor
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw pattern
      if (cardData.designStyle.pattern !== "none") {
        drawPattern(ctx)
      }

      // Draw images
      if (cardData.profileImage.file) {
        await drawImage(
          ctx,
          cardData.profileImage.file,
          cardData.profileImage.x || 20,
          cardData.profileImage.y || 20,
          cardData.profileImage.size || 100,
          cardData.profileImage.style
        )
      }

      if (cardData.logoImage.file) {
        await drawImage(
          ctx,
          cardData.logoImage.file,
          cardData.logoImage.x || 280,
          cardData.logoImage.y || 20,
          cardData.logoImage.size || 100,
          cardData.logoImage.style
        )
      }

      // Draw text
      ctx.fillStyle = cardData.textColor
      const textFields = [
        cardData.name,
        cardData.title,
        cardData.company,
        cardData.email,
        cardData.phone,
        cardData.website,
      ]

      textFields.forEach((field) => {
        if (field.text) {
          ctx.font = `${field.size}px ${field.font}`
          ctx.fillText(field.text, field.x, field.y)
        }
      })

      // Draw services
      if (cardData.services) {
        cardData.services.forEach((service, index) => {
          if (service.text) {
            ctx.font = `${service.size}px ${service.font}`
            ctx.fillText(service.text, service.x, service.y)
          }
        })
      }

      // Apply overlay
      if (cardData.designStyle.overlay !== "none") {
        applyOverlay(ctx)
      }

      // Draw border
      if (cardData.designStyle.borderStyle !== "none") {
        drawBorder(ctx)
      }

      // Draw services as absolute positioned divs
      {cardData.services?.map((service, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: service.x,
            top: service.y,
            fontSize: service.size,
            fontFamily: service.font,
            color: service.color || cardData.textColor,
            fontStyle: service.textStyle === "italic" || service.textStyle === "boldItalic" ? "italic" : "normal",
            fontWeight: service.textStyle === "bold" || service.textStyle === "boldItalic" ? "bold" : "normal",
            textDecoration: service.underline ? "underline" : "none",
            textShadow: service.shadow ? "2px 2px 4px rgba(0,0,0,0.3)" : "none",
            cursor: "move",
            userSelect: "none",
            transition: "all 0.3s ease"
          }}
          onMouseDown={(e) => handleDragStart(e, `services.${index}`)}
        >
          {service.text}
        </div>
      ))}
    }

    drawCard()
  }, [cardData])

  return (
    <Card>
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <canvas ref={canvasRef} width={400} height={350} className="w-full h-auto border border-border rounded" />
        </motion.div>
      </CardContent>
    </Card>
  )
}

