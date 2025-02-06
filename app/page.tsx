"use client"

import { useState, useEffect } from "react"
import { CardPreview } from "./components/card-preview"
import CardCustomizer from "./components/card-customizer"
import { AISuggestions } from "./components/ai-suggestions"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ThemeProvider } from "./components/theme-provider"
import { ThemeToggle } from "./components/theme-toggle"
import { Toaster } from "sonner"
import FileSaver from "file-saver"
import { toast } from "sonner"

interface ElementStyle {
  shape: string
  borderRadius: number
  rotation: number
  opacity: number
}

interface HistoryState {
  past: any[]
  present: any
  future: any[]
}

export default function CardGenerator() {
  // История изменений
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: null,
    future: [],
  })

  // Доступные шрифты
  const availableFonts = [
    "Arial",
    "Helvetica",
    "Roboto",
    "Open Sans",
    "Montserrat",
    "Playfair Display",
    "Lato",
    "Poppins",
    "Georgia",
    "Times New Roman",
  ]

  const [cardData, setCardData] = useState({
    name: { text: "", x: 20, y: 50, size: 24, font: "Inter" },
    title: { text: "", x: 20, y: 80, size: 16, font: "Inter" },
    company: { text: "", x: 20, y: 110, size: 18, font: "Inter" },
    email: { text: "", x: 20, y: 140, size: 14, font: "Inter" },
    phone: { text: "", x: 20, y: 170, size: 14, font: "Inter" },
    website: { text: "", x: 20, y: 200, size: 14, font: "Inter" },
    services: [],
    backgroundColor: "#ffffff",
    textColor: "#000000",
    profileImage: {
      file: null,
      style: { shape: "circle", shadow: true, shadowBlur: 10 }
    },
    logoImage: {
      file: null,
      style: { shape: "square", shadow: true, shadowBlur: 5 }
    },
    designStyle: {
      backgroundGradient: false,
      gradientColors: ["#ffffff", "#f0f0f0"],
      backgroundGradientType: "linear",
      backgroundGradientAngle: 45,
      pattern: "none",
      overlay: "none",
      borderStyle: "none"
    }
  })

  // Инициализация истории
  useEffect(() => {
    if (!history.present) {
      setHistory({
        past: [],
        present: cardData,
        future: [],
      })
    }
  }, [])

  // Загрузка сохраненного дизайна при монтировании
  useEffect(() => {
    const savedDesign = localStorage.getItem("savedCardDesign")
    if (savedDesign) {
      try {
        const parsedDesign = JSON.parse(savedDesign)
        setCardData(parsedDesign)
        toast.success("Загружен сохраненный дизайн")
      } catch (error) {
        console.error("Error loading saved design:", error)
      }
    }
  }, [])

  const handleInputChange = (field: string, value: any) => {
    saveToHistory()
    setCardData((prevData) => ({ ...prevData, [field]: value }))
  }

  const handleFontChange = (field: string, font: string) => {
    saveToHistory()
    setCardData((prevData) => ({
      ...prevData,
      [field]: { ...prevData[field], font },
    }))
  }

  const handleElementMove = (field: string, x: number, y: number) => {
    if (field.startsWith("services.")) {
      const index = parseInt(field.split(".")[1])
      const newServices = [...cardData.services]
      newServices[index] = { ...newServices[index], x, y }
      setCardData({ ...cardData, services: newServices })
    } else {
      saveToHistory()
      setCardData((prevData) => ({
        ...prevData,
        [field]: { ...prevData[field], x, y }
      }))
    }
  }

  const handleElementResize = (element: string, size: number) => {
    saveToHistory()
    setCardData((prevData) => ({
      ...prevData,
      [element]: { ...prevData[element], size },
    }))
  }

  const handleElementStyle = (
    element: string,
    styleProperty: keyof ElementStyle,
    value: any
  ) => {
    saveToHistory()
    setCardData((prevData) => ({
      ...prevData,
      [element]: {
        ...prevData[element],
        style: {
          ...prevData[element].style,
          [styleProperty]: value,
        },
      },
    }))
  }

  // Сохранение текущего состояния в историю
  const saveToHistory = () => {
    setHistory((prev) => ({
      past: [...prev.past, prev.present],
      present: cardData,
      future: [],
    }))
  }

  // Отмена последнего действия
  const undo = () => {
    if (history.past.length === 0) return
    const previous = history.past[history.past.length - 1]
    const newPast = history.past.slice(0, history.past.length - 1)
    
    setHistory({
      past: newPast,
      present: previous,
      future: [history.present, ...history.future],
    })
    setCardData(previous)
    toast.info("Отменено последнее действие")
  }

  // Повтор отмененного действия
  const redo = () => {
    if (history.future.length === 0) return
    const next = history.future[0]
    const newFuture = history.future.slice(1)
    
    setHistory({
      past: [...history.past, history.present],
      present: next,
      future: newFuture,
    })
    setCardData(next)
    toast.info("Действие восстановлено")
  }

  // Сохранение дизайна
  const saveDesign = () => {
    try {
      localStorage.setItem("savedCardDesign", JSON.stringify(cardData))
      toast.success("Дизайн сохранен")
    } catch (error) {
      console.error("Error saving design:", error)
      toast.error("Ошибка при сохранении дизайна")
    }
  }

  // Сброс дизайна
  const resetDesign = () => {
    saveToHistory()
    setCardData({
      ...cardData,
      backgroundColor: "#ffffff",
      textColor: "#000000",
      designStyle: {
        pattern: "none",
        overlay: "none",
        gradientColors: [],
        borderStyle: "none",
        fontFamily: "Arial",
        shadow: false,
        shadowColor: "rgba(0,0,0,0.1)",
        shadowBlur: 5,
        textShadow: false,
        textShadowColor: "rgba(0,0,0,0.2)",
        textShadowBlur: 2,
        backgroundGradient: false,
        backgroundGradientType: "linear",
        backgroundGradientAngle: 45,
      },
    })
    toast.info("Дизайн сброшен")
  }

  const handleDownload = () => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement
    canvas.toBlob((blob) => {
      if (blob) {
        FileSaver.saveAs(blob, "business-card.png")
      }
    })
  }

  const handleAISuggestion = (suggestion: any) => {
    saveToHistory()
    setCardData((prev) => {
      const currentFiles = {
        profileImage: {
          ...prev.profileImage,
          file: prev.profileImage.file,
        },
        logoImage: {
          ...prev.logoImage,
          file: prev.logoImage.file,
        },
        backgroundImage: prev.backgroundImage,
      }

      const newData = {
        ...suggestion,
        profileImage: {
          ...suggestion.profileImage,
          ...currentFiles.profileImage,
        },
        logoImage: {
          ...suggestion.logoImage,
          ...currentFiles.logoImage,
        },
        backgroundImage: currentFiles.backgroundImage,
        qrCodeStyle: prev.qrCodeStyle,
        qrCodePosition: prev.qrCodePosition,
      }

      return newData
    })
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vcard-theme">
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Toaster />
        <header className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg" />
              </motion.div>
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
              >
                Генератор визиток Метальниковой Елены
              </motion.h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={undo}
                disabled={history.past.length === 0}
                variant="outline"
                size="icon"
                title="Отменить"
              >
                ↩
              </Button>
              <Button
                onClick={redo}
                disabled={history.future.length === 0}
                variant="outline"
                size="icon"
                title="Повторить"
              >
                ↪
              </Button>
              <Button
                onClick={saveDesign}
                variant="outline"
                size="icon"
                title="Сохранить"
              >
                💾
              </Button>
              <Button
                onClick={resetDesign}
                variant="outline"
                size="icon"
                title="Сбросить"
              >
                🗑
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-8 lg:grid-cols-[1fr,400px]"
          >
            <div className="space-y-8">
              <AISuggestions onApplySuggestion={handleAISuggestion} />
              <Tabs defaultValue="customize" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="customize">Настройка</TabsTrigger>
                  <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
                </TabsList>
                <TabsContent value="customize">
                  <CardCustomizer
                    cardData={cardData}
                    availableFonts={availableFonts}
                    onInputChange={handleInputChange}
                    onFontChange={handleFontChange}
                    onElementMove={handleElementMove}
                    onElementResize={handleElementResize}
                    onElementStyle={handleElementStyle}
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <div className="flex flex-col items-center">
                    <CardPreview cardData={cardData} onElementMove={handleElementMove} />
                    <Button
                      onClick={handleDownload}
                      className="mt-4 w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Скачать визитку
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="hidden lg:block">
              <div className="sticky top-8">
                <CardPreview cardData={cardData} onElementMove={handleElementMove} />
                <Button
                  onClick={handleDownload}
                  className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Скачать визитку
                </Button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </ThemeProvider>
  )
}

