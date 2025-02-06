"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Label } from "../../components/ui/label"

interface DragDropImageProps {
  onImageUpload: (file: File) => void
  label: string
}

export function DragDropImage({ onImageUpload, label }: DragDropImageProps) {
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0])
    }
  }, [onImageUpload])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"]
    },
    multiple: false,
  })

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}
        `}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-muted-foreground">
          Перетащите изображение сюда или кликните для выбора
        </p>
      </div>
    </div>
  )
}

