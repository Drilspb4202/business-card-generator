"use client"

import { useState, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentColor, setCurrentColor] = useState(color)

  useEffect(() => {
    setCurrentColor(color)
  }, [color])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setCurrentColor(newColor)
    onChange(newColor)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-10 p-1"
          style={{ backgroundColor: currentColor }}
        >
          <div className="w-full h-full rounded" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <div
            className="w-full h-32 rounded-lg border"
            style={{ backgroundColor: currentColor }}
          />
          <Input
            type="color"
            value={currentColor}
            onChange={handleColorChange}
            className="h-10"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
} 