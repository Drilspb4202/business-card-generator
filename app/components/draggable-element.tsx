"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface DraggableElementProps {
  children: React.ReactNode
  x: number
  y: number
  onPositionChange: (x: number, y: number) => void
  className?: string
}

export function DraggableElement({
  children,
  x,
  y,
  onPositionChange,
  className = "",
}: DraggableElementProps) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x, y }}
      style={{ x, y, position: "absolute", cursor: "move", touchAction: "none" }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(event, info) => {
        setIsDragging(false)
        onPositionChange(x + info.offset.x, y + info.offset.y)
      }}
      whileDrag={{ scale: 1.05 }}
      className={`${className} ${isDragging ? "z-50" : "z-0"}`}
    >
      {children}
    </motion.div>
  )
} 